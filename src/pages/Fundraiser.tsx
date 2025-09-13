import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Droplets,
  Zap,
  Wheat
} from 'lucide-react';
import RecentDonationCard from '../components/RecentDonationCard';
import DonationCategorySelector from '../components/DonationCategorySelector';

const Fundraiser: React.FC = () => {
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50"
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content - All Causes */}
          <div className="lg:col-span-3 space-y-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                FarmVilla Foundation - Agricultural Support
              </h1>
              <p className="text-lg text-gray-600">
                Supporting sustainable farming practices across Kerala
              </p>
            </div>

            {/* Water-Scarce Areas: Drip Irrigation */}
            <Card className="overflow-hidden shadow-lg">
              <div className="h-64">
                <img
                  src="/drip.jpg"
                  alt="Drip Irrigation System"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Droplets className="w-6 h-6" />
                    Water-Scarce Areas: Drip Irrigation
                  </CardTitle>
                  <Badge variant="secondary" className="bg-white text-blue-600">
                    Water Conservation
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 mb-4">
                  Smart drip irrigation systems deliver water directly to roots, reducing water usage by 40-60% 
                  while increasing crop yields. Essential for drought-prone regions in Kerala.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Impact Areas:</h4>
                  <ul className="list-disc list-inside space-y-1 text-blue-700">
                    <li>Palakkad - Rice and vegetable farms</li>
                    <li>Wayanad - Spice plantations</li>
                    <li>Idukki - Tea and cardamom estates</li>
                    <li>Thrissur - Coconut groves</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Electricity-Scarce Areas: Solar Water Pumps */}
            <Card className="overflow-hidden shadow-lg">
              <div className="h-64 bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                <div className="text-center">
                  <Zap className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                  <p className="text-orange-700 font-semibold">Solar Water Pump System</p>
                  <p className="text-orange-600 text-sm">Renewable Energy Solution</p>
                </div>
              </div>
              <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Zap className="w-6 h-6" />
                    Electricity-Scarce Areas: Solar Water Pumps
                  </CardTitle>
                  <Badge variant="secondary" className="bg-white text-orange-600">
                    Renewable Energy
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 mb-4">
                  Solar-powered water pumps provide reliable irrigation without electricity costs. 
                  Reduces operational expenses by 80% and ensures consistent water supply.
                </p>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">Target Regions:</h4>
                  <ul className="list-disc list-inside space-y-1 text-yellow-700">
                    <li>Kasaragod - Remote coastal farms</li>
                    <li>Kannur - Hillside plantations</li>
                    <li>Kozhikode - Pepper and rubber estates</li>
                    <li>Malappuram - Small-scale farming</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Crop Residue Utilization: Balers */}
            <Card className="overflow-hidden shadow-lg">
              <div className="h-64">
                <img
                  src="/baler.jpg"
                  alt="Agricultural Baler Machine"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Wheat className="w-6 h-6" />
                    Crop Residue Utilization: Balers
                  </CardTitle>
                  <Badge variant="secondary" className="bg-white text-green-600">
                    Waste Management
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 mb-4">
                  Modern balers convert crop residue into valuable bales for livestock feed, 
                  biofuel, and organic fertilizer. Reduces burning and creates additional income streams.
                </p>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Implementation Areas:</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-700">
                    <li>Kottayam - Paddy field residue management</li>
                    <li>Alappuzha - Rice straw utilization</li>
                    <li>Ernakulam - Mixed crop residue processing</li>
                    <li>Pathanamthitta - Sustainable farming practices</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Donation Category Selector */}
            <div className="mt-12">
              <DonationCategorySelector 
                onCategorySelect={(categoryId) => {
                  console.log('Category selected:', categoryId);
                }}
              />
            </div>
          </div>

          {/* Right Sidebar - Recent Donation Only */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <RecentDonationCard />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Fundraiser;
