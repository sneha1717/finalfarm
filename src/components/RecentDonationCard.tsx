import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, CheckCircle, Clock, XCircle, QrCode, CreditCard, Building2, User, AlertCircle } from 'lucide-react';

interface Donation {
  _id: string;
  transactionId: string;
  amount: number;
  donor: {
    name: string;
    isAnonymous: boolean;
  };
  paymentMethod: string;
  status: string;
  createdAt: string;
  recipientName?: string;
}

interface RecentDonationCardProps {
  className?: string;
}

const RecentDonationCard: React.FC<RecentDonationCardProps> = ({ className = "" }) => {
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentDonation = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/direct-payment/recent?limit=3');
      const result = await response.json();

      if (result.success && result.data.length > 0) {
        setRecentDonations(result.data);
      }
    } catch (error) {
      console.error('Error fetching recent donation:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentDonation();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchRecentDonation, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'upi':
        return <QrCode className="w-4 h-4 text-blue-500" />;
      case 'bank':
        return <Building2 className="w-4 h-4 text-green-500" />;
      case 'crypto':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <CreditCard className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending_verification':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case 'UPI_DIRECT':
        return 'UPI';
      case 'BANK_TRANSFER':
        return 'Bank';
      case 'CRYPTO_USDT':
        return 'USDT';
      case 'CRYPTO_BTC':
        return 'BTC';
      case 'CRYPTO_ETH':
        return 'ETH';
      default:
        return method;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="text-gray-600">Loading recent donations...</p>
        </div>
      </Card>
    );
  }

  if (!recentDonations || recentDonations.length === 0) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No recent donations yet</p>
          <p className="text-sm">Be the first to make a difference!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden shadow-lg ${className}`}>
      <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Recent Support ({recentDonations.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {recentDonations.map((donation, index) => (
            <div key={donation._id} className={`${index > 0 ? 'border-t pt-4' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {donation.donor.isAnonymous ? 'Anonymous Donor' : donation.donor.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">₹{donation.amount}</p>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(donation.status)}
                    <span className="text-xs text-gray-500 capitalize">{donation.status}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 mt-2">
                <div className="flex items-center gap-2 mb-2">
                  {getPaymentMethodIcon(donation.paymentMethod)}
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {donation.paymentMethod} Payment
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Transaction ID: {donation.transactionId}
                </p>
              </div>
            </div>
          ))}
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
            <p className="text-sm text-blue-800 font-medium">
              💝 Thank you for making a difference in farmers' lives!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentDonationCard;
