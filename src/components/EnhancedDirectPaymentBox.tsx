import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Heart, 
  QrCode, 
  Smartphone, 
  Building2, 
  Bitcoin,
  Copy,
  Download,
  Share2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Gift,
  Star,
  Users,
  FileText,
  Award,
  Sparkles
} from 'lucide-react';

interface EnhancedDirectPaymentBoxProps {
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
  badge?: string;
}

const EnhancedDirectPaymentBox: React.FC<EnhancedDirectPaymentBoxProps> = ({
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
  const [step, setStep] = useState<'amount' | 'details' | 'payment' | 'success'>('amount');
  const [progress, setProgress] = useState(25);

  const presetAmounts = [
    { amount: 100, label: '₹100', popular: false },
    { amount: 500, label: '₹500', popular: true },
    { amount: 1000, label: '₹1000', popular: true },
    { amount: 2000, label: '₹2000', popular: false },
    { amount: 5000, label: '₹5000', popular: false },
    { amount: 10000, label: '₹10000', popular: false }
  ];

  const methods = [
    { id: 'upi', name: 'UPI Payment', icon: '📱', description: 'Instant payment via UPI apps' },
    { id: 'bank', name: 'Bank Transfer', icon: '🏦', description: 'NEFT/RTGS transfer' },
    { id: 'crypto', name: 'Cryptocurrency', icon: '₿', description: 'USDT, BTC, ETH' }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'upi',
      name: methods.find(method => method.id === 'upi')?.name,
      icon: <QrCode className="w-5 h-5" />,
      description: methods.find(method => method.id === 'upi')?.description,
      processingTime: 'Instant',
      badge: 'Recommended'
    },
    {
      id: 'bank',
      name: methods.find(method => method.id === 'bank')?.name,
      icon: <Building2 className="w-5 h-5" />,
      description: methods.find(method => method.id === 'bank')?.description,
      processingTime: '1-2 hours'
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: <Bitcoin className="w-5 h-5" />,
      description: 'Pay with USDT/BTC/ETH',
      processingTime: '10-30 minutes',
      badge: 'Global'
    }
  ];

  const finalAmount = selectedAmount || parseFloat(customAmount) || 0;

  useEffect(() => {
    if (step === 'amount') setProgress(25);
    else if (step === 'details') setProgress(50);
    else if (step === 'payment') setProgress(75);
    else if (step === 'success') setProgress(100);
  }, [step]);

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
      const endpoint = selectedMethod === 'upi' ? 'http://localhost:5001/api/direct-payment/upi/create' :
                     selectedMethod === 'bank' ? 'http://localhost:5001/api/direct-payment/bank/create' :
                     'http://localhost:5001/api/direct-payment/crypto/create';

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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setPaymentData(result.data);
        setStep('success');
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
  };

  const openUPIApp = (appIntent: string) => {
    window.open(appIntent, '_blank');
  };

  const downloadReceipt = () => {
    // Generate and download receipt
    const receiptData = {
      transactionId: paymentData.transactionId,
      amount: paymentData.amount,
      recipient: recipientName,
      donor: isAnonymous ? 'Anonymous' : donorDetails.name,
      date: new Date().toLocaleDateString(),
      method: selectedMethod.toUpperCase()
    };

    const receiptContent = `
DONATION RECEIPT
================

Transaction ID: ${receiptData.transactionId}
Amount: ₹${receiptData.amount}
Recipient: ${receiptData.recipient}
Donor: ${receiptData.donor}
Date: ${receiptData.date}
Payment Method: ${receiptData.method}

Thank you for your generous donation!

This receipt serves as proof of your contribution.
Keep this for your tax records.

FarmVilla Foundation
Empowering Rural Communities
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donation-receipt-${receiptData.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCertificate = () => {
    // Generate and download donation certificate
    const certificateData = {
      transactionId: paymentData.transactionId,
      amount: paymentData.amount,
      recipient: recipientName,
      donor: isAnonymous ? 'Anonymous Donor' : donorDetails.name,
      date: new Date().toLocaleDateString()
    };

    const certificateContent = `
╔══════════════════════════════════════════════════════════════╗
║                    DONATION CERTIFICATE                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  This certificate is awarded to:                            ║
║  ${certificateData.donor.padEnd(58)} ║
║                                                              ║
║  For the generous donation of ₹${certificateData.amount.toString().padEnd(45)} ║
║                                                              ║
║  To: ${certificateData.recipient.padEnd(56)} ║
║                                                              ║
║  Transaction ID: ${certificateData.transactionId.padEnd(43)} ║
║  Date: ${certificateData.date.padEnd(52)} ║
║                                                              ║
║  Your contribution makes a difference in rural communities. ║
║  Thank you for supporting sustainable agriculture.          ║
║                                                              ║
║                          FarmVilla Foundation                ║
║                      Empowering Rural Communities            ║
╚══════════════════════════════════════════════════════════════╝
    `;

    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donation-certificate-${certificateData.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (step === 'success' && paymentData) {
    return (
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
        <CardHeader className="text-center bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6" />
            Payment Instructions
          </CardTitle>
          <Progress value={progress} className="mt-2 bg-white/20" />
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <div className="text-3xl font-bold text-green-600 mb-2">
              ₹{paymentData.amount}
            </div>
            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full inline-block">
              ID: {paymentData.transactionId}
            </div>
          </motion.div>

          {selectedMethod === 'upi' && (
            <div className="space-y-4">
              <div className="text-center">
                <motion.img 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={paymentData.upiDetails.qrCode} 
                  alt="UPI QR Code"
                  className="mx-auto w-48 h-48 border-2 border-green-300 rounded-xl shadow-lg"
                />
                <p className="text-sm text-gray-600 mt-2 font-medium">
                  Scan with any UPI app
                </p>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">UPI ID</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    value={paymentData.upiDetails.merchantVPA} 
                    readOnly 
                    className="flex-1 bg-gray-50"
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(paymentData.upiDetails.merchantVPA)}
                    className="hover:bg-green-50"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Google Pay', intent: paymentData.appIntents?.googlePay },
                  { name: 'PhonePe', intent: paymentData.appIntents?.phonePe },
                  { name: 'Paytm', intent: paymentData.appIntents?.paytm },
                  { name: 'BHIM', intent: paymentData.appIntents?.bhim }
                ].map((app) => (
                  <Button 
                    key={app.name}
                    variant="outline" 
                    size="sm"
                    onClick={() => openUPIApp(app.intent)}
                    className="hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Smartphone className="w-4 h-4 mr-1" />
                    {app.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {selectedMethod === 'bank' && (
            <div className="space-y-4">
              {[
                { label: 'Account Name', value: paymentData.bankDetails.accountName },
                { label: 'Account Number', value: paymentData.bankDetails.accountNumber },
                { label: 'IFSC Code', value: paymentData.bankDetails.ifscCode },
                { label: 'Bank Name', value: paymentData.bankDetails.bankName }
              ].map((field) => (
                <div key={field.label} className="space-y-2">
                  <Label className="font-semibold">{field.label}</Label>
                  <div className="flex items-center gap-2">
                    <Input value={field.value} readOnly className="flex-1 bg-gray-50" />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(field.value)}
                      className="hover:bg-green-50"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              Instructions:
            </h4>
            <ul className="text-sm space-y-1">
              {paymentData.instructions?.map((instruction: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  {instruction}
                </li>
              ))}
            </ul>
          </div>

          {/* Download Section */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Gift className="w-4 h-4 text-purple-600" />
              Download Your Documents:
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <Button 
                onClick={downloadReceipt}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <FileText className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              <Button 
                onClick={downloadCertificate}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <Award className="w-4 h-4 mr-2" />
                Download Certificate
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600" 
              onClick={() => {
                const shareText = `I just donated ₹${paymentData.amount} to ${recipientName} through FarmVilla! 🌱 Supporting sustainable agriculture. #FarmVilla #Donation`;
                if (navigator.share) {
                  navigator.share({ text: shareText });
                } else {
                  copyToClipboard(shareText);
                }
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setPaymentData(null);
                setStep('amount');
                setProgress(25);
              }}
              className="flex-1 hover:bg-gray-50"
            >
              New Donation
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-200" />
          {t('donation.title')}
        </CardTitle>
        <p className="text-sm text-green-100">
          Supporting: <span className="font-semibold">{recipientName}</span>
        </p>
        <Progress value={progress} className="mt-2 bg-white/20" />
      </CardHeader>

      <CardContent className="space-y-6 p-6">
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
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Quick Select
                </Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {presetAmounts.map((item) => (
                    <Button
                      key={item.amount}
                      variant={selectedAmount === item.amount ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAmountSelect(item.amount)}
                      className={`h-12 relative ${selectedAmount === item.amount ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'hover:border-green-300'}`}
                    >
                      {item.popular && (
                        <Badge className="absolute -top-2 -right-2 text-xs bg-yellow-500">
                          Popular
                        </Badge>
                      )}
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="custom-amount" className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  Custom Amount
                </Label>
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="mt-1 border-2 focus:border-green-400"
                />
              </div>

              {finalAmount > 0 && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200"
                >
                  <div className="text-2xl font-bold text-green-600">
                    ₹{finalAmount}
                  </div>
                  <div className="text-sm text-gray-600">
                    Your donation amount
                  </div>
                </motion.div>
              )}

              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600" 
                onClick={handleNextStep}
                disabled={finalAmount <= 0}
              >
                Continue to Details
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
              <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                />
                <Label htmlFor="anonymous" className="text-sm font-medium">
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
                      className="border-2 focus:border-green-400"
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
                      className="border-2 focus:border-green-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="donor-phone">Phone Number (Optional)</Label>
                    <Input
                      id="donor-phone"
                      value={donorDetails.phone}
                      onChange={(e) => setDonorDetails(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                      className="border-2 focus:border-green-400"
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
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
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
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-200">
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
                    <div key={method.id} className="flex items-center space-x-2 p-3 border-2 rounded-lg hover:bg-gray-50 hover:border-green-300 transition-colors">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <div className="flex items-center gap-3 flex-1">
                        {method.icon}
                        <div>
                          <Label htmlFor={method.id} className="font-medium cursor-pointer">
                            {method.name}
                          </Label>
                          <p className="text-xs text-gray-600">{method.description}</p>
                        </div>
                        <div className="flex gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {method.processingTime}
                          </Badge>
                          {method.badge && (
                            <Badge className="text-xs bg-green-500">
                              {method.badge}
                            </Badge>
                          )}
                        </div>
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
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
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

export default EnhancedDirectPaymentBox;
