import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  History, 
  TrendingUp, 
  Users, 
  IndianRupee, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

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
  completedAt?: string;
  recipientName?: string;
}

interface PaymentStats {
  totalDonations: number;
  totalAmount: number;
  completedDonations: number;
  completedAmount: number;
  pendingDonations: number;
  pendingAmount: number;
}

interface PaymentHistorySidebarProps {
  recipientId?: string;
  showGlobalFeed?: boolean;
  onNewDonation?: (donation: Donation) => void;
}

const PaymentHistorySidebar: React.FC<PaymentHistorySidebarProps> = ({
  recipientId,
  showGlobalFeed = false,
  onNewDonation
}) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDonations = async () => {
    try {
      const endpoint = showGlobalFeed 
        ? 'http://localhost:5001/api/direct-payment/recent?limit=15'
        : `http://localhost:5001/api/direct-payment/history/${recipientId}?limit=15`;

      const response = await fetch(endpoint);
      const result = await response.json();

      if (result.success) {
        if (showGlobalFeed) {
          setDonations(result.data);
        } else {
          setDonations(result.data.donations);
          setStats(result.data.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchDonations();
  };

  useEffect(() => {
    if (recipientId || showGlobalFeed) {
      fetchDonations();
      
      // Auto-refresh every 30 seconds
      const interval = setInterval(fetchDonations, 30000);
      return () => clearInterval(interval);
    }
  }, [recipientId, showGlobalFeed]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'pending_verification':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
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
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Loading...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5" />
            {showGlobalFeed ? 'Recent Donations' : 'Payment History'}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={refreshData}
            disabled={refreshing}
            className="text-white hover:bg-white/20"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Statistics Section */}
        {stats && !showGlobalFeed && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-green-700">Total Raised</span>
                </div>
                <div className="text-lg font-bold text-green-800">₹{stats.completedAmount}</div>
                <div className="text-xs text-green-600">{stats.completedDonations} donations</div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">Pending</span>
                </div>
                <div className="text-lg font-bold text-blue-800">₹{stats.pendingAmount}</div>
                <div className="text-xs text-blue-600">{stats.pendingDonations} payments</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Show Details</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <Separator />
          </div>
        )}

        {/* Donations List */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <IndianRupee className="w-4 h-4" />
            Recent Transactions
          </h4>
          
          <ScrollArea className="h-80">
            <AnimatePresence>
              {donations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No donations yet</p>
                </div>
              ) : (
                donations.map((donation, index) => (
                  <motion.div
                    key={donation._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="mb-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-green-600">₹{donation.amount}</span>
                          <Badge variant="secondary" className={getStatusColor(donation.status)}>
                            {donation.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-1">
                          {donation.donor.isAnonymous ? 'Anonymous' : donation.donor.name}
                        </div>
                        
                        {showGlobalFeed && donation.recipientName && (
                          <div className="text-xs text-blue-600 mb-1">
                            → {donation.recipientName}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatPaymentMethod(donation.paymentMethod)}</span>
                          <span>{formatTime(donation.createdAt)}</span>
                        </div>
                        
                        {showDetails && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <div className="text-xs text-gray-500 font-mono">
                              {donation.transactionId}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-2">
                        {getStatusIcon(donation.status)}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Updates every 30 seconds
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentHistorySidebar;
