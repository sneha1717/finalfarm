import cron from 'node-cron';
import Donation from '../models/Payment.js';
import { createRazorpayOrder } from './razorpay.js';
import { sendNotifications } from './notifications.js';

// Process recurring payments daily at 9 AM
const scheduleRecurringPayments = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('Processing recurring payments...');
    
    try {
      // Get all pending recurring payments
      const pendingPayments = await Donation.getPendingRecurringPayments()
        .populate('recipient', 'organizationName email mobile');

      console.log(`Found ${pendingPayments.length} pending recurring payments`);

      for (const originalDonation of pendingPayments) {
        try {
          // Create new Razorpay order for recurring payment
          const transactionId = `TXN-AGRI-REC-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;
          
          const orderResult = await createRazorpayOrder(
            originalDonation.amount,
            'INR',
            transactionId,
            {
              donor_name: originalDonation.donor.name,
              recipient_id: originalDonation.recipient._id,
              is_recurring: true,
              parent_transaction: originalDonation.transactionId
            }
          );

          if (orderResult.success) {
            // Calculate next payment date
            const nextDate = new Date();
            switch (originalDonation.recurringFrequency) {
              case 'monthly':
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
              case 'quarterly':
                nextDate.setMonth(nextDate.getMonth() + 3);
                break;
              case 'yearly':
                nextDate.setFullYear(nextDate.getFullYear() + 1);
                break;
            }

            // Create new donation record
            const newDonation = new Donation({
              transactionId,
              razorpayOrderId: orderResult.order.id,
              amount: originalDonation.amount,
              donor: originalDonation.donor,
              recipient: originalDonation.recipient._id,
              paymentMethod: originalDonation.paymentMethod,
              isRecurring: true,
              recurringFrequency: originalDonation.recurringFrequency,
              nextPaymentDate: nextDate,
              metadata: {
                source: 'recurring',
                parentTransaction: originalDonation.transactionId
              }
            });

            await newDonation.save();

            // Update original donation's next payment date
            originalDonation.nextPaymentDate = nextDate;
            await originalDonation.save();

            // Send notification about upcoming recurring payment
            if (!originalDonation.donor.isAnonymous && originalDonation.donor.email) {
              await sendRecurringPaymentNotification(originalDonation, newDonation);
            }

            console.log(`Created recurring payment: ${transactionId}`);
          } else {
            console.error(`Failed to create recurring payment for ${originalDonation.transactionId}:`, orderResult.error);
          }

        } catch (error) {
          console.error(`Error processing recurring payment for ${originalDonation.transactionId}:`, error);
        }
      }

    } catch (error) {
      console.error('Error in recurring payments scheduler:', error);
    }
  });

  console.log('Recurring payments scheduler initialized');
};

// Send notification for recurring payment
const sendRecurringPaymentNotification = async (originalDonation, newDonation) => {
  const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2E7D32; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .amount { font-size: 20px; font-weight: bold; color: #2E7D32; }
        .button { background: #2E7D32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔄 Recurring Donation Ready</h1>
        </div>
        <div class="content">
          <h2>Dear ${originalDonation.donor.name},</h2>
          <p>Your recurring donation is ready for processing:</p>
          <p><strong>Amount:</strong> <span class="amount">₹${originalDonation.amount.toLocaleString('en-IN')}</span></p>
          <p><strong>Recipient:</strong> ${originalDonation.recipient.organizationName}</p>
          <p><strong>Frequency:</strong> ${originalDonation.recurringFrequency}</p>
          <p><strong>Transaction ID:</strong> ${newDonation.transactionId}</p>
          
          <a href="${process.env.FRONTEND_URL}/payment/complete/${newDonation.transactionId}" class="button">Complete Payment</a>
          
          <p>Thank you for your continued support!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await sendEmailNotification(
      originalDonation.donor.email,
      'Recurring Donation - FarmVilla',
      emailHTML
    );
  } catch (error) {
    console.error('Error sending recurring payment notification:', error);
  }
};

export { scheduleRecurringPayments };
export default scheduleRecurringPayments;
