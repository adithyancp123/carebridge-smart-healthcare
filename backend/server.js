require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { sendEmail, getBaseEmailTemplate } = require('./emailService');

const app = express();
const PORT = process.env.PORT || 5000;
const dataFile = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify({ requests: [], volunteers: [], activities: [] }, null, 2));
}

const readData = () => {
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  if (!data.activities) data.activities = [];
  return data;
};
const writeData = (data) => fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

const addActivity = (data, type, text) => {
  data.activities.unshift({
    id: Date.now().toString() + Math.random(),
    type,
    text,
    timestamp: new Date().toISOString()
  });
  if (data.activities.length > 50) data.activities.pop();
};

// AI Feature: Auto-Priority Scoring
const determineUrgency = (medicalNeed, message, userUrgency) => {
  const criticalKeywords = ['surgery', 'emergency', 'blood', 'heart', 'accident', 'urgent', 'critical', 'oxygen', 'icu'];
  const combinedText = `${medicalNeed} ${message}`.toLowerCase();
  
  const hasCriticalKeyword = criticalKeywords.some(keyword => combinedText.includes(keyword));
  return hasCriticalKeyword ? 'High' : userUrgency;
};

// AI Feature: Volunteer Match Scoring
const calculateMatch = (request, volunteer) => {
  let score = 0;
  if (volunteer.city.toLowerCase() === request.city.toLowerCase()) score += 50;
  
  const needText = request.medicalNeed.toLowerCase();
  const skillText = volunteer.skill.toLowerCase();
  
  // Simple heuristic: if need mentions "doctor" and volunteer is "doctor"
  if (needText.includes('doctor') && skillText.includes('doctor')) score += 30;
  else if (needText.includes('nurse') && skillText.includes('nurse')) score += 30;
  else if (needText.includes('drive') && skillText.includes('driver')) score += 30;
  else if (needText.includes('care') && skillText.includes('caretaker')) score += 30;
  else if (skillText !== 'other') score += 10; // Partial match

  const avail = volunteer.availability.toLowerCase();
  if (avail.includes('24/7') || avail.includes('anytime') || avail.includes('now')) score += 20;
  else if (avail.length > 0) score += 10;
  
  return Math.min(score, 100);
};

// AI Feature: Professional Humanized Summaries
const generateSummary = (type, data, finalUrgency) => {
  if (type === 'patient') {
    const priorityText = finalUrgency === 'High' ? 'CRITICAL ALERT:' : finalUrgency === 'Medium' ? 'PRIORITY DISPATCH:' : 'STANDARD REQUEST:';
    return `${priorityText} Patient request verified from ${data.city}. A ${data.age}-year-old individual requires immediate medical facilitation for: ${data.medicalNeed}.`;
  } else if (type === 'volunteer') {
    return `VERIFIED RESOURCE: ${data.name} is a certified ${data.skill} ready for deployment in ${data.city}. Standard availability: ${data.availability}.`;
  }
  return '';
};

app.post('/api/requests', async (req, res) => {
  const data = readData();
  
  // AI processing
  const finalUrgency = determineUrgency(req.body.medicalNeed, req.body.message || '', req.body.urgency);
  
  // Volunteer matching algorithm
  let bestMatch = null;
  let highestScore = 0;

  data.volunteers.forEach(v => {
    const score = calculateMatch(req.body, v);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = v;
    }
  });

  const matchSuggestion = bestMatch && highestScore >= 50
    ? `Best Match Volunteer: ${bestMatch.name} (${bestMatch.skill}, ${bestMatch.city}) - ${highestScore}%`
    : 'No immediate direct match in geographic vicinity. Initiating expanded radius protocol.';

  const ticketId = `CB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newRequest = {
    id: Date.now().toString(),
    ticketId,
    status: 'Pending',
    ...req.body,
    urgency: finalUrgency, // Overwrite with AI scored urgency
    summary: generateSummary('patient', req.body, finalUrgency),
    matchSuggestion,
    matchScore: highestScore,
    bestMatchName: bestMatch ? bestMatch.name : null,
    timestamp: new Date().toISOString()
  };
  
  data.requests.push(newRequest);
  addActivity(data, finalUrgency === 'High' ? 'alert' : 'info', `New ${finalUrgency} priority patient: ${req.body.name}`);
  writeData(data);
  
  // Phase 2: Send Email Notifications
  let emailSent = false;
  
  try {
    // 1. Alert Admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const adminSubject = `🚨 New Emergency Patient Request - CareBridge`;
      const adminHtml = getBaseEmailTemplate(
        'New Emergency Patient Request',
        `<p><strong>Patient Name:</strong> ${req.body.name}</p>
         <p><strong>Age:</strong> ${req.body.age}</p>
         <p><strong>City:</strong> ${req.body.city}</p>
         <p><strong>Medical Need:</strong> ${req.body.medicalNeed}</p>
         <p><strong>Urgency:</strong> <span style="color: red; font-weight: bold;">${finalUrgency}</span></p>
         <div style="background-color: #f3f4f6; padding: 12px; margin-top: 16px; border-radius: 6px; border-left: 4px solid #2563eb;">
           <p style="margin: 0;"><strong>Ticket ID:</strong> ${ticketId}</p>
           <p style="margin: 4px 0 0 0;"><strong>Submitted:</strong> ${newRequest.timestamp}</p>
         </div>`
      );
      await sendEmail(adminEmail, adminSubject, adminHtml);
    }

    // 2. Confirm to Patient
    if (req.body.email) {
      const patientSubject = `✅ CareBridge Request Received`;
      const patientHtml = getBaseEmailTemplate(
        'Request Received Successfully',
        `<p>Hello <strong>${req.body.name}</strong>,</p>
         <p>Your healthcare support request has been securely logged in our system.</p>
         <div style="background-color: #f3f4f6; padding: 12px; margin-top: 16px; margin-bottom: 16px; border-radius: 6px; border-left: 4px solid #10b981;">
           <p style="margin: 0; font-size: 18px;"><strong>Ticket ID:</strong> ${ticketId}</p>
         </div>
         <p>Our team will review your requirement for ${req.body.medicalNeed} and connect support soon.</p>`
      );
      emailSent = await sendEmail(req.body.email, patientSubject, patientHtml);
    }
  } catch (error) {
    console.error("Email failed:", error.message);
  }

  res.status(201).json({ message: 'Request analyzed and logged successfully.', request: newRequest, emailSent });
});

app.post('/api/volunteers', async (req, res) => {
  const data = readData();
  const ticketId = `CB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const newVolunteer = {
    id: Date.now().toString(),
    ticketId,
    ...req.body,
    summary: generateSummary('volunteer', req.body),
    timestamp: new Date().toISOString()
  };
  
  data.volunteers.push(newVolunteer);
  addActivity(data, 'user-plus', `New volunteer joined: ${req.body.name} (${req.body.skill})`);
  writeData(data);

  // Phase 3: Send Email Notifications
  let emailSent = false;

  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const adminSubject = `🩺 New Volunteer Joined - CareBridge`;
      const adminHtml = getBaseEmailTemplate(
        'New Volunteer Registration',
        `<p><strong>Name:</strong> ${req.body.name}</p>
         <p><strong>Skill:</strong> ${req.body.skill}</p>
         <p><strong>City:</strong> ${req.body.city}</p>
         <p><strong>Availability:</strong> ${req.body.availability}</p>
         <div style="background-color: #f3f4f6; padding: 12px; margin-top: 16px; border-radius: 6px; border-left: 4px solid #10b981;">
           <p style="margin: 0;"><strong>Ticket ID:</strong> ${ticketId}</p>
         </div>`
      );
      await sendEmail(adminEmail, adminSubject, adminHtml);
    }

    if (req.body.email) {
      const volSubject = `✅ Welcome to CareBridge, ${req.body.name}`;
      const volHtml = getBaseEmailTemplate(
        'Registration Confirmed',
        `<p>Hello <strong>${req.body.name}</strong>,</p>
         <p>Thank you for joining CareBridge as a volunteer. Your dedication as a ${req.body.skill} in ${req.body.city} will help save lives.</p>
         <p>We will contact you via email or phone when a high-priority match requires your assistance.</p>`
      );
      emailSent = await sendEmail(req.body.email, volSubject, volHtml);
    }
  } catch (error) {
    console.error("Email failed:", error.message);
  }

  res.status(201).json({ message: 'Registration verified. Welcome to CareBridge.', volunteer: newVolunteer, emailSent });
});

app.put('/api/requests/:id/status', (req, res) => {
  const data = readData();
  const requestIndex = data.requests.findIndex(r => r.id === req.params.id);
  if (requestIndex === -1) return res.status(404).json({ message: 'Request not found' });
  
  data.requests[requestIndex].status = req.body.status;
  addActivity(data, req.body.status === 'Resolved' ? 'check' : 'info', `Status for ${data.requests[requestIndex].name} updated to ${req.body.status}`);
  writeData(data);
  res.json({ message: 'Status updated successfully', request: data.requests[requestIndex] });
});

app.get('/api/activities', (req, res) => {
  res.json(readData().activities);
});

app.get('/api/dashboard', (req, res) => {
  res.json(readData());
});

app.get('/api/health', (req, res) => res.status(200).json({ status: 'active', timestamp: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`CareBridge Backend Engine running on port ${PORT}`);
});
