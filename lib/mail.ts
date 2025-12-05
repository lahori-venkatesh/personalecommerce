import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || '',
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    const sentFrom = new Sender(process.env.MAILERSEND_FROM_EMAIL || "info@venkateshlahori.com", process.env.MAILERSEND_FROM_NAME || "Venkatesh Lahori");
    const recipients = [
      new Recipient(to, to)
    ];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(subject)
      .setHtml(html);

    const response = await mailerSend.email.send(emailParams);

    console.log('Message sent:', response);
    return { success: true, response }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}
