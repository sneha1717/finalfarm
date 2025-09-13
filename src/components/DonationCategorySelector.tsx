import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Droplets, 
  Zap, 
  Wheat, 
  IndianRupee,
  Target,
  ArrowRight,
  Heart
} from 'lucide-react';
import EnhancedDirectPaymentBox from './EnhancedDirectPaymentBox';

interface Category {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  goal: number;
  raised: number;
}

interface DonationCategorySelectorProps {
  onCategorySelect?: (categoryId: string) => void;
}

const DonationCategorySelector: React.FC<DonationCategorySelectorProps> = ({ onCategorySelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const categories: Category[] = [
    {
      id: 'water',
      title: 'Water-Scarce Areas: Drip Irrigation',
      description: 'Smart irrigation systems reducing water usage by 40-60%',
      icon: <Droplets className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      goal: 500000,
      raised: 125000
    },
    {
      id: 'electricity',
      title: 'Electricity-Scarce Areas: Solar Water Pumps',
      description: 'Solar-powered pumps reducing operational costs by 80%',
      icon: <Zap className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      goal: 750000,
      raised: 180000
    },
    {
      id: 'baler',
      title: 'Crop Residue Utilization: Balers',
      description: 'Converting crop waste into valuable resources',
      icon: <Wheat className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      goal: 400000,
      raised: 95000
    }
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowPayment(true);
    onCategorySelect?.(categoryId);
  };

  const getProgress = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  if (showPayment && selectedCategoryData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <Card className="overflow-hidden shadow-xl border-2 border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <Heart className="w-6 h-6" />
                Support: {selectedCategoryData.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPayment(false)}
                className="text-white hover:bg-white/20"
              >
                ← Back to Categories
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Category Info */}
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${selectedCategoryData.bgColor} ${selectedCategoryData.borderColor} border-2`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={selectedCategoryData.color}>
                      {selectedCategoryData.icon}
                    </div>
                    <h3 className="font-semibold text-gray-800">Project Impact</h3>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">
                    {selectedCategoryData.description}
                  </p>
                  
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Raised: ₹{selectedCategoryData.raised.toLocaleString()}</span>
                      <span className="text-gray-600">Goal: ₹{selectedCategoryData.goal.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${getProgress(selectedCategoryData.raised, selectedCategoryData.goal)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      ₹{(selectedCategoryData.goal - selectedCategoryData.raised).toLocaleString()} still needed
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Component */}
              <div>
                <EnhancedDirectPaymentBox
                  recipientId={selectedCategory}
                  recipientName={selectedCategoryData.title}
                  onPaymentInitiated={(transactionId) => {
                    console.log('Payment initiated:', transactionId);
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="overflow-hidden shadow-xl border-2 border-green-200">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <Heart className="w-8 h-8" />
            Choose Your Impact
          </CardTitle>
          <p className="text-green-100 mt-2">
            Select a category to support sustainable farming in Kerala
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
                onClick={() => handleCategorySelect(category.id)}
              >
                <Card className={`h-full transition-all duration-300 hover:shadow-lg ${category.borderColor} border-2 hover:border-opacity-100`}>
                  <CardContent className="p-6">
                    <div className={`${category.bgColor} ${category.borderColor} border rounded-lg p-4 mb-4`}>
                      <div className={`${category.color} mb-3`}>
                        {category.icon}
                      </div>
                      <h3 className="font-bold text-gray-800 text-lg mb-2 leading-tight">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {category.description}
                      </p>
                      
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">₹{category.raised.toLocaleString()}</span>
                          <span className="text-gray-500">₹{category.goal.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                            style={{ width: `${getProgress(category.raised, category.goal)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge variant="secondary" className="text-xs">
                            {Math.round(getProgress(category.raised, category.goal))}% funded
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {Math.ceil((category.goal - category.raised) / 1000)}k needed
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                      size="lg"
                    >
                      <IndianRupee className="w-4 h-4 mr-2" />
                      Support This Cause
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                Every Donation Makes a Difference
              </h4>
              <p className="text-gray-600 mb-4">
                Your contribution directly supports farmers across Kerala with modern, sustainable technology
              </p>
              <div className="flex justify-center items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-500" />
                  <span>Direct Impact</span>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-green-500" />
                  <span>Zero Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-green-500" />
                  <span>100% to Farmers</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DonationCategorySelector;
