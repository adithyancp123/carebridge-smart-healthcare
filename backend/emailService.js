const { Resend } = require('resend');

// Only instantiate if API key is present
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const sendEmail = async (to, subject, html) => {
  if (!resend) {
    console.warn('[EMAIL SERVICE] Resend API key missing. Skipping email send.');
    return false;
  }
  
  if (!to) {
    console.warn('[EMAIL SERVICE] No recipient provided. Skipping email send.');
    return false;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'CareBridge <onboarding@resend.dev>', // Resend sandbox default
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('[EMAIL SERVICE] Error sending email:', error);
      return false;
    }
    
    console.log('[EMAIL SERVICE] Email sent successfully:', data.id);
    return true;
  } catch (error) {
    console.error('[EMAIL SERVICE] Exception while sending email:', error);
    return false;
  }
};

const getBaseEmailTemplate = (title, content) => `
  <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <div style="background-color: #2563eb; padding: 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">CareBridge</h1>
      <p style="color: #bfdbfe; margin: 8px 0 0 0; font-size: 14px;">Smart Healthcare Matching</p>
    </div>
    <div style="padding: 32px; background-color: #ffffff; color: #1f2937;">
      <h2 style="margin-top: 0; color: #111827; font-size: 20px;">${title}</h2>
      ${content}
    </div>
    <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
      <p style="margin: 0;">&copy; ${new Date().getFullYear()} CareBridge Healthcare. All rights reserved.</p>
      <p style="margin: 4px 0 0 0;">This is an automated notification. Please do not reply.</p>
    </div>
  </div>
`;

module.exports = {
  sendEmail,
  getBaseEmailTemplate
};
