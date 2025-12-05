export const getOrderConfirmationEmail = (customerName: string, orderId: string, amount: number, items: string) => {
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
      background-color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #000000;
      color: #ffffff;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      color: #111827;
      margin-bottom: 20px;
    }
    .order-details {
      background-color: #f3f4f6;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      color: #4b5563;
    }
    .detail-row:last-child {
      margin-bottom: 0;
      font-weight: 600;
      color: #111827;
      border-top: 1px solid #e5e7eb;
      padding-top: 10px;
      margin-top: 10px;
    }
    .button {
      display: inline-block;
      background-color: #000000;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 600;
      margin-top: 20px;
      text-align: center;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      border-top: 1px solid #e5e7eb;
    }
    .social-links {
      margin-top: 10px;
    }
    .social-links a {
      color: #6b7280;
      margin: 0 10px;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Confirmed!</h1>
    </div>
    <div class="content">
      <p class="greeting">Hi ${customerName},</p>
      <p>Thank you for your purchase! We're excited to help you on your journey. Here are your order details:</p>
      
      <div class="order-details">
        <div class="detail-row">
          <span>Order ID:</span>
          <span>#${orderId.slice(-6).toUpperCase()}</span>
        </div>
        <div class="detail-row">
          <span>Item:</span>
          <span>${items}</span>
        </div>
        <div class="detail-row">
          <span>Total Paid:</span>
          <span>₹${amount}</span>
        </div>
      </div>

      <p>You can access your invoice and download any digital products from your dashboard.</p>
      
      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders" class="button">Login to Account & View Order</a>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Venkatesh Lahori. All rights reserved.</p>
      <div class="social-links">
        <a href="#">LinkedIn</a>
        <a href="#">Twitter</a>
        <a href="#">Instagram</a>
      </div>
    </div>
  </div>
</body>
</html>
  `
}
