# FarmVilla Payment Gateway Setup Guide

## Overview
This guide will help you set up the comprehensive UPI payment gateway system with Razorpay integration for the FarmVilla platform.

## Features Implemented

### ✅ Core Payment Features
- **Razorpay Integration**: Complete payment gateway setup with UPI, Cards, Net Banking, and Wallets
- **UPI QR Codes**: Dynamic QR code generation for UPI payments
- **UPI Intent**: Direct UPI app integration for seamless payments
- **Preset Donation Amounts**: Quick donation options (₹100, ₹500, ₹1000, ₹2500, ₹5000, ₹10000)
- **Custom Amounts**: Allow donors to enter any amount
- **Anonymous Donations**: Option to donate without revealing identity

### ✅ Recurring Donations
- **Frequency Options**: Monthly, Quarterly, Yearly recurring donations
- **Automated Processing**: Cron job scheduler for recurring payments
- **Email Notifications**: Automated reminders for upcoming recurring payments

### ✅ Security & Compliance
- **AES-256 Encryption**: All sensitive data encrypted in database
- **Data Tokenization**: UPI IDs and donor information masked
- **PCI DSS Compliance**: Secure payment processing standards
- **Admin-only Access**: Full donor details restricted to administrators

### ✅ Receipt & Notifications
- **PDF Receipt Generation**: Automatic tax-deductible receipts
- **Email Notifications**: Confirmation emails to donors and NGOs
- **SMS Alerts**: Transaction confirmations via Twilio
- **WhatsApp Sharing**: Easy social sharing of donations

### ✅ User Experience
- **Payment Success UI**: Confetti animation and celebration screen
- **Transaction IDs**: Unique randomized IDs (TXN-AGRI-XXXXXX format)
- **Download/Share Options**: Receipt download and social sharing
- **Multilingual Support**: English, Malayalam, and Tamil translations

### ✅ Admin Dashboard
- **Transaction Management**: View all payments with filtering and search
- **Analytics Dashboard**: Payment trends and statistics
- **Refund Processing**: Admin interface for processing refunds
- **Export Functionality**: CSV export of transaction data

## Installation & Setup

### 1. Backend Dependencies

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

New dependencies added:
- `razorpay`: Payment gateway integration
- `crypto`: Encryption utilities
- `node-cron`: Recurring payment scheduler
- `nodemailer`: Email notifications
- `twilio`: SMS notifications
- `pdfkit`: PDF receipt generation
- `qrcode`: UPI QR code generation

### 2. Frontend Dependencies

Navigate to the root directory and install dependencies:

```bash
npm install
```

New dependencies added:
- `react-confetti`: Celebration animations

### 3. Environment Configuration

Update your `.env` file in the backend directory:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Encryption Key for Payment Data (32 characters)
PAYMENT_ENCRYPTION_KEY=your_32_character_encryption_key_here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 4. Razorpay Setup

1. **Create Razorpay Account**:
   - Visit [https://razorpay.com](https://razorpay.com)
   - Sign up for a business account
   - Complete KYC verification

2. **Get API Keys**:
   - Go to Settings > API Keys
   - Generate Key ID and Key Secret
   - Add them to your `.env` file

3. **Configure Webhooks** (Optional):
   - Go to Settings > Webhooks
   - Add webhook URL: `https://yourdomain.com/api/payment/webhook`
   - Select events: `payment.captured`, `payment.failed`

### 5. Twilio Setup (for SMS)

1. **Create Twilio Account**:
   - Visit [https://twilio.com](https://twilio.com)
   - Sign up and verify your account

2. **Get Credentials**:
   - Find Account SID and Auth Token in console
   - Purchase a phone number for SMS
   - Add credentials to `.env` file

### 6. Email Setup

Configure SMTP settings for email notifications:
- Use Gmail SMTP or your preferred email service
- For Gmail, enable 2FA and create an app password
- Add credentials to `.env` file

## Database Schema

The payment system uses the following MongoDB collections:

### Donations Collection
```javascript
{
  transactionId: String (unique),
  razorpayOrderId: String,
  razorpayPaymentId: String,
  amount: Number,
  donor: {
    name: String,
    email: String (encrypted),
    phone: String (encrypted),
    isAnonymous: Boolean
  },
  recipient: ObjectId (ref: NGO),
  paymentMethod: String,
  status: String (pending/completed/failed/refunded),
  isRecurring: Boolean,
  recurringFrequency: String,
  nextPaymentDate: Date,
  receiptGenerated: Boolean,
  receiptUrl: String,
  notifications: {
    emailSent: Boolean,
    smsSent: Boolean
  },
  metadata: {
    userAgent: String,
    ipAddress: String (encrypted),
    source: String
  },
  createdAt: Date,
  completedAt: Date
}
```

## API Endpoints

### Payment Routes (`/api/payment`)

- `POST /create-order` - Create new payment order
- `POST /verify-payment` - Verify payment signature
- `GET /donation/:transactionId` - Get donation details
- `GET /recipient/:recipientId/donations` - Get donations for NGO
- `GET /payment-methods` - Get supported payment methods
- `POST /refund/:transactionId` - Process refund (Admin only)

### Admin Routes (`/api/payment/admin`)

- `GET /stats` - Get payment statistics
- `GET /donations` - Get all donations with filters
- `POST /export` - Export donation data

## Component Usage

### Donation Box Component

```tsx
import DonationBox from '@/components/DonationBox';

<DonationBox
  recipientId="ngo_id_here"
  recipientName="NGO Name"
  recipientType="NGO"
  onPaymentSuccess={(transactionId) => {
    // Handle successful payment
    console.log('Payment successful:', transactionId);
  }}
/>
```

### Payment Success Component

```tsx
import PaymentSuccess from '@/components/PaymentSuccess';

<PaymentSuccess
  transactionId="TXN-AGRI-123456"
  amount={1000}
  recipientName="NGO Name"
  donorName="John Doe"
  isRecurring={false}
  receiptUrl="/receipts/receipt_123.pdf"
  onClose={() => {
    // Handle close action
  }}
/>
```

## Security Considerations

### Data Encryption
- All sensitive data (email, phone, UPI ID, IP address) is encrypted using AES-256
- Encryption keys should be stored securely and rotated regularly
- Database backups should also be encrypted

### Payment Security
- Never store card details or sensitive payment information
- Use Razorpay's secure tokenization for recurring payments
- Implement proper webhook signature verification
- Use HTTPS for all payment-related communications

### Access Control
- Admin dashboard requires authentication
- Implement role-based access control
- Log all admin actions for audit trails
- Regular security audits and penetration testing

## Testing

### Test Mode Setup
1. Use Razorpay test keys for development
2. Test with sample UPI IDs and card numbers
3. Verify webhook handling with test events
4. Test recurring payment scheduling

### Test Cases
- ✅ Successful UPI payment
- ✅ Failed payment handling
- ✅ Recurring donation setup
- ✅ Receipt generation
- ✅ Email/SMS notifications
- ✅ Admin dashboard functionality
- ✅ Refund processing

## Deployment Checklist

### Pre-deployment
- [ ] Update environment variables with production keys
- [ ] Configure production database with proper indexes
- [ ] Set up SSL certificates for secure communication
- [ ] Configure backup and monitoring systems
- [ ] Test payment flows in production environment

### Post-deployment
- [ ] Monitor payment success rates
- [ ] Set up alerting for failed payments
- [ ] Regular database backups
- [ ] Monitor recurring payment processing
- [ ] Review security logs regularly

## Troubleshooting

### Common Issues

1. **Payment Failures**:
   - Check Razorpay dashboard for error details
   - Verify API keys and webhook configuration
   - Ensure proper error handling in frontend

2. **Recurring Payments Not Processing**:
   - Check cron job scheduler is running
   - Verify database queries for pending payments
   - Check email notification configuration

3. **Receipt Generation Issues**:
   - Ensure PDFKit dependencies are installed
   - Check file permissions for receipts directory
   - Verify Cloudinary configuration for file storage

4. **Notification Failures**:
   - Verify SMTP and Twilio credentials
   - Check rate limits and quotas
   - Review email templates for formatting issues

## Support & Maintenance

### Regular Tasks
- Monitor payment success rates
- Review and rotate encryption keys
- Update dependencies and security patches
- Backup transaction data regularly
- Review and optimize database performance

### Monitoring
- Set up alerts for payment failures
- Monitor recurring payment processing
- Track donation trends and patterns
- Review security logs for suspicious activity

## Compliance & Legal

### Tax Compliance
- Ensure receipts meet local tax requirements
- Include proper NGO registration details
- Maintain audit trails for all transactions
- Regular compliance reviews

### Data Protection
- Implement GDPR/local data protection compliance
- Provide data deletion mechanisms
- Maintain consent records
- Regular privacy impact assessments

---

For technical support or questions, contact the development team or refer to the official documentation of integrated services (Razorpay, Twilio, etc.).
