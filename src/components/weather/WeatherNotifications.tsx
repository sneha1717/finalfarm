import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  AlertTriangle, 
  Cloud, 
  CloudRain, 
  Sun, 
  Wind, 
  Thermometer,
  Shield,
  X,
  Bell,
  ExternalLink
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WeatherAlert {
  id: string;
  type: 'rain' | 'heat' | 'wind' | 'disaster';
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  advice: string[];
  icon: React.ReactNode;
  timestamp: Date;
  expires: Date;
}

interface WeatherNotificationsProps {
  onClose?: () => void;
}

const WeatherNotifications: React.FC<WeatherNotificationsProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Mock weather alerts - replace with real API data
    const mockAlerts: WeatherAlert[] = [
      {
        id: '1',
        type: 'rain',
        severity: 'high',
        title: 'Heavy Rain Expected Tomorrow',
        message: 'Monsoon showers expected with 80mm rainfall predicted',
        advice: [
          'Cover young plants with plastic sheets',
          'Ensure proper drainage in rice fields',
          'Harvest ripe vegetables before rain starts',
          'Check irrigation channels for blockages'
        ],
        icon: <CloudRain className="h-5 w-5" />,
        timestamp: new Date(),
        expires: new Date(Date.now() + 48 * 60 * 60 * 1000)
      },
      {
        id: '2',
        type: 'heat',
        severity: 'medium',
        title: 'High Temperature Alert',
        message: 'Temperature may reach 38°C in next 3 days',
        advice: [
          'Increase watering frequency for all crops',
          'Provide shade nets for sensitive plants',
          'Avoid working during peak sun hours (11 AM - 3 PM)',
          'Apply mulch to retain soil moisture'
        ],
        icon: <Thermometer className="h-5 w-5" />,
        timestamp: new Date(),
        expires: new Date(Date.now() + 72 * 60 * 60 * 1000)
      },
      {
        id: '3',
        type: 'disaster',
        severity: 'high',
        title: 'Cyclone Warning - Bay of Bengal',
        message: 'Cyclonic storm developing, may affect Kerala coast in 5 days',
        advice: [
          'Secure greenhouse structures and equipment',
          'Harvest all mature crops immediately',
          'Store seeds and fertilizers in safe, dry places',
          'Prepare emergency drainage systems',
          'Contact local agricultural officer for assistance'
        ],
        icon: <Wind className="h-5 w-5" />,
        timestamp: new Date(),
        expires: new Date(Date.now() + 120 * 60 * 60 * 1000)
      }
    ];

    setAlerts(mockAlerts);
    
    // Show popup for high severity alerts
    const hasHighSeverity = mockAlerts.some(alert => alert.severity === 'high');
    if (hasHighSeverity) {
      setShowPopup(true);
    }
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-accent/10 text-accent border-accent/20';
      case 'low': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'rain': return <CloudRain className="h-5 w-5" />;
      case 'heat': return <Sun className="h-5 w-5" />;
      case 'wind': return <Wind className="h-5 w-5" />;
      case 'disaster': return <AlertTriangle className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const highSeverityAlerts = alerts.filter(alert => alert.severity === 'high');

  return (
    <>
      {/* Notification Popup for High Severity Alerts */}
      <AnimatePresence>
        {showPopup && highSeverityAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-card rounded-xl shadow-elegant border border-border max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-destructive/10 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Weather Alert!</h3>
                      <p className="text-sm text-muted-foreground">Important farming advisory</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowPopup(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {highSeverityAlerts.slice(0, 2).map((alert) => (
                    <Alert key={alert.id} className="border-destructive/20 bg-destructive/5">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <AlertTitle className="text-destructive">{alert.title}</AlertTitle>
                      <AlertDescription className="text-foreground">
                        {alert.message}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowPopup(false)}
                  >
                    {t('common.gotIt')}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowPopup(false);
                      onClose?.();
                      navigate('/notifications');
                    }}
                    className="bg-gradient-primary text-primary-foreground"
                  >
                    {t('notifications.viewDetails')}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Panel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Weather Alerts & Farming Advice
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {alerts.length} active alerts
            </Badge>
            {alerts.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/notifications')}
                className="gap-1 text-xs"
              >
                <ExternalLink className="h-3 w-3" />
                {t('notifications.viewDetails')}
              </Button>
            )}
          </div>
        </div>

        {alerts.length === 0 ? (
          <Card className="bg-gradient-card border-border">
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">All Clear!</h4>
              <p className="text-muted-foreground text-sm">No weather alerts at this time. Keep farming safely!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-gradient-card border ${
                  alert.severity === 'high' ? 'border-destructive/30' : 
                  alert.severity === 'medium' ? 'border-accent/30' : 'border-primary/30'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          alert.severity === 'high' ? 'bg-destructive/10' :
                          alert.severity === 'medium' ? 'bg-accent/10' : 'bg-primary/10'
                        }`}>
                          {getAlertIcon(alert.type)}
                        </div>
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            {alert.title}
                            <Badge className={getSeverityColor(alert.severity)} variant="outline">
                              {alert.severity}
                            </Badge>
                          </CardTitle>
                          <CardDescription>{alert.message}</CardDescription>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => dismissAlert(alert.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        Recommended Actions:
                      </h5>
                      <ul className="space-y-1">
                        {alert.advice.map((tip, tipIndex) => (
                          <li key={tipIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-3 text-xs text-muted-foreground">
                      Alert expires: {alert.expires.toLocaleDateString()} at {alert.expires.toLocaleTimeString()}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default WeatherNotifications;