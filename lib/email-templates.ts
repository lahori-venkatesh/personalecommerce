export const emailTemplates = {
  orderConfirmation: (order: any) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 20px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Order Confirmation</h2>
          </div>
          <div class="content">
            <p>Hi ${order.customerName},</p>
            <p>Thank you for your purchase! Your order has been confirmed.</p>
            
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> #${order.id.slice(-8).toUpperCase()}</p>
            <p><strong>Amount:</strong> ₹${order.amount}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            
            ${order.slotDateTime ? `<p><strong>Scheduled Slot:</strong> ${new Date(order.slotDateTime).toLocaleString()}</p>` : ''}
            
            <p>You can view your order details and download your invoice by logging into your account.</p>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/account" class="button">View Order</a>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Venkatesh Lahori. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `,
}
