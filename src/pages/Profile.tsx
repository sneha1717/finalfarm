import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Phone, MapPin, Wheat, Landmark, Square } from "lucide-react";

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
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
              {user.avatar ? (
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
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{user.name}</h1>
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

