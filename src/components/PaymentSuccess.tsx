import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Download, 
  Share2, 
  Mail, 
  MessageCircle,
  Copy,
  Heart,
  Gift,
  Calendar,
  User,
  Building2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PaymentSuccessProps {
  transactionId: string;
  amount: number;
  recipientName: string;
  donorName?: string;
  isRecurring?: boolean;
  recurringFrequency?: string;
  receiptUrl?: string;
  onClose?: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  transactionId,
  amount,
  recipientName,
  donorName = 'Anonymous',
  isRecurring = false,
  recurringFrequency,
  receiptUrl,
  onClose
}) => {
  const { t } = useLanguage();
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  // Copy transaction ID to clipboard
  const copyTransactionId = async () => {
    try {
      await navigator.clipboard.writeText(transactionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Download receipt
  const downloadReceipt = () => {
    if (receiptUrl) {
      const link = document.createElement('a');
      link.href = receiptUrl;
      link.download = `receipt_${transactionId}.pdf`;
      link.click();
    }
  };

  // Generate WhatsApp share message
  const shareOnWhatsApp = () => {
    const message = encodeURIComponent(
      `🎉 I just donated ₹${amount.toLocaleString('en-IN')} to ${recipientName} through FarmVilla! Join me in supporting agricultural initiatives. #FarmVilla #Donation`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  // Generate email share
  const shareViaEmail = () => {
    const subject = encodeURIComponent('Supporting Agricultural Initiatives - FarmVilla');
    const body = encodeURIComponent(
      `I just made a donation of ₹${amount.toLocaleString('en-IN')} to ${recipientName} through FarmVilla platform.\n\nJoin me in supporting agricultural initiatives and rural development. Every contribution makes a difference!\n\nTransaction ID: ${transactionId}\n\nLearn more: ${window.location.origin}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="text-center pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4"
            >
              <div className="relative">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1"
                >
                  <Heart className="h-6 w-6 text-red-500 fill-current" />
                </motion.div>
              </div>
            </motion.div>
            
            <CardTitle className="text-2xl font-bold text-green-700">
              🎉 {t('payment.success.title')}
            </CardTitle>
            <p className="text-green-600 mt-2">
              {t('payment.success.subtitle')}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Transaction Details */}
            <div className="bg-white p-4 rounded-lg border border-green-100">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Gift className="h-5 w-5 text-green-600" />
                {t('payment.success.transactionDetails')}
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('payment.success.amount')}:</span>
                  <span className="font-bold text-green-700 text-lg">
                    ₹{amount.toLocaleString('en-IN')}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('payment.success.recipient')}:</span>
                  <span className="font-medium flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {recipientName}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('payment.success.donor')}:</span>
                  <span className="font-medium flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {donorName}
                  </span>
                </div>
                
                {isRecurring && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('payment.success.recurring')}:</span>
                    <span className="font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {t(`donation.${recurringFrequency}`)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-gray-600">{t('payment.success.transactionId')}:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {transactionId}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyTransactionId}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className={`h-4 w-4 ${copied ? 'text-green-600' : ''}`} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center">
              <p className="text-gray-700 leading-relaxed">
                {t('payment.success.thankYouMessage')}
              </p>
              {isRecurring && (
                <p className="text-sm text-green-600 mt-2">
                  {t('payment.success.recurringNote')}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Download Receipt */}
              {receiptUrl && (
                <Button
                  onClick={downloadReceipt}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Download className="h-5 w-5 mr-2" />
                  {t('payment.success.downloadReceipt')}
                </Button>
              )}

              {/* Share Options */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={shareOnWhatsApp}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
                <Button
                  onClick={shareViaEmail}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
              </div>

              {/* Share Button */}
              <Button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'FarmVilla Donation',
                      text: `I donated ₹${amount.toLocaleString('en-IN')} to ${recipientName}`,
                      url: window.location.origin
                    });
                  }
                }}
                variant="outline"
                className="w-full"
              >
                <Share2 className="h-4 w-4 mr-2" />
                {t('payment.success.shareSuccess')}
              </Button>
            </div>

            {/* Tax Deduction Notice */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800 text-center">
                💡 {t('payment.success.taxDeductionNotice')}
              </p>
            </div>

            {/* Close Button */}
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full"
            >
              {t('payment.success.close')}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
