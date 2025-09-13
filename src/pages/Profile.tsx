import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin, Wheat, Landmark, Square, Building, Shield, Calendar, Globe, Edit } from "lucide-react";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Profile: React.FC = () => {
  const { user, ngo, userType, login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    organizationName: '',
    email: '',
    mobile: '',
    details: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    socialMedia: {
      website: ''
    }
  });

  // Load fresh profile data when component mounts
  useEffect(() => {
    const loadProfile = async () => {
      if (userType === 'ngo' && localStorage.getItem('ngoToken')) {
        setLoading(true);
        try {
          const result = await apiService.getProfile();
          if (result.success && result.data?.ngo) {
            login(result.data.ngo, undefined, 'ngo');
          }
        } catch (error) {
          console.error('Failed to load profile:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadProfile();
  }, [userType, login]);

  // Initialize edit form when NGO data is available
  useEffect(() => {
    if (ngo) {
      setEditForm({
        organizationName: ngo.organizationName || '',
        email: ngo.email || '',
        mobile: ngo.mobile || '',
        details: ngo.details || '',
        address: {
          street: ngo.address?.street || '',
          city: ngo.address?.city || '',
          state: ngo.address?.state || '',
          pincode: ngo.address?.pincode || ''
        },
        socialMedia: {
          website: ngo.socialMedia?.website || ''
        }
      });
    }
  }, [ngo]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const result = await apiService.updateProfile(editForm);
      if (result.success && result.data?.ngo) {
        login(result.data.ngo, undefined, 'ngo');
        setEditDialogOpen(false);
        toast({
          title: "Profile updated successfully!",
          description: "Your changes have been saved.",
        });
      } else {
        toast({
          title: "Update failed",
          description: result.message || "Failed to update profile",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection error",
        description: "Please check your connection and try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user && !ngo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center max-w-md w-full border border-green-100">
          <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Profile Found</h2>
          <p className="text-gray-600 leading-relaxed">
            Please login to view your profile and access your farming dashboard.
          </p>
        </div>
      </div>
    );
  }

  // NGO Profile View
  if (userType === 'ngo' && ngo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* NGO Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-700/90"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                {ngo.photo?.url ? (
                  <img 
                    src={ngo.photo.url} 
                    alt="NGO Logo" 
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/30 shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 rounded-full border-4 border-white/30 shadow-lg flex items-center justify-center">
                    <Building className="w-12 h-12 md:w-16 md:h-16 text-white" />
                  </div>
                )}
                {ngo.isVerified && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{ngo.organizationName}</h1>
                <p className="text-blue-100 text-lg">
                  {ngo.isVerified ? 'Verified NGO' : 'NGO Organization'} • {ngo.focusAreas.join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* NGO Profile Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-b-2xl shadow-xl border-x border-b border-blue-100">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Building className="w-6 h-6 text-blue-600" />
                Organization Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b border-blue-100 pb-2">
                    Contact Details
                  </h3>
                  
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-semibold text-gray-800">{ngo.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mobile Number</p>
                      <p className="font-semibold text-gray-800">{ngo.mobile}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Registration ID</p>
                      <p className="font-semibold text-gray-800">{ngo.ngoRegistrationId}</p>
                    </div>
                  </div>

                  {ngo.address?.city && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-semibold text-gray-800">
                          {ngo.address.city}, {ngo.address.state}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Organization Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b border-blue-100 pb-2">
                    Organization Details
                  </h3>
                  
                  <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mt-1">
                      <Wheat className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-2">Focus Areas</p>
                      <div className="flex flex-wrap gap-2">
                        {ngo.focusAreas.map((area, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-sm font-medium"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mt-1">
                      <Building className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-2">About Organization</p>
                      <p className="text-gray-800 text-sm leading-relaxed">{ngo.details}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(ngo.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {ngo.socialMedia?.website && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <a 
                          href={ngo.socialMedia.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-semibold text-blue-600 hover:text-blue-800"
                        >
                          {ngo.socialMedia.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-8 pb-8">
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-blue-100">
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit NGO Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Organization Name</Label>
                          <Input
                            id="edit-name"
                            value={editForm.organizationName}
                            onChange={(e) => setEditForm(prev => ({ ...prev, organizationName: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-email">Email Address</Label>
                          <Input
                            id="edit-email"
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-mobile">Mobile Number</Label>
                        <Input
                          id="edit-mobile"
                          value={editForm.mobile}
                          onChange={(e) => setEditForm(prev => ({ ...prev, mobile: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-details">Organization Details</Label>
                        <Textarea
                          id="edit-details"
                          value={editForm.details}
                          onChange={(e) => setEditForm(prev => ({ ...prev, details: e.target.value }))}
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold">Address</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            placeholder="Street Address"
                            value={editForm.address.street}
                            onChange={(e) => setEditForm(prev => ({
                              ...prev,
                              address: { ...prev.address, street: e.target.value }
                            }))}
                          />
                          <Input
                            placeholder="City"
                            value={editForm.address.city}
                            onChange={(e) => setEditForm(prev => ({
                              ...prev,
                              address: { ...prev.address, city: e.target.value }
                            }))}
                          />
                          <Input
                            placeholder="State"
                            value={editForm.address.state}
                            onChange={(e) => setEditForm(prev => ({
                              ...prev,
                              address: { ...prev.address, state: e.target.value }
                            }))}
                          />
                          <Input
                            placeholder="Pincode"
                            value={editForm.address.pincode}
                            onChange={(e) => setEditForm(prev => ({
                              ...prev,
                              address: { ...prev.address, pincode: e.target.value }
                            }))}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-website">Website</Label>
                        <Input
                          id="edit-website"
                          placeholder="https://your-website.com"
                          value={editForm.socialMedia.website}
                          onChange={(e) => setEditForm(prev => ({
                            ...prev,
                            socialMedia: { ...prev.socialMedia, website: e.target.value }
                          }))}
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleUpdateProfile} disabled={loading}>
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <button 
                  onClick={() => navigate('/ngo-dashboard')}
                  className="flex-1 bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold border-2 border-blue-200 hover:bg-blue-50 transition-all duration-200"
                >
                  View Dashboard
                </button>
                {!ngo.isVerified && (
                  <button className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200">
                    Request Verification
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Farmer Profile View
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-t-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-green-700/90"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Profile Avatar" 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/30 shadow-lg object-cover"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 rounded-full border-4 border-white/30 shadow-lg flex items-center justify-center">
                  <User className="w-12 h-12 md:w-16 md:h-16 text-white" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{user?.name}</h1>
              <p className="text-green-100 text-lg">Farmer & Agriculture Professional</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-b-2xl shadow-xl border-x border-b border-green-100">
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-green-600" />
              Profile Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b border-green-100 pb-2">
                  Contact Details
                </h3>
                
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-100 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-semibold text-gray-800">{user.email}</p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-100 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-semibold text-gray-800">{user.phone}</p>
                    </div>
                  </div>
                )}

                {user.location && (
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-100 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold text-gray-800">{user.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Farm Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b border-green-100 pb-2">
                  Farm Details
                </h3>
                
                {user.farmSize && (
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-100 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                      <Square className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Farm Size</p>
                      <p className="font-semibold text-gray-800">{user.farmSize} acres</p>
                    </div>
                  </div>
                )}

                {user.crops && user.crops.length > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-100 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mt-1">
                      <Wheat className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-2">Crops Grown</p>
                      <div className="flex flex-wrap gap-2">
                        {user.crops.map((crop, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full text-sm font-medium"
                          >
                            {crop}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-green-100">
              <button className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl">
                Edit Profile
              </button>
              <button className="flex-1 bg-white text-green-700 px-6 py-3 rounded-lg font-semibold border-2 border-green-200 hover:bg-green-50 transition-all duration-200">
                View Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

