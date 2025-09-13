import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Heart, 
  CreditCard, 
  Smartphone, 
  QrCode, 
  RefreshCw, 
  Shield,
  Gift,
  Users,
  Loader2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DonationBoxProps {
  recipientId: string;
  recipientName: string;
  recipientType?: 'NGO' | 'Farmer';
  onPaymentSuccess?: (transactionId: string) => void;
  className?: string;
}

const DonationBox: React.FC<DonationBoxProps> = ({
  recipientId,
  recipientName,
  recipientType = 'NGO',
  onPaymentSuccess,
  className = ''
}) => {
  const { t } = useLanguage();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('monthly');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isLoading, setIsLoading] = useState(false);
  const [showUPIOptions, setShowUPIOptions] = useState(false);

  // Preset donation amounts
  const presetAmounts = [100, 500, 1000, 2500, 5000, 10000];

  // Get final donation amount
  const getFinalAmount = () => {
    if (selectedAmount) return selectedAmount;
    if (customAmount) return parseInt(customAmount);
    return 0;
  };

  // Handle preset amount selection
  const handlePresetAmount = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  // Handle custom amount input
  const handleCustomAmount = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setCustomAmount(value);
      setSelectedAmount(null);
    } else {
      setCustomAmount('');
    }
  };

  // Create payment order
  const createPaymentOrder = async () => {
    const amount = getFinalAmount();
    if (amount < 1) return null;

    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          recipientId,
          donorName: isAnonymous ? 'Anonymous' : donorName,
          donorEmail: isAnonymous ? null : donorEmail,
          donorPhone: isAnonymous ? null : donorPhone,
          isAnonymous,
          isRecurring,
          recurringFrequency: isRecurring ? recurringFrequency : null,
          paymentMethod
        }),
      });

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error creating payment order:', error);
      return null;
    }
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async (orderData: any) => {
    const options = {
      key: orderData.razorpayKeyId,
      amount: orderData.amount * 100,
      currency: 'INR',
      name: 'FarmVilla',
      description: `Donation to ${recipientName}`,
      order_id: orderData.orderId,
      handler: async (response: any) => {
        try {
          const verifyResponse = await fetch('/api/payment/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyResponse.json();
          if (verifyData.success) {
            onPaymentSuccess?.(verifyData.data.transactionId);
          }
        } catch (error) {
          console.error('Payment verification error:', error);
        }
      },
      prefill: {
        name: isAnonymous ? '' : donorName,
        email: isAnonymous ? '' : donorEmail,
        contact: isAnonymous ? '' : donorPhone,
      },
      theme: {
        color: '#2E7D32',
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  // Handle UPI payment
  const handleUPIPayment = (orderData: any) => {
    if (orderData.upiIntent) {
      window.location.href = orderData.upiIntent;
    }
  };

  // Handle donation submission
  const handleDonate = async () => {
    const amount = getFinalAmount();
    if (amount < 1) return;

    if (!isAnonymous && (!donorName || !donorEmail)) {
      alert('Please fill in your details or choose anonymous donation');
      return;
    }

    setIsLoading(true);

    try {
      const orderData = await createPaymentOrder();
      if (!orderData) {
        alert('Failed to create payment order');
        return;
      }

      if (paymentMethod === 'UPI' && showUPIOptions) {
        handleUPIPayment(orderData);
      } else {
        handleRazorpayPayment(orderData);
      }
    } catch (error) {
      console.error('Donation error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl">
          <Heart className="h-6 w-6 text-red-500" />
          {t('donation.supportTitle')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('donation.supportDescription')} {recipientName}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Preset Amounts */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            {t('donation.selectAmount')}
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {presetAmounts.map((amount) => (
              <motion.button
                key={amount}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePresetAmount(amount)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedAmount === amount
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                ₹{amount.toLocaleString('en-IN')}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div>
          <Label htmlFor="customAmount" className="text-sm font-medium">
            {t('donation.customAmount')}
          </Label>
          <Input
            id="customAmount"
            type="number"
            placeholder="Enter amount"
            value={customAmount}
            onChange={(e) => handleCustomAmount(e.target.value)}
            className="mt-1"
            min="1"
          />
        </div>

        {/* Recurring Donation */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="recurring"
            checked={isRecurring}
            onCheckedChange={(checked) => setIsRecurring(checked === true)}
          />
          <Label htmlFor="recurring" className="text-sm flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            {t('donation.makeRecurring')}
          </Label>
        </div>

        {/* Recurring Frequency */}
        <AnimatePresence>
          {isRecurring && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Label className="text-sm font-medium">
                {t('donation.frequency')}
              </Label>
              <RadioGroup
                value={recurringFrequency}
                onValueChange={setRecurringFrequency}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly">{t('donation.monthly')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quarterly" id="quarterly" />
                  <Label htmlFor="quarterly">{t('donation.quarterly')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yearly" id="yearly" />
                  <Label htmlFor="yearly">{t('donation.yearly')}</Label>
                </div>
              </RadioGroup>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Anonymous Donation */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="anonymous"
            checked={isAnonymous}
            onCheckedChange={(checked) => setIsAnonymous(checked === true)}
          />
          <Label htmlFor="anonymous" className="text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t('donation.donateAnonymously')}
          </Label>
        </div>

        {/* Donor Details */}
        <AnimatePresence>
          {!isAnonymous && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div>
                <Label htmlFor="donorName" className="text-sm font-medium">
                  {t('donation.yourName')} *
                </Label>
                <Input
                  id="donorName"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="donorEmail" className="text-sm font-medium">
                  {t('donation.yourEmail')} *
                </Label>
                <Input
                  id="donorEmail"
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="donorPhone" className="text-sm font-medium">
                  {t('donation.yourPhone')}
                </Label>
                <Input
                  id="donorPhone"
                  type="tel"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="mt-1"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Method */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            {t('donation.paymentMethod')}
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={paymentMethod === 'UPI' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('UPI')}
              className="flex items-center gap-2"
            >
              <Smartphone className="h-4 w-4" />
              UPI
            </Button>
            <Button
              variant={paymentMethod === 'Card' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('Card')}
              className="flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              {t('donation.card')}
            </Button>
          </div>
        </div>

        {/* UPI Options */}
        <AnimatePresence>
          {paymentMethod === 'UPI' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex items-center space-x-2 mb-3">
                <Checkbox
                  id="upiOptions"
                  checked={showUPIOptions}
                  onCheckedChange={(checked) => setShowUPIOptions(checked === true)}
                />
                <Label htmlFor="upiOptions" className="text-sm flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  {t('donation.useUPIApp')}
                </Label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Donation Summary */}
        {getFinalAmount() > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/5 p-4 rounded-lg border"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                {t('donation.donationAmount')}:
              </span>
              <span className="font-semibold">
                ₹{getFinalAmount().toLocaleString('en-IN')}
              </span>
            </div>
            {isRecurring && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  {t('donation.frequency')}:
                </span>
                <span className="text-sm">
                  {t(`donation.${recurringFrequency}`)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {t('donation.recipient')}:
              </span>
              <span className="text-sm font-medium">{recipientName}</span>
            </div>
          </motion.div>
        )}

        {/* Donate Button */}
        <Button
          onClick={handleDonate}
          disabled={getFinalAmount() < 1 || isLoading}
          className="w-full h-12 text-lg"
          size="lg"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Gift className="h-5 w-5 mr-2" />
          )}
          {isLoading
            ? t('donation.processing')
            : `${t('donation.donate')} ₹${getFinalAmount().toLocaleString('en-IN')}`
          }
        </Button>

        {/* Security Notice */}
        <div className="text-center text-xs text-muted-foreground">
          <Shield className="h-4 w-4 inline mr-1" />
          {t('donation.securePayment')}
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationBox;
