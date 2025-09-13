import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateReceipt = async (donation) => {
  return new Promise((resolve, reject) => {
    try {
      // Create receipts directory if it doesn't exist
      const receiptsDir = path.join(process.cwd(), 'receipts');
      if (!fs.existsSync(receiptsDir)) {
        fs.mkdirSync(receiptsDir, { recursive: true });
      }

      const fileName = `receipt_${donation.transactionId}.pdf`;
      const filePath = path.join(receiptsDir, fileName);

      // Create PDF document
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20)
         .fillColor('#2E7D32')
         .text('FarmVilla - Donation Receipt', 50, 50);

      doc.fontSize(12)
         .fillColor('#666666')
         .text('Official Tax Deductible Receipt', 50, 80);

      // Horizontal line
      doc.moveTo(50, 100)
         .lineTo(550, 100)
         .stroke('#E0E0E0');

      // Receipt details
      const startY = 130;
      let currentY = startY;

      // Transaction details
      doc.fontSize(14)
         .fillColor('#333333')
         .text('Transaction Details', 50, currentY);
      
      currentY += 25;

      const details = [
        ['Transaction ID:', donation.transactionId],
        ['Date:', new Date(donation.completedAt).toLocaleDateString('en-IN')],
        ['Time:', new Date(donation.completedAt).toLocaleTimeString('en-IN')],
        ['Amount:', `₹${donation.amount.toLocaleString('en-IN')}`],
        ['Payment Method:', donation.paymentMethod],
        ['Status:', 'Completed']
      ];

      details.forEach(([label, value]) => {
        doc.fontSize(10)
           .fillColor('#666666')
           .text(label, 50, currentY)
           .fillColor('#333333')
           .text(value, 200, currentY);
        currentY += 20;
      });

      currentY += 20;

      // Donor details
      doc.fontSize(14)
         .fillColor('#333333')
         .text('Donor Information', 50, currentY);
      
      currentY += 25;

      const donorDetails = [
        ['Name:', donation.donor.isAnonymous ? 'Anonymous Donor' : donation.donor.name],
        ['Email:', donation.donor.isAnonymous ? 'Not disclosed' : (donation.donor.email || 'Not provided')],
        ['Phone:', donation.donor.isAnonymous ? 'Not disclosed' : (donation.donor.phone || 'Not provided')]
      ];

      donorDetails.forEach(([label, value]) => {
        doc.fontSize(10)
           .fillColor('#666666')
           .text(label, 50, currentY)
           .fillColor('#333333')
           .text(value, 200, currentY);
        currentY += 20;
      });

      currentY += 20;

      // Recipient details
      doc.fontSize(14)
         .fillColor('#333333')
         .text('Recipient Organization', 50, currentY);
      
      currentY += 25;

      if (donation.recipient) {
        const recipientDetails = [
          ['Organization:', donation.recipient.organizationName],
          ['Registration ID:', donation.recipient.ngoRegistrationId || 'N/A'],
          ['Type:', 'Registered NGO']
        ];

        recipientDetails.forEach(([label, value]) => {
          doc.fontSize(10)
             .fillColor('#666666')
             .text(label, 50, currentY)
             .fillColor('#333333')
             .text(value, 200, currentY);
          currentY += 20;
        });
      }

      currentY += 30;

      // Tax information
      doc.fontSize(12)
         .fillColor('#2E7D32')
         .text('Tax Deduction Information', 50, currentY);
      
      currentY += 20;

      doc.fontSize(10)
         .fillColor('#666666')
         .text('This donation is eligible for tax deduction under Section 80G of the Income Tax Act, 1961.', 50, currentY, { width: 500 });
      
      currentY += 30;

      doc.text('Please retain this receipt for your tax filing purposes.', 50, currentY, { width: 500 });

      currentY += 50;

      // Footer
      doc.moveTo(50, currentY)
         .lineTo(550, currentY)
         .stroke('#E0E0E0');

      currentY += 20;

      doc.fontSize(8)
         .fillColor('#999999')
         .text('This is a computer-generated receipt and does not require a signature.', 50, currentY);

      currentY += 15;

      doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 50, currentY);

      currentY += 15;

      doc.text('For queries, contact: support@farmvilla.org | +91-XXXXXXXXXX', 50, currentY);

      // QR Code placeholder (you can integrate actual QR code generation)
      doc.fontSize(8)
         .text('Scan QR code to verify:', 400, currentY - 60);

      doc.rect(450, currentY - 50, 80, 80)
         .stroke('#E0E0E0');

      doc.fontSize(6)
         .text('QR Code', 475, currentY - 15);

      // Finalize PDF
      doc.end();

      stream.on('finish', () => {
        // Return relative path for storage in database
        const relativePath = `/receipts/${fileName}`;
        resolve(relativePath);
      });

      stream.on('error', (error) => {
        reject(error);
      });

    } catch (error) {
      reject(error);
    }
  });
};
