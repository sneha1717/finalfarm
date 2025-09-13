import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Cloud, 
  CloudRain, 
  Sun, 
  Wind, 
  Thermometer,
  Shield,
  Clock,
  MapPin,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';

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
  location: string;
  affectedAreas: string[];
  additionalInfo?: string;
}

const NotificationDetails: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock weather alerts - replace with real API data
    const mockAlerts: WeatherAlert[] = [
      {
        id: '1',
        type: 'rain',
        severity: 'high',
        title: 'Heavy Rain Expected Tomorrow',
        message: 'Monsoon showers expected with 80mm rainfall predicted across Kerala. This could lead to flooding in low-lying areas and affect crop growth.',
        advice: [
          'Cover young plants with plastic sheets or temporary shelters',
          'Ensure proper drainage in rice fields and vegetable gardens',
          'Harvest ripe vegetables and fruits before rain starts',
          'Check irrigation channels for blockages and clear them',
          'Move livestock to higher ground if in flood-prone areas',
          'Store seeds and fertilizers in waterproof containers'
        ],
        icon: <CloudRain className="h-5 w-5" />,
        timestamp: new Date(),
        expires: new Date(Date.now() + 48 * 60 * 60 * 1000),
        location: 'Kerala, India',
        affectedAreas: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kannur'],
        additionalInfo: 'The Indian Meteorological Department has issued a red alert for heavy rainfall. Farmers are advised to take immediate precautions to protect their crops and livestock.'
      },
      {
        id: '2',
        type: 'heat',
        severity: 'medium',
        title: 'High Temperature Alert',
        message: 'Temperature may reach 38°C in next 3 days with high humidity levels. This heatwave could stress crops and livestock.',
        advice: [
          'Increase watering frequency for all crops, especially vegetables',
          'Provide shade nets or temporary covers for sensitive plants',
          'Avoid working during peak sun hours (11 AM - 3 PM)',
          'Apply mulch around plants to retain soil moisture',
          'Ensure adequate ventilation in greenhouses and livestock shelters',
          'Provide extra water and shade for livestock'
        ],
        icon: <Thermometer className="h-5 w-5" />,
        timestamp: new Date(),
        expires: new Date(Date.now() + 72 * 60 * 60 * 1000),
        location: 'Kerala, India',
        affectedAreas: ['Palakkad', 'Kozhikode', 'Kannur', 'Kasaragod'],
        additionalInfo: 'Heat index values may reach dangerous levels. Take extra precautions for outdoor work and ensure proper hydration.'
      },
      {
        id: '3',
        type: 'disaster',
        severity: 'high',
        title: 'Cyclone Warning - Bay of Bengal',
        message: 'Cyclonic storm developing in Bay of Bengal, may affect Kerala coast in 5 days. Expected wind speeds of 60-80 km/h with heavy rainfall.',
        advice: [
          'Secure greenhouse structures and agricultural equipment',
          'Harvest all mature crops immediately to prevent losses',
          'Store seeds, fertilizers, and tools in safe, dry places',
          'Prepare emergency drainage systems for excess water',
          'Contact local agricultural officer for assistance and updates',
          'Prepare emergency supplies for livestock and family',
          'Trim tree branches that could fall on crops or structures'
        ],
        icon: <Wind className="h-5 w-5" />,
        timestamp: new Date(),
        expires: new Date(Date.now() + 120 * 60 * 60 * 1000),
        location: 'Kerala Coast, India',
        affectedAreas: ['Thiruvananthapuram', 'Kollam', 'Alappuzha', 'Kochi', 'Thrissur'],
        additionalInfo: 'The cyclone is expected to make landfall with severe impact. All farmers in coastal areas should prepare for evacuation if necessary.'
      }
    ];

    // Simulate loading
    setTimeout(() => {
      setAlerts(mockAlerts);
      setLoading(false);
    }, 1000);
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
      case 'rain': return <CloudRain className="h-6 w-6" />;
      case 'heat': return <Sun className="h-6 w-6" />;
      case 'wind': return <Wind className="h-6 w-6" />;
      case 'disaster': return <AlertTriangle className="h-6 w-6" />;
      default: return <Bell className="h-6 w-6" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
        <div className="max-w-4xl mx-auto pt-20">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-4xl mx-auto pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('notifications.backToHome')}
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t('notifications.title')}</h1>
              <p className="text-muted-foreground">{t('notifications.activeAlerts')}</p>
            </div>
          </div>

          {alerts.length === 0 ? (
            <Card className="bg-gradient-card border-border">
              <CardContent className="p-12 text-center">
                <div className="p-4 bg-primary/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{t('notifications.allClear')}</h3>
                <p className="text-muted-foreground">{t('notifications.noAlerts')}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className={`bg-gradient-card border ${
                    alert.severity === 'high' ? 'border-destructive/30' : 
                    alert.severity === 'medium' ? 'border-accent/30' : 'border-primary/30'
                  }`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg ${
                            alert.severity === 'high' ? 'bg-destructive/10' :
                            alert.severity === 'medium' ? 'bg-accent/10' : 'bg-primary/10'
                          }`}>
                            {getAlertIcon(alert.type)}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-xl flex items-center gap-3 mb-2">
                              {alert.title}
                              <Badge className={getSeverityColor(alert.severity)} variant="outline">
                                {alert.severity}
                              </Badge>
                            </CardTitle>
                            <CardDescription className="text-base mb-3">
                              {alert.message}
                            </CardDescription>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {t('notifications.issued')}: {alert.timestamp.toLocaleString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {alert.location}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {/* Affected Areas */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          {t('notifications.affectedAreas')}:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {alert.affectedAreas.map((area, areaIndex) => (
                            <Badge key={areaIndex} variant="secondary" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Recommended Actions */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          {t('notifications.recommendedActions')}:
                        </h4>
                        <div className="bg-muted/30 rounded-lg p-4">
                          <ul className="space-y-2">
                            {alert.advice.map((tip, tipIndex) => (
                              <li key={tipIndex} className="text-sm text-foreground flex items-start gap-3">
                                <span className="text-primary mt-1 font-bold">{tipIndex + 1}.</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Additional Information */}
                      {alert.additionalInfo && (
                        <Alert className="border-primary/20 bg-primary/5">
                          <AlertTriangle className="h-4 w-4 text-primary" />
                          <AlertTitle className="text-primary">{t('notifications.additionalInfo')}</AlertTitle>
                          <AlertDescription className="text-foreground">
                            {alert.additionalInfo}
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Expiry Information */}
                      <div className="text-sm text-muted-foreground border-t pt-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {t('notifications.expires')}: {alert.expires.toLocaleString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationDetails;
