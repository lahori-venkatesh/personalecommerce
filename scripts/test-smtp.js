const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Manually parse .env to avoid dependency issues if dotenv isn't installed globally
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    env[match[1].trim()] = value;
  }
});

const user = env.SMTP_USER;
const pass = env.SMTP_PASS;

console.log('--- Debugging SMTP Credentials ---');
console.log(`SMTP_USER found: ${user ? 'YES' : 'NO'}`);
if (user) {
  console.log(`SMTP_USER length: ${user.length}`);
  console.log(`SMTP_USER value: "${user}"`); // Safe to show email
}

console.log(`SMTP_PASS found: ${pass ? 'YES' : 'NO'}`);
if (pass) {
  console.log(`SMTP_PASS length: ${pass.length}`);
  console.log(`SMTP_PASS has spaces: ${pass.includes(' ') ? 'YES (BAD!)' : 'NO'}`);
  console.log(`SMTP_PASS first char: ${pass[0]}`);
  console.log(`SMTP_PASS last char: ${pass[pass.length - 1]}`);
}
console.log('----------------------------------');

if (!user || !pass) {
  console.error('Error: Missing SMTP_USER or SMTP_PASS in .env');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: user,
    pass: pass,
  },
});

console.log('Attempting to send test email...');

transporter.sendMail({
  from: user,
  to: user, // Send to self
  subject: 'SMTP Debug Test',
  text: 'If you receive this, your SMTP configuration is correct!',
}, (error, info) => {
  if (error) {
    console.error('❌ Failed to send email:');
    console.error(error);
  } else {
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  }
});
