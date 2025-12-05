import nodemailer from 'nodemailer'

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
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions = {
      from: process.env.SMTP_USER, // Sender address (must be the same as auth user for Gmail)
      to: to,
      subject: subject,
      html: html,
    }

    const info = await transporter.sendMail(mailOptions)

    console.log('Message sent: %s', info.messageId)
    return { success: true, response: info }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}
