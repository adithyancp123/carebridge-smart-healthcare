const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const captureScreenshots = async () => {
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const routes = [
    { name: 'homepage', url: 'http://localhost:5173/' },
    { name: 'patient-form', url: 'http://localhost:5173/request-help' },
    { name: 'volunteer-form', url: 'http://localhost:5173/volunteer' },
    { name: 'dashboard', url: 'http://localhost:5173/dashboard' },
  ];

  for (const route of routes) {
    console.log(`Capturing ${route.name}...`);
    await page.goto(route.url, { waitUntil: 'networkidle2' });
    await page.screenshot({ path: path.join(screenshotsDir, `${route.name}.png`), fullPage: true });
  }

  await browser.close();
  console.log('Screenshots captured successfully.');
};

captureScreenshots().catch(console.error);
