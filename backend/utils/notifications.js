import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Initialize email transporter
const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Initialize Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send email notification
export const sendEmailNotification = async (to, subject, htmlContent, attachments = []) => {
  try {
    const mailOptions = {
      from: `"FarmVilla" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
      attachments
    };

    const result = await emailTransporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Send SMS notification
export const sendSMSNotification = async (to, message) => {
  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${to}`
    });

    return {
      success: true,
      sid: result.sid
    };
  } catch (error) {
    console.error('SMS sending error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Generate donation confirmation email HTML
const generateDonationEmailHTML = (donation) => {
  const isAnonymous = donation.donor.isAnonymous;
  const donorName = isAnonymous ? 'Anonymous Donor' : donation.donor.name;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2E7D32; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .transaction-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .amount { font-size: 24px; font-weight: bold; color: #2E7D32; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .button { background: #2E7D32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Donation Successful!</h1>
          <p>Thank you for your generous contribution</p>
        </div>
        
        <div class="content">
          <h2>Dear ${donorName},</h2>
          <p>Your donation has been successfully processed. Here are the details:</p>
          
          <div class="transaction-details">
            <h3>Transaction Details</h3>
            <p><strong>Transaction ID:</strong> ${donation.transactionId}</p>
            <p><strong>Amount:</strong> <span class="amount">₹${donation.amount.toLocaleString('en-IN')}</span></p>
            <p><strong>Date:</strong> ${new Date(donation.completedAt).toLocaleDateString('en-IN')}</p>
            <p><strong>Recipient:</strong> ${donation.recipient.organizationName}</p>
            <p><strong>Payment Method:</strong> ${donation.paymentMethod}</p>
            ${donation.isRecurring ? `<p><strong>Recurring:</strong> ${donation.recurringFrequency}</p>` : ''}
          </div>
          
          <p>Your contribution will help make a meaningful impact in supporting agricultural initiatives and rural development.</p>
          
          ${donation.receiptUrl ? `<a href="${process.env.FRONTEND_URL}${donation.receiptUrl}" class="button">Download Receipt</a>` : ''}
          
          <p>This donation is eligible for tax deduction under Section 80G of the Income Tax Act, 1961.</p>
        </div>
        
        <div class="footer">
          <p>This is an automated message from FarmVilla</p>
          <p>For support, contact us at support@farmvilla.org</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate NGO notification email HTML
const generateNGONotificationHTML = (donation) => {
  const donorName = donation.donor.isAnonymous ? 'Anonymous Donor' : donation.donor.name;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2E7D32; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .donation-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .amount { font-size: 24px; font-weight: bold; color: #2E7D32; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💰 New Donation Received!</h1>
          <p>A generous supporter has contributed to your cause</p>
        </div>
        
        <div class="content">
          <h2>Dear ${donation.recipient.organizationName},</h2>
          <p>You have received a new donation through FarmVilla platform:</p>
          
          <div class="donation-details">
            <h3>Donation Details</h3>
            <p><strong>Donor:</strong> ${donorName}</p>
            <p><strong>Amount:</strong> <span class="amount">₹${donation.amount.toLocaleString('en-IN')}</span></p>
            <p><strong>Transaction ID:</strong> ${donation.transactionId}</p>
            <p><strong>Date:</strong> ${new Date(donation.completedAt).toLocaleDateString('en-IN')}</p>
            <p><strong>Payment Method:</strong> ${donation.paymentMethod}</p>
            ${donation.isRecurring ? `<p><strong>Recurring Donation:</strong> ${donation.recurringFrequency}</p>` : ''}
          </div>
          
          <p>Please ensure to acknowledge this donation and provide updates on how the funds will be utilized.</p>
        </div>
        
        <div class="footer">
          <p>This is an automated notification from FarmVilla</p>
          <p>Login to your dashboard for more details</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send all notifications for a donation
export const sendNotifications = async (donation) => {
  const notifications = {
    donorEmail: false,
    donorSMS: false,
    ngoEmail: false,
    ngoSMS: false
  };

  try {
    // Send donor email notification
    if (donation.donor.email && !donation.donor.isAnonymous) {
      const emailResult = await sendEmailNotification(
        donation.donor.email,
        'Donation Confirmation - FarmVilla',
        generateDonationEmailHTML(donation)
      );
      notifications.donorEmail = emailResult.success;
    }

    // Send donor SMS notification
    if (donation.donor.phone && !donation.donor.isAnonymous) {
      const smsMessage = `Thank you for your donation of ₹${donation.amount} to ${donation.recipient.organizationName}. Transaction ID: ${donation.transactionId}. Receipt: ${process.env.FRONTEND_URL}/receipt/${donation.transactionId}`;
      const smsResult = await sendSMSNotification(donation.donor.phone, smsMessage);
      notifications.donorSMS = smsResult.success;
    }

    // Send NGO email notification
    if (donation.recipient.email) {
      const ngoEmailResult = await sendEmailNotification(
        donation.recipient.email,
        'New Donation Received - FarmVilla',
        generateNGONotificationHTML(donation)
      );
      notifications.ngoEmail = ngoEmailResult.success;
    }

    // Send NGO SMS notification
    if (donation.recipient.mobile) {
      const donorName = donation.donor.isAnonymous ? 'Anonymous' : donation.donor.name;
      const ngoSmsMessage = `New donation received! ₹${donation.amount} from ${donorName}. Transaction: ${donation.transactionId}. Login to FarmVilla for details.`;
      const ngoSmsResult = await sendSMSNotification(donation.recipient.mobile, ngoSmsMessage);
      notifications.ngoSMS = ngoSmsResult.success;
    }

    // Update donation notification status
    donation.notifications = {
      emailSent: notifications.donorEmail,
      smsSent: notifications.donorSMS
    };
    await donation.save();

    return notifications;

  } catch (error) {
    console.error('Notification sending error:', error);
    return notifications;
  }
};

// Generate WhatsApp share message
export const generateWhatsAppMessage = (donation) => {
  const message = `🎉 I just made a donation of ₹${donation.amount} to ${donation.recipient.organizationName} through FarmVilla! 

Join me in supporting agricultural initiatives and rural development. Every contribution makes a difference! 

Donate now: ${process.env.FRONTEND_URL}/donate/${donation.recipient._id}

#FarmVilla #Donation #Agriculture #RuralDevelopment`;

  return encodeURIComponent(message);
};

export default {
  sendEmailNotification,
  sendSMSNotification,
  sendNotifications,
  generateWhatsAppMessage
};
