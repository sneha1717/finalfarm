import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { 
  Sprout, 
  CloudSun, 
  TrendingUp, 
  Bell,
  MessageCircle,
  Calendar,
  Droplets,
  ThermometerSun,
  Users,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { WeatherData } from '@/types';

const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('weather-cache');
      if (saved) {
        setWeather(JSON.parse(saved));
      }
    } catch {}
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const quickStats = [
    {
      title: 'Active Crops',
      value: '4',
      icon: Sprout,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Today\'s Temp',
      value: '28°C',
      icon: ThermometerSun,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'Rainfall',
      value: '15mm',
      icon: Droplets,
      color: 'text-earth',
      bgColor: 'bg-earth/10'
    },
    {
      title: 'Notifications',
      value: '3',
      icon: Bell,
      color: 'text-primary-glow',
      bgColor: 'bg-primary-glow/10'
    }
  ];

  const recentActivities = [
    {
      action: 'Rice plantation watered',
      time: '2 hours ago',
      icon: Droplets,
      color: 'text-primary'
    },
    {
      action: 'Weather alert received',
      time: '5 hours ago',
      icon: CloudSun,
      color: 'text-accent'
    },
    {
      action: 'Coconut price updated',
      time: '1 day ago',
      icon: TrendingUp,
      color: 'text-earth'
    }
  ];

  const upcomingTasks = [
    {
      task: 'Apply fertilizer to rice field',
      date: 'Tomorrow',
      priority: 'high'
    },
    {
      task: 'Harvest pepper',
      date: 'In 3 days',
      priority: 'medium'
    },
    {
      task: 'Inspect coconut trees',
      date: 'Next week',
      priority: 'low'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t('dashboard.welcome')}, {user?.name}! 👋
            </h1>
            <p className="text-muted-foreground mt-2">
              Here's what's happening on your farm today
            </p>
          </div>
          <div className="flex gap-3">
            {/* Add Profile Button */}
            <Button
              asChild
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10 shrink-0"
            >
              <Link to="/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10 shrink-0"
            >
              <Link to="/community" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Community
              </Link>
            </Button>
            <Button 
              asChild 
              className="bg-gradient-primary hover:opacity-90 shrink-0"
            >
              <Link to="/chat" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Ask AI Assistant
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {quickStats.map((stat, index) => (
          <Card key={stat.title} className="bg-gradient-card border-border/50 shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                  <div className="p-1.5 rounded-full bg-primary/10">
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Weather Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-primary border-border/50 shadow-card text-primary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudSun className="h-5 w-5" />
                {t('dashboard.weather')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{weather?.temperature ?? 28}°C</div>
                <p className="text-primary-foreground/80 mb-4">{weather?.conditions ?? 'Partly Cloudy'}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-primary-foreground/60">Humidity</p>
                    <p className="font-semibold">{weather?.humidity ?? 75}%</p>
                  </div>
                  <div>
                    <p className="text-primary-foreground/60">Rainfall</p>
                    <p className="font-semibold">{weather?.rainfall ?? 15}mm</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-accent" />
                Upcoming Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                  <div className={`w-3 h-3 rounded-full mt-1.5 ${
                    task.priority === 'high' ? 'bg-destructive' :
                    task.priority === 'medium' ? 'bg-accent' : 'bg-muted-foreground'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{task.task}</p>
                    <p className="text-xs text-muted-foreground">{task.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Sprout, label: 'Add Crop', href: '/crops' },
                { icon: Users, label: 'Community', href: '/community' },
                { icon: MessageCircle, label: 'Chat with AI', href: '/chat' },
                { icon: CloudSun, label: 'Check Weather', href: '/weather' },
                { icon: Users, label: 'NGOs', href: '/ngo' },
                { icon: Sprout, label: 'Go Green', href: '/go-green' },
                { icon: Calendar, label: 'News & Events', href: '/news-events' },
                { icon: TrendingUp, label: 'Market Prices', href: '/market' },
              ].map((action, index) => (
                <Button
                  key={action.label}
                  asChild
                  variant="outline"
                  className="h-16 flex-col gap-2 border-border/50 hover:bg-primary/10 hover:border-primary/30"
                >
                  <Link to={action.href}>
                    <action.icon className="h-5 w-5" />
                    <span className="text-xs">{action.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;