import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, FileText, User, Phone, Mail, MapPin, CreditCard, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface KYCModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KYCModal: React.FC<KYCModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      pincode: '',
      state: 'Kerala',
      district: ''
    },
    farmInfo: {
      farmSize: '',
      cropTypes: '',
      farmLocation: '',
      experience: ''
    },
    documents: {
      aadhar: null,
      panCard: null,
      landRecords: null,
      bankPassbook: null
    }
  });

  const steps = [
    { id: 1, title: 'Personal Information', icon: User },
    { id: 2, title: 'Farm Details', icon: MapPin },
    { id: 3, title: 'Document Upload', icon: FileText },
    { id: 4, title: 'Verification', icon: Shield }
  ];

  const keralaDisitricts = [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam',
    'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram',
    'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
  ];

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleFileUpload = (docType: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: file
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields before submission
      if (!formData.personalInfo.fullName || !formData.personalInfo.phone || 
          !formData.personalInfo.address || !formData.personalInfo.pincode || 
          !formData.personalInfo.district || !formData.farmInfo.farmSize || 
          !formData.farmInfo.cropTypes || !formData.farmInfo.farmLocation || 
          !formData.farmInfo.experience) {
        alert('Please fill in all required fields before submitting.');
        return;
      }

      // Validate phone number format
      if (!/^[0-9]{10}$/.test(formData.personalInfo.phone)) {
        alert('Please enter a valid 10-digit phone number.');
        return;
      }

      // Validate pincode format
      if (!/^[0-9]{6}$/.test(formData.personalInfo.pincode)) {
        alert('Please enter a valid 6-digit pincode.');
        return;
      }

      console.log('Submitting form data:', formData);
      
      const response = await fetch('http://localhost:5001/api/kyc/farmer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('Server response:', result);

      if (result.success) {
        alert(`Farmer KYC application submitted successfully! Application ID: ${result.data.id}. You will receive verification status within 24-48 hours.`);
        // Reset form
        setFormData({
          personalInfo: {
            fullName: '',
            phone: '',
            email: '',
            address: '',
            pincode: '',
            state: 'Kerala',
            district: ''
          },
          farmInfo: {
            farmSize: '',
            cropTypes: '',
            farmLocation: '',
            experience: ''
          },
          documents: {
            aadhar: null,
            panCard: null,
            landRecords: null,
            bankPassbook: null
          }
        });
        setCurrentStep(1);
        onClose();
      } else {
        alert(`Error: ${result.message}\n\nDetails: ${JSON.stringify(result.errors || result.error || 'Unknown error')}`);
      }
    } catch (error) {
      console.error('KYC submission error:', error);
      alert('Failed to submit KYC application. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" style={{ paddingTop: '300px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative"
          >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">KYC Verification 📲</h2>
                <p className="text-white/80">Complete your farmer verification process</p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center gap-2 ${
                    currentStep >= step.id ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep >= step.id ? 'bg-green-600 text-white' : 'bg-gray-200'
                    }`}>
                      <step.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium hidden sm:block">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.personalInfo.fullName}
                        onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.personalInfo.phone}
                        onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                        placeholder="10-digit mobile number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.personalInfo.email}
                        onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="district">District *</Label>
                      <select
                        id="district"
                        value={formData.personalInfo.district}
                        onChange={(e) => handleInputChange('personalInfo', 'district', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select District</option>
                        {keralaDisitricts.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Full Address *</Label>
                      <Textarea
                        id="address"
                        value={formData.personalInfo.address}
                        onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                        placeholder="House/Building, Street, Village/Town"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={formData.personalInfo.pincode}
                        onChange={(e) => handleInputChange('personalInfo', 'pincode', e.target.value)}
                        placeholder="6-digit pincode"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Farm Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Farm Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="farmSize">Farm Size (in acres) *</Label>
                      <Input
                        id="farmSize"
                        value={formData.farmInfo.farmSize}
                        onChange={(e) => handleInputChange('farmInfo', 'farmSize', e.target.value)}
                        placeholder="e.g., 2.5 acres"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience">Farming Experience *</Label>
                      <select
                        id="experience"
                        value={formData.farmInfo.experience}
                        onChange={(e) => handleInputChange('farmInfo', 'experience', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select Experience</option>
                        <option value="0-2">0-2 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="6-10">6-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="cropTypes">Main Crops Grown *</Label>
                      <Textarea
                        id="cropTypes"
                        value={formData.farmInfo.cropTypes}
                        onChange={(e) => handleInputChange('farmInfo', 'cropTypes', e.target.value)}
                        placeholder="e.g., Rice, Coconut, Spices, Vegetables"
                        rows={2}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="farmLocation">Farm Location/Address *</Label>
                      <Textarea
                        id="farmLocation"
                        value={formData.farmInfo.farmLocation}
                        onChange={(e) => handleInputChange('farmInfo', 'farmLocation', e.target.value)}
                        placeholder="Detailed farm location with landmarks"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Document Upload */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    Document Upload
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { key: 'aadhar', label: 'Aadhar Card', required: true },
                      { key: 'panCard', label: 'PAN Card', required: false },
                      { key: 'landRecords', label: 'Land Records/Patta', required: true },
                      { key: 'bankPassbook', label: 'Bank Passbook', required: false }
                    ].map((doc) => (
                      <Card key={doc.key} className="border-2 border-dashed border-gray-300 hover:border-green-400 transition-colors">
                        <CardContent className="p-4 text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="font-medium mb-1">
                            {doc.label}
                            {doc.required && <span className="text-red-500 ml-1">*</span>}
                          </p>
                          <p className="text-sm text-gray-500 mb-3">
                            Upload clear photo/scan (JPG, PNG, PDF)
                          </p>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload(doc.key, e.target.files?.[0] || null)}
                            className="hidden"
                            id={`upload-${doc.key}`}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById(`upload-${doc.key}`)?.click()}
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Choose File
                          </Button>
                          {formData.documents[doc.key as keyof typeof formData.documents] && (
                            <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                              File Uploaded ✓
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Verification */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Review & Submit</h3>
                  <p className="text-gray-600 mb-6">
                    Please review your information before submitting your KYC application.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Personal Information</h4>
                    <p><strong>Name:</strong> {formData.personalInfo.fullName}</p>
                    <p><strong>Phone:</strong> {formData.personalInfo.phone}</p>
                    <p><strong>District:</strong> {formData.personalInfo.district}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Farm Details</h4>
                    <p><strong>Farm Size:</strong> {formData.farmInfo.farmSize} acres</p>
                    <p><strong>Experience:</strong> {formData.farmInfo.experience} years</p>
                    <p><strong>Main Crops:</strong> {formData.farmInfo.cropTypes}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Documents</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(formData.documents).map(([key, file]) => (
                        file && (
                          <Badge key={key} variant="secondary" className="bg-green-100 text-green-800">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} ✓
                          </Badge>
                        )
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">What happens next?</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Your application will be reviewed within 24-48 hours</li>
                    <li>• You'll receive SMS/Email updates on verification status</li>
                    <li>• Once approved, you'll get access to premium farming features</li>
                    <li>• Government scheme eligibility will be automatically checked</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </div>
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
              {currentStep < 4 ? (
                <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700">
                  Next Step
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                  Submit KYC Application
                </Button>
              )}
            </div>
          </div>
        </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default KYCModal;
