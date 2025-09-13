import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Building, 
  Users, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  FileText,
  Settings,
  Bell,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  Sun,
  Droplets,
  Wind,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const NGODashboard: React.FC = () => {
  const { ngo, userType } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalProjects: 12,
    activeFarmers: 245,
    completedProjects: 8,
    totalFunding: 125000
  });

  useEffect(() => {
    if (userType !== 'ngo' || !ngo) {
      navigate('/ngo-login');
      return;
    }
  }, [userType, ngo, navigate]);

  if (!ngo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <Building className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  const recentActivities = [
    { id: 1, type: "project", title: t('ngo.projectStarted'), time: `2 ${t('ngo.hoursAgo')}`, status: "active" },
    { id: 2, type: "farmer", title: `5 ${t('ngo.farmersRegistered')}`, time: `1 ${t('ngo.dayAgo')}`, status: "success" },
    { id: 3, type: "funding", title: `${t('ngo.fundingReceived')} ₹50,000`, time: `3 ${t('ngo.daysAgo')}`, status: "success" },
    { id: 4, type: "verification", title: `${t('ngo.documentVerification')} ${t('ngo.pending')}`, time: `1 ${t('ngo.weekAgo')}`, status: "pending" }
  ];

  const upcomingEvents = [
    { id: 1, title: t('ngo.trainingWorkshop'), date: "2025-09-15", location: t('ngo.communityCenter') },
    { id: 2, title: t('ngo.cropAssessment'), date: "2025-09-18", location: t('ngo.villageFarm') },
    { id: 3, title: t('ngo.fundingReview'), date: "2025-09-20", location: t('ngo.ngoOffice') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t('ngo.dashboard')}</h1>
              <p className="text-blue-100">{t('ngo.welcomeBack')}, {ngo?.organizationName || t('ngo.admin')}</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/profile')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Settings className="w-4 h-4 mr-2" />
                Profile Settings
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => navigate('/profile')}
              >
                {t('ngo.viewProfile')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  {t('ngo.totalProjects')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.totalProjects}</div>
                <p className="text-sm text-gray-600 mt-1">{t('ngo.activeCompleted')}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-green-600" />
                  {t('ngo.activeFarmers')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.activeFarmers}</div>
                <p className="text-sm text-gray-600 mt-1">{t('ngo.currentlySupported')}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  {t('ngo.completedProjects')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.completedProjects}</div>
                <p className="text-sm text-gray-600 mt-1">{t('ngo.successfullyFinished')}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                  {t('ngo.totalFunding')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">₹{stats.totalFunding.toLocaleString()}</div>
                <p className="text-sm text-gray-600 mt-1">{t('ngo.fundsRaised')}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activities */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                {t('dashboard.recentActivities')}
              </CardTitle>
              <CardDescription>{t('ngo.latestUpdates')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.status === 'success' ? 'bg-green-100 text-green-600' :
                      activity.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {activity.type === 'project' && <Target className="w-5 h-5" />}
                      {activity.type === 'farmer' && <Users className="w-5 h-5" />}
                      {activity.type === 'funding' && <TrendingUp className="w-5 h-5" />}
                      {activity.type === 'verification' && <FileText className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                    <Badge variant={activity.status === 'success' ? 'default' : 
                                  activity.status === 'pending' ? 'secondary' : 'outline'}>
                      {t(`dashboard.task${activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}`)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weather Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-yellow-600" />
                {t('dashboard.todaysWeather')}
              </CardTitle>
              <CardDescription>{t('ngo.currentWeatherConditions')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 mb-2">28°C</div>
                <p className="text-gray-600 mb-4">{t('dashboard.partlyCloudy')}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span>{t('dashboard.humidity')}: 65%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-gray-500" />
                    <span>{t('dashboard.windSpeed')}: 12 km/h</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NGO Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Organization Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{ngo.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{ngo.mobile}</span>
              </div>
              {ngo.address?.city && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{ngo.address.city}, {ngo.address.state}</span>
                </div>
              )}
              {ngo.socialMedia?.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <a href={ngo.socialMedia.website} target="_blank" rel="noopener noreferrer" 
                     className="text-sm text-blue-600 hover:text-blue-800">
                    Visit Website
                  </a>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">Focus Areas</p>
                <div className="flex flex-wrap gap-2">
                  {ngo.focusAreas.map((area, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Verification Status</span>
                  <Badge variant={ngo.isVerified ? 'default' : 'secondary'}>
                    {ngo.isVerified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks & Notification Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                {t('dashboard.upcomingTasks')}
              </CardTitle>
              <CardDescription>{t('ngo.scheduledActivities')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{t('ngo.trainingWorkshop')}</p>
                    <p className="text-sm text-gray-500">{t('dashboard.today')} 2:00 PM</p>
                  </div>
                  <Badge variant="secondary">{t('dashboard.high')}</Badge>
                </div>
                <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{t('ngo.cropAssessment')}</p>
                    <p className="text-sm text-gray-500">{t('dashboard.tomorrow')} 10:00 AM</p>
                  </div>
                  <Badge variant="outline">{t('dashboard.medium')}</Badge>
                </div>
                <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{t('ngo.fundingReview')}</p>
                    <p className="text-sm text-gray-500">{t('dashboard.nextWeek')}</p>
                  </div>
                  <Badge variant="outline">{t('dashboard.low')}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-red-600" />
                {t('dashboard.notificationAlerts')}
              </CardTitle>
              <CardDescription>{t('ngo.importantAlerts')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Bell className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{t('dashboard.weatherAlert')}</p>
                    <p className="text-sm text-gray-500">Heavy rainfall expected {t('dashboard.tomorrow')}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {t('dashboard.dismiss')}
                  </Button>
                </div>
                <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{t('dashboard.systemAlert')}</p>
                    <p className="text-sm text-gray-500">Document verification pending</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {t('dashboard.viewAll')}
                  </Button>
                </div>
                <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{t('dashboard.reminderAlert')}</p>
                    <p className="text-sm text-gray-500">Monthly farmer meeting {t('dashboard.thisWeek')}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {t('dashboard.markComplete')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                {t('ngo.upcomingEvents')}
              </CardTitle>
              <CardDescription>{t('ngo.scheduledActivities')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{event.title}</p>
                      <p className="text-sm text-gray-500">{event.date} • {event.location}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      {t('dashboard.viewAll')}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                {t('ngo.quickActions')}
              </CardTitle>
              <CardDescription>{t('ngo.commonTasks')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button className="h-20 flex-col gap-2 bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-6 h-6" />
                  <span className="text-sm">{t('ngo.newProject')}</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Users className="w-6 h-6" />
                  <span className="text-sm">{t('ngo.manageFarmers')}</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <BarChart3 className="w-6 h-6" />
                  <span className="text-sm">{t('ngo.viewReports')}</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <FileText className="w-6 h-6" />
                  <span className="text-sm">{t('ngo.documents')}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;
