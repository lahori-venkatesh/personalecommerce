export const getOrderConfirmationEmail = (customerName: string, orderId: string, amount: number, items: string) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://venkateshlahori.in';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #000000;
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
      background-image: linear-gradient(to bottom right, #000000, #1a1a1a);
    }
    .logo {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin-bottom: 10px;
      display: inline-block;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 20px;
      color: #111827;
      margin-bottom: 16px;
      font-weight: 600;
    }
    .message {
      color: #4b5563;
      margin-bottom: 30px;
      font-size: 16px;
    }
    .order-card {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 30px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      color: #6b7280;
      font-size: 15px;
    }
    .detail-row:last-child {
      margin-bottom: 0;
      font-weight: 700;
      color: #111827;
      border-top: 1px solid #e5e7eb;
      padding-top: 12px;
      margin-top: 12px;
      font-size: 18px;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .button {
      display: inline-block;
      background-color: #000000;
      color: #ffffff;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s;
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      color: #9ca3af;
      font-size: 13px;
      border-top: 1px solid #e5e7eb;
    }
    .social-links {
      margin-top: 15px;
    }
    .social-links a {
      color: #6b7280;
      margin: 0 10px;
      text-decoration: none;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">✨ Venkatesh Lahori</div>
      <h1>Order Confirmed! 🎉</h1>
    </div>
    <div class="content">
      <p class="greeting">Hi ${customerName} 👋,</p>
      <p class="message">Thank you for your purchase! We're excited to help you on your journey. Your order has been successfully processed.</p>
      
      <div class="order-card">
        <div class="detail-row">
          <span>Order ID</span>
          <span style="font-family: monospace;">#${orderId.slice(-6).toUpperCase()}</span>
        </div>
        <div class="detail-row">
          <span>Item</span>
          <span>${items}</span>
        </div>
        <div class="detail-row">
          <span>Total Paid</span>
          <span>₹${amount}</span>
        </div>
      </div>

      <p class="message" style="text-align: center; margin-bottom: 10px;">
        You can access your invoice and download your products directly from your dashboard.
      </p>
      
      <div class="button-container">
        <a href="${appUrl}/account" class="button">Login to Account & View Order 👉</a>
      </div>
    </div>
    <div class="footer">
      <p>If you have any questions, just reply to this email!</p>
      <p>&copy; ${new Date().getFullYear()} Venkatesh Lahori. All rights reserved.</p>
      <div class="social-links">
        <a href="https://www.linkedin.com/in/venkatesh-lahori/">LinkedIn</a> •
        <a href="https://x.com/NIT_Venkatesh">Twitter</a> •
        <a href="https://github.com/lahori-venkatesh">GitHub</a>
      </div>
    </div>
  </div>
</body>
</html>
  `
}
