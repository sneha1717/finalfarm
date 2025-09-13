import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Upload, Building, Mail, Phone, MapPin, Globe, Users, Target, Lock, User, FileText, Camera, Check, HeartHandshake, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';

const NGOLogin: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    organizationName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    ngoRegistrationId: '',
    details: '',
    focusAreas: [] as string[],
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    socialMedia: {
      website: '',
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    },
    photo: ''
  });

  const focusAreaOptions = [
    'Agriculture',
    'Environment',
    'Education',
    'Health',
    'Rural Development',
    'Women Empowerment',
    'Child Welfare',
    'Disaster Relief',
    'Animal Welfare',
    'Other'
  ];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setPhotoPreview(base64);
        setRegisterForm(prev => ({ ...prev, photo: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFocusAreaChange = (focusArea: string, checked: boolean) => {
    setRegisterForm(prev => ({
      ...prev,
      focusAreas: checked 
        ? [...prev.focusAreas, focusArea]
        : prev.focusAreas.filter(area => area !== focusArea)
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!loginForm.email || !loginForm.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!loginForm.email.includes('@')) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const result = await apiService.login(loginForm);

      if (result.success && result.data) {
        login(result.data.ngo, undefined, 'ngo');
        
        toast({
          title: "Login successful!",
          description: `Welcome back, ${result.data.ngo.organizationName}!`,
        });
        
        navigate('/profile');
      } else {
        toast({
          title: "Login failed",
          description: result.message || "Invalid credentials",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection error",
        description: "Please make sure the backend server is running",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!registerForm.organizationName || !registerForm.email || !registerForm.mobile || 
        !registerForm.password || !registerForm.ngoRegistrationId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!registerForm.email.includes('@')) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (registerForm.focusAreas.length === 0) {
      toast({
        title: "Focus areas required",
        description: "Please select at least one focus area",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...submitData } = registerForm;
      const result = await apiService.register(submitData);

      if (result.success && result.data) {
        login(result.data.ngo, undefined, 'ngo');
        
        toast({
          title: "Registration successful!",
          description: `Welcome, ${result.data.ngo.organizationName}! Your account has been created.`,
        });
        
        navigate('/profile');
      } else {
        toast({
          title: "Registration failed",
          description: result.message || "Please check your information and try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection error",
        description: "Please make sure the backend server is running",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/ngo')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to NGOs
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <HeartHandshake className="h-8 w-8 text-green-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
                {t('ngo.title')}
              </h1>
              <p className="text-gray-600 text-center mb-8">
                {t('ngo.subtitle')}
              </p>
              <p className="text-muted-foreground">
                {isLogin ? 'Sign in to your NGO account' : 'Register your NGO with FarmVilla'}
              </p>
            </div>
          </div>
        </motion.div>

        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={isLogin ? "default" : "outline"}
                onClick={() => setIsLogin(true)}
              >
                Login
              </Button>
              <Button
                variant={!isLogin ? "default" : "outline"}
                onClick={() => setIsLogin(false)}
              >
                Register
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {isLogin ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleRegister}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Organization Name *</Label>
                    <Input
                      id="organizationName"
                      value={registerForm.organizationName}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, organizationName: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ngoRegistrationId">NGO Registration ID *</Label>
                    <Input
                      id="ngoRegistrationId"
                      value={registerForm.ngoRegistrationId}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, ngoRegistrationId: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      pattern="[0-9]{10}"
                      value={registerForm.mobile}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, mobile: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details">Organization Details *</Label>
                  <Textarea
                    id="details"
                    value={registerForm.details}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, details: e.target.value }))}
                    placeholder="Describe your organization's mission, activities, and impact..."
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Focus Areas * (Select at least one)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {focusAreaOptions.map((area) => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox
                          id={area}
                          checked={registerForm.focusAreas.includes(area)}
                          onCheckedChange={(checked) => handleFocusAreaChange(area, checked as boolean)}
                        />
                        <Label htmlFor={area} className="text-sm">{area}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo">Organization Photo</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="flex-1"
                    />
                    {photoPreview && (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Address (Optional)</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Street Address"
                      value={registerForm.address.street}
                      onChange={(e) => setRegisterForm(prev => ({
                        ...prev,
                        address: { ...prev.address, street: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="City"
                      value={registerForm.address.city}
                      onChange={(e) => setRegisterForm(prev => ({
                        ...prev,
                        address: { ...prev.address, city: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="State"
                      value={registerForm.address.state}
                      onChange={(e) => setRegisterForm(prev => ({
                        ...prev,
                        address: { ...prev.address, state: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="Pincode"
                      value={registerForm.address.pincode}
                      onChange={(e) => setRegisterForm(prev => ({
                        ...prev,
                        address: { ...prev.address, pincode: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Register NGO'}
                </Button>
              </motion.form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NGOLogin;
