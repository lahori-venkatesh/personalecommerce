# Venkatesh Lahori - Landing Page & Booking System

A full-stack Next.js application for technical interview coaching, mentorship, and digital product sales.

## Features

- **Landing Page**: Modern, responsive design with hero section, services, products, and testimonials
- **Service Booking**: Book mock interviews, mentorship sessions, and other services with calendar integration
- **Product Purchase**: Buy digital products (notes, guides) with preview functionality
- **Payment Integration**: Razorpay integration for secure payments
- **Admin Panel**: Complete admin dashboard for managing services, products, orders, and users
- **User Account**: View order history and access purchased products/services
- **Database**: SQLite database with Prisma ORM

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Payment**: Razorpay
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXT_PUBLIC_RAZORPAY_KEY_ID="your_razorpay_key_id"
   RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
   ```

3. **Initialize Database**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Landing Page: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin
   - User Account: http://localhost:3000/account

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── admin/            # Admin panel pages
│   ├── account/          # User account page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── Products.tsx
│   ├── Testimonials.tsx
│   └── BookingModal.tsx
├── lib/
│   └── prisma.ts        # Prisma client
└── prisma/
    └── schema.prisma    # Database schema
```

## API Endpoints

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create service (admin)
- `PUT /api/services/[id]` - Update service (admin)
- `DELETE /api/services/[id]` - Delete service (admin)

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Orders
- `GET /api/orders` - Get orders (with optional filters)
- `POST /api/orders/create` - Create order and Razorpay order
- `PUT /api/orders/[id]/fulfill` - Mark order as fulfilled

### Payments
- `POST /api/payments/verify` - Verify Razorpay payment
- `POST /api/payments/webhook` - Razorpay webhook handler

### Admin
- `GET /api/admin/stats` - Get dashboard statistics

## Razorpay Setup

1. Sign up for a Razorpay account at https://razorpay.com
2. Get your Key ID and Key Secret from the dashboard
3. Add them to your `.env` file
4. For webhooks, configure the webhook URL in Razorpay dashboard:
   `https://yourdomain.com/api/payments/webhook`

## Database Schema

- **User**: Customer information
- **Service**: Service offerings (mock interviews, mentorship, etc.)
- **Product**: Digital products (notes, guides)
- **Order**: Orders and bookings
- **Testimonial**: Customer testimonials
- **Admin**: Admin users (for future authentication)

## Security Notes

- Admin routes should be protected with authentication (currently open for development)
- Payment verification uses HMAC SHA256 signature verification
- Sensitive data should be encrypted in production
- Use HTTPS in production
- Implement rate limiting for API routes

## Future Enhancements

- User authentication and sessions
- Email notifications (SendGrid, Resend, etc.)
- WhatsApp integration for confirmations
- File upload for product files
- Advanced calendar booking with availability management
- Analytics and reporting
- Multi-language support

## License

ISC

