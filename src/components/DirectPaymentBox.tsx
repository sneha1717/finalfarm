import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Heart, 
  QrCode, 
  Smartphone, 
  CreditCard, 
  Building2, 
  Bitcoin,
  Copy,
  Download,
  Share2,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface DirectPaymentBoxProps {
  recipientId: string;
  recipientName: string;
  onPaymentInitiated?: (transactionId: string) => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  processingTime: string;
}

const DirectPaymentBox: React.FC<DirectPaymentBoxProps> = ({
  recipientId,
  recipientName,
  onPaymentInitiated
}) => {
  const { t } = useLanguage();
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<string>('upi');
  const [donorDetails, setDonorDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [step, setStep] = useState<'amount' | 'details' | 'payment'>('amount');

  const presetAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: <QrCode className="w-5 h-5" />,
      description: 'Instant payment via UPI apps',
      processingTime: 'Instant'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: <Building2 className="w-5 h-5" />,
      description: 'NEFT/RTGS bank transfer',
      processingTime: '1-2 hours'
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: <Bitcoin className="w-5 h-5" />,
      description: 'Pay with USDT/BTC/ETH',
      processingTime: '10-30 minutes'
    }
  ];

  const finalAmount = selectedAmount || parseFloat(customAmount) || 0;

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(0);
  };

  const handleNextStep = () => {
    if (step === 'amount' && finalAmount > 0) {
      setStep('details');
    } else if (step === 'details') {
      setStep('payment');
    }
  };

  const handlePaymentInitiation = async () => {
    if (finalAmount <= 0) return;

    setIsLoading(true);
    try {
      const endpoint = selectedMethod === 'upi' ? '/api/direct-payment/upi/create' :
                     selectedMethod === 'bank' ? '/api/direct-payment/bank/create' :
                     '/api/direct-payment/crypto/create';

      const payload = {
        amount: finalAmount,
        recipientId,
        donorName: isAnonymous ? undefined : donorDetails.name,
        donorEmail: isAnonymous ? undefined : donorDetails.email,
        donorPhone: isAnonymous ? undefined : donorDetails.phone,
        isAnonymous,
        ...(selectedMethod === 'crypto' && { currency: 'USDT' })
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        setPaymentData(result.data);
        onPaymentInitiated?.(result.data.transactionId);
      } else {
        throw new Error(result.message || 'Payment initiation failed');
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  const openUPIApp = (appIntent: string) => {
    window.open(appIntent, '_blank');
  };

  if (paymentData) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            Payment Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              ₹{paymentData.amount}
            </div>
            <div className="text-sm text-gray-600">
              Transaction ID: {paymentData.transactionId}
            </div>
          </div>

          {selectedMethod === 'upi' && (
            <div className="space-y-4">
              <div className="text-center">
                <img 
                  src={paymentData.upiDetails.qrCode} 
                  alt="UPI QR Code"
                  className="mx-auto w-48 h-48 border rounded-lg"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Scan with any UPI app
                </p>
              </div>

              <div className="space-y-2">
                <Label>UPI ID</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    value={paymentData.upiDetails.merchantVPA} 
                    readOnly 
                    className="flex-1"
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(paymentData.upiDetails.merchantVPA)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openUPIApp(paymentData.appIntents.googlePay)}
                >
                  Google Pay
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openUPIApp(paymentData.appIntents.phonePe)}
                >
                  PhonePe
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openUPIApp(paymentData.appIntents.paytm)}
                >
                  Paytm
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openUPIApp(paymentData.appIntents.bhim)}
                >
                  BHIM
                </Button>
              </div>
            </div>
          )}

          {selectedMethod === 'bank' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Account Name</Label>
                <Input value={paymentData.bankDetails.accountName} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Account Number</Label>
                <div className="flex items-center gap-2">
                  <Input value={paymentData.bankDetails.accountNumber} readOnly className="flex-1" />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(paymentData.bankDetails.accountNumber)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>IFSC Code</Label>
                <div className="flex items-center gap-2">
                  <Input value={paymentData.bankDetails.ifscCode} readOnly className="flex-1" />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(paymentData.bankDetails.ifscCode)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bank Name</Label>
                <Input value={paymentData.bankDetails.bankName} readOnly />
              </div>
            </div>
          )}

          {selectedMethod === 'crypto' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Wallet Address ({paymentData.currency})</Label>
                <div className="flex items-center gap-2">
                  <Input value={paymentData.walletAddress} readOnly className="flex-1 text-xs" />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(paymentData.walletAddress)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {paymentData.amount} {paymentData.currency}
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Instructions:</h4>
            <ul className="text-sm space-y-1">
              {paymentData.instructions?.map((instruction: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  {instruction}
                </li>
              ))}
            </ul>
          </div>

          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => {
              setPaymentData(null);
              setStep('amount');
            }}
          >
            Make Another Donation
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          {t('donation.title')}
        </CardTitle>
        <p className="text-sm text-gray-600">
          Supporting: {recipientName}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          {step === 'amount' && (
            <motion.div
              key="amount"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <Label className="text-sm font-medium">Quick Select</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {presetAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAmountSelect(amount)}
                      className="h-12"
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="custom-amount">Custom Amount</Label>
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="mt-1"
                />
              </div>

              {finalAmount > 0 && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    ₹{finalAmount}
                  </div>
                  <div className="text-sm text-gray-600">
                    Your donation amount
                  </div>
                </div>
              )}

              <Button 
                className="w-full" 
                onClick={handleNextStep}
                disabled={finalAmount <= 0}
              >
                Continue
              </Button>
            </motion.div>
          )}

          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                />
                <Label htmlFor="anonymous" className="text-sm">
                  Make this an anonymous donation
                </Label>
              </div>

              {!isAnonymous && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="donor-name">Full Name</Label>
                    <Input
                      id="donor-name"
                      value={donorDetails.name}
                      onChange={(e) => setDonorDetails(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="donor-email">Email Address</Label>
                    <Input
                      id="donor-email"
                      type="email"
                      value={donorDetails.email}
                      onChange={(e) => setDonorDetails(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="donor-phone">Phone Number (Optional)</Label>
                    <Input
                      id="donor-phone"
                      value={donorDetails.phone}
                      onChange={(e) => setDonorDetails(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('amount')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleNextStep}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold">₹{finalAmount}</div>
                <div className="text-sm text-gray-600">
                  {isAnonymous ? 'Anonymous Donation' : `From ${donorDetails.name}`}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Select Payment Method</Label>
                <RadioGroup 
                  value={selectedMethod} 
                  onValueChange={setSelectedMethod}
                  className="mt-2"
                >
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <div className="flex items-center gap-3 flex-1">
                        {method.icon}
                        <div>
                          <Label htmlFor={method.id} className="font-medium cursor-pointer">
                            {method.name}
                          </Label>
                          <p className="text-xs text-gray-600">{method.description}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {method.processingTime}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('details')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handlePaymentInitiation}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Proceed to Pay'
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default DirectPaymentBox;
