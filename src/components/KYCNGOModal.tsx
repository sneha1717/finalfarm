import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, FileText, Building, Phone, Mail, MapPin, CreditCard, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface KYCNGOModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KYCNGOModal: React.FC<KYCNGOModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    organizationInfo: {
      ngoName: '',
      registrationNumber: '',
      establishedYear: '',
      phone: '',
      email: '',
      website: '',
      address: '',
      pincode: '',
      state: 'Kerala',
      district: ''
    },
    focusAreas: {
      primaryFocus: '',
      targetBeneficiaries: '',
      geographicalArea: '',
      experience: '',
      currentProjects: ''
    },
    legalInfo: {
      registrationType: '',
      fcraNumber: '',
      panNumber: '',
      gstNumber: '',
      trusteeDetails: ''
    },
    documents: {
      registrationCertificate: null,
      panCard: null,
      fcraRegistration: null,
      auditedFinancials: null,
      trustDeed: null,
      projectReports: null
    }
  });

  const steps = [
    { id: 1, title: 'Organization Info', icon: Building },
    { id: 2, title: 'Focus Areas', icon: Users },
    { id: 3, title: 'Legal Details', icon: CreditCard },
    { id: 4, title: 'Documents', icon: FileText },
    { id: 5, title: 'Verification', icon: Shield }
  ];

  const keralaDisitricts = [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam',
    'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram',
    'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
  ];

  const registrationTypes = [
    'Trust', 'Society', 'Section 8 Company', 'Cooperative Society', 'Other'
  ];

  const focusAreas = [
    'Agriculture & Farming', 'Rural Development', 'Education', 'Healthcare',
    'Environment & Sustainability', 'Women Empowerment', 'Child Welfare',
    'Skill Development', 'Disaster Relief', 'Community Development'
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
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields before submission
      if (!formData.organizationInfo.ngoName || !formData.organizationInfo.registrationNumber || 
          !formData.organizationInfo.establishedYear || !formData.organizationInfo.phone || 
          !formData.organizationInfo.email || !formData.organizationInfo.address || 
          !formData.organizationInfo.pincode || !formData.organizationInfo.district ||
          !formData.focusAreas.primaryFocus || !formData.focusAreas.targetBeneficiaries ||
          !formData.focusAreas.geographicalArea || !formData.focusAreas.experience ||
          !formData.focusAreas.currentProjects || !formData.legalInfo.registrationType ||
          !formData.legalInfo.panNumber || !formData.legalInfo.trusteeDetails) {
        alert('Please fill in all required fields before submitting.');
        return;
      }

      // Validate phone number format
      if (!/^[0-9]{10}$/.test(formData.organizationInfo.phone)) {
        alert('Please enter a valid 10-digit phone number.');
        return;
      }

      // Validate pincode format
      if (!/^[0-9]{6}$/.test(formData.organizationInfo.pincode)) {
        alert('Please enter a valid 6-digit pincode.');
        return;
      }

      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.organizationInfo.email)) {
        alert('Please enter a valid email address.');
        return;
      }

      console.log('Submitting NGO form data:', formData);
      
      const response = await fetch('http://localhost:5001/api/kyc/ngo/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('NGO Server response:', result);

      if (result.success) {
        alert(`NGO KYC application submitted successfully! Application ID: ${result.data.id}. Our team will review and contact you within 3-5 business days.`);
        // Reset form
        setFormData({
          organizationInfo: {
            ngoName: '',
            registrationNumber: '',
            establishedYear: '',
            phone: '',
            email: '',
            website: '',
            address: '',
            pincode: '',
            state: 'Kerala',
            district: ''
          },
          focusAreas: {
            primaryFocus: '',
            targetBeneficiaries: '',
            geographicalArea: '',
            experience: '',
            currentProjects: ''
          },
          legalInfo: {
            registrationType: '',
            fcraNumber: '',
            panNumber: '',
            gstNumber: '',
            trusteeDetails: ''
          },
          documents: {
            registrationCertificate: null,
            panCard: null,
            fcraRegistration: null,
            auditedFinancials: null,
            trustDeed: null,
            projectReports: null
          }
        });
        setCurrentStep(1);
        onClose();
      } else {
        alert(`Error: ${result.message}\n\nDetails: ${JSON.stringify(result.errors || result.error || 'Unknown error')}`);
      }
    } catch (error) {
      console.error('NGO KYC submission error:', error);
      alert('Failed to submit NGO KYC application. Please try again.');
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
            className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden relative"
          >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">KYC NGO 🏢</h2>
                <p className="text-white/80">Register your NGO for agricultural partnerships</p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center gap-2 ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200'
                    }`}>
                      <step.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium hidden sm:block">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Step 1: Organization Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    Organization Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ngoName">NGO/Organization Name *</Label>
                      <Input
                        id="ngoName"
                        value={formData.organizationInfo.ngoName}
                        onChange={(e) => handleInputChange('organizationInfo', 'ngoName', e.target.value)}
                        placeholder="Enter organization name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="registrationNumber">Registration Number *</Label>
                      <Input
                        id="registrationNumber"
                        value={formData.organizationInfo.registrationNumber}
                        onChange={(e) => handleInputChange('organizationInfo', 'registrationNumber', e.target.value)}
                        placeholder="Registration/License number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="establishedYear">Established Year *</Label>
                      <Input
                        id="establishedYear"
                        value={formData.organizationInfo.establishedYear}
                        onChange={(e) => handleInputChange('organizationInfo', 'establishedYear', e.target.value)}
                        placeholder="YYYY"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Contact Number *</Label>
                      <Input
                        id="phone"
                        value={formData.organizationInfo.phone}
                        onChange={(e) => handleInputChange('organizationInfo', 'phone', e.target.value)}
                        placeholder="10-digit contact number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Official Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.organizationInfo.email}
                        onChange={(e) => handleInputChange('organizationInfo', 'email', e.target.value)}
                        placeholder="official@ngo.org"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website (Optional)</Label>
                      <Input
                        id="website"
                        value={formData.organizationInfo.website}
                        onChange={(e) => handleInputChange('organizationInfo', 'website', e.target.value)}
                        placeholder="https://www.ngo.org"
                      />
                    </div>
                    <div>
                      <Label htmlFor="district">District *</Label>
                      <select
                        id="district"
                        value={formData.organizationInfo.district}
                        onChange={(e) => handleInputChange('organizationInfo', 'district', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select District</option>
                        {keralaDisitricts.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={formData.organizationInfo.pincode}
                        onChange={(e) => handleInputChange('organizationInfo', 'pincode', e.target.value)}
                        placeholder="6-digit pincode"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Full Address *</Label>
                      <Textarea
                        id="address"
                        value={formData.organizationInfo.address}
                        onChange={(e) => handleInputChange('organizationInfo', 'address', e.target.value)}
                        placeholder="Complete address with landmarks"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Focus Areas */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Focus Areas & Activities
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryFocus">Primary Focus Area *</Label>
                      <select
                        id="primaryFocus"
                        value={formData.focusAreas.primaryFocus}
                        onChange={(e) => handleInputChange('focusAreas', 'primaryFocus', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select Focus Area</option>
                        {focusAreas.map(area => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="experience">Years of Experience *</Label>
                      <select
                        id="experience"
                        value={formData.focusAreas.experience}
                        onChange={(e) => handleInputChange('focusAreas', 'experience', e.target.value)}
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
                      <Label htmlFor="targetBeneficiaries">Target Beneficiaries *</Label>
                      <Textarea
                        id="targetBeneficiaries"
                        value={formData.focusAreas.targetBeneficiaries}
                        onChange={(e) => handleInputChange('focusAreas', 'targetBeneficiaries', e.target.value)}
                        placeholder="Describe your target beneficiaries (farmers, women, children, etc.)"
                        rows={2}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="geographicalArea">Geographical Coverage *</Label>
                      <Textarea
                        id="geographicalArea"
                        value={formData.focusAreas.geographicalArea}
                        onChange={(e) => handleInputChange('focusAreas', 'geographicalArea', e.target.value)}
                        placeholder="Areas/districts where you operate"
                        rows={2}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="currentProjects">Current/Recent Projects *</Label>
                      <Textarea
                        id="currentProjects"
                        value={formData.focusAreas.currentProjects}
                        onChange={(e) => handleInputChange('focusAreas', 'currentProjects', e.target.value)}
                        placeholder="Brief description of current or recent projects"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Legal Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Legal & Compliance Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="registrationType">Registration Type *</Label>
                      <select
                        id="registrationType"
                        value={formData.legalInfo.registrationType}
                        onChange={(e) => handleInputChange('legalInfo', 'registrationType', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select Type</option>
                        {registrationTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="panNumber">PAN Number *</Label>
                      <Input
                        id="panNumber"
                        value={formData.legalInfo.panNumber}
                        onChange={(e) => handleInputChange('legalInfo', 'panNumber', e.target.value)}
                        placeholder="ABCDE1234F"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fcraNumber">FCRA Number (if applicable)</Label>
                      <Input
                        id="fcraNumber"
                        value={formData.legalInfo.fcraNumber}
                        onChange={(e) => handleInputChange('legalInfo', 'fcraNumber', e.target.value)}
                        placeholder="FCRA registration number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gstNumber">GST Number (if applicable)</Label>
                      <Input
                        id="gstNumber"
                        value={formData.legalInfo.gstNumber}
                        onChange={(e) => handleInputChange('legalInfo', 'gstNumber', e.target.value)}
                        placeholder="GST registration number"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="trusteeDetails">Key Personnel/Trustees *</Label>
                      <Textarea
                        id="trusteeDetails"
                        value={formData.legalInfo.trusteeDetails}
                        onChange={(e) => handleInputChange('legalInfo', 'trusteeDetails', e.target.value)}
                        placeholder="Names and designations of key personnel/trustees"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Document Upload */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Document Upload
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { key: 'registrationCertificate', label: 'Registration Certificate', required: true },
                      { key: 'panCard', label: 'PAN Card', required: true },
                      { key: 'fcraRegistration', label: 'FCRA Registration', required: false },
                      { key: 'auditedFinancials', label: 'Audited Financial Statements', required: true },
                      { key: 'trustDeed', label: 'Trust Deed/MOA', required: true },
                      { key: 'projectReports', label: 'Project Reports/Brochures', required: false }
                    ].map((doc) => (
                      <Card key={doc.key} className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                        <CardContent className="p-4 text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="font-medium mb-1">
                            {doc.label}
                            {doc.required && <span className="text-red-500 ml-1">*</span>}
                          </p>
                          <p className="text-sm text-gray-500 mb-3">
                            Upload clear scan/photo (JPG, PNG, PDF)
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
                            <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800">
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

            {/* Step 5: Verification */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Review & Submit</h3>
                  <p className="text-gray-600 mb-6">
                    Please review your NGO information before submitting the application.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">Organization Information</h4>
                    <p><strong>Name:</strong> {formData.organizationInfo.ngoName}</p>
                    <p><strong>Registration:</strong> {formData.organizationInfo.registrationNumber}</p>
                    <p><strong>Established:</strong> {formData.organizationInfo.establishedYear}</p>
                    <p><strong>Contact:</strong> {formData.organizationInfo.phone}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">Focus Areas</h4>
                    <p><strong>Primary Focus:</strong> {formData.focusAreas.primaryFocus}</p>
                    <p><strong>Experience:</strong> {formData.focusAreas.experience} years</p>
                    <p><strong>Coverage:</strong> {formData.focusAreas.geographicalArea}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">Legal Details</h4>
                    <p><strong>Type:</strong> {formData.legalInfo.registrationType}</p>
                    <p><strong>PAN:</strong> {formData.legalInfo.panNumber}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">Documents</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(formData.documents).map(([key, file]) => (
                        file && (
                          <Badge key={key} variant="secondary" className="bg-blue-100 text-blue-800">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} ✓
                          </Badge>
                        )
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Partnership Benefits</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Access to verified farmer database for targeted programs</li>
                    <li>• Direct donation channel for agricultural projects</li>
                    <li>• Collaboration opportunities with other NGOs</li>
                    <li>• Government scheme integration and support</li>
                    <li>• Impact tracking and reporting tools</li>
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
              {currentStep < 5 ? (
                <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
                  Next Step
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                  Submit NGO Application
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

export default KYCNGOModal;
