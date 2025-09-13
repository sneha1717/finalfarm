import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { RefreshCw, Thermometer, Droplets, Wind, Eye, MapPin, AlertTriangle } from 'lucide-react';
import { WeatherData } from '@/types';

const Weather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [locationQuery, setLocationQuery] = useState<string>('Kerala, India');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const { language } = useLanguage();
  const { toast } = useToast();

  const apiKey = "0cef8c8542dc9d171659bb22a8c680a3";

  // Mock weather data as fallback
  const mockWeatherData: WeatherData = {
    temperature: 28,
    humidity: 85,
    rainfall: 12,
    conditions: 'Partly Cloudy',
    windSpeed: 15,
    visibility: 8,
    location: 'Kochi, Kerala',
    forecast: [
      { day: 'Today', high: 30, low: 24, conditions: 'Partly Cloudy', icon: '⛅' },
      { day: 'Tomorrow', high: 32, low: 25, conditions: 'Sunny', icon: '☀️' },
      { day: 'Saturday', high: 28, low: 22, conditions: 'Rainy', icon: '🌧️' },
      { day: 'Sunday', high: 29, low: 23, conditions: 'Cloudy', icon: '☁️' },
      { day: 'Monday', high: 31, low: 24, conditions: 'Partly Cloudy', icon: '⛅' }
    ]
  };

  const translations = {
    en: {
      title: 'Weather Forecast',
      currentConditions: 'Current Conditions',
      forecast: '5-Day Forecast',
      temperature: 'Temperature',
      humidity: 'Humidity',
      rainfall: 'Rainfall',
      windSpeed: 'Wind Speed',
      visibility: 'Visibility',
      lastUpdated: 'Last Updated',
      refresh: 'Refresh',
      high: 'High',
      low: 'Low',
      weatherAlert: 'Weather Alert',
      severeWeatherWarning: 'Severe weather conditions detected in your area!'
    },
    ml: {
      title: 'കാലാവസ്ഥാ പ്രവചനം',
      currentConditions: 'നിലവിലെ അവസ്ഥ',
      forecast: '5 ദിവസത്തെ പ്രവചനം',
      temperature: 'താപനില',
      humidity: 'ആർദ്രത',
      rainfall: 'മഴ',
      windSpeed: 'കാറ്റിന്റെ വേഗത',
      visibility: 'ദൃശ്യത',
      lastUpdated: 'അവസാനം അപ്ഡേറ്റ് ചെയ്തത്',
      refresh: 'പുതുക്കുക',
      high: 'ഉയർന്നത്',
      low: 'താഴ്ന്നത്',
      weatherAlert: 'കാലാവസ്ഥാ മുന്നറിയിപ്പ്',
      severeWeatherWarning: 'നിങ്ങളുടെ പ്രദേശത്ത് കഠിനമായ കാലാവസ്ഥാ സാഹചര്യങ്ങൾ കണ്ടെത്തി!'
    },
    ta: {
      title: 'வானிலை முன்னறிவிப்பு',
      currentConditions: 'தற்போதைய நிலைமைகள்',
      forecast: '5 நாள் முன்னறிவிப்பு',
      temperature: 'வெப்பநிலை',
      humidity: 'ஈரப்பதம்',
      rainfall: 'மழை',
      windSpeed: 'காற்றின் வேகம்',
      visibility: 'பார்வை தூரம்',
      lastUpdated: 'கடைசியாக புதுப்பிக்கப்பட்டது',
      refresh: 'புதுப்பிக்கவும்',
      high: 'உயர்ந்த',
      low: 'குறைந்த',
      weatherAlert: 'வானிலை எச்சரிக்கை',
      severeWeatherWarning: 'உங்கள் பகுதியில் கடுமையான வானிலை நிலைமைகள் கண்டறியப்பட்டுள்ளன!'
    }
  };

  const t = translations[language];

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      // Prefer city/place query when available
      if (locationQuery && apiKey) {
        try {
          setIsSearching(true);
          // OpenWeather current weather API by q (city,country)
          const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(locationQuery)}&appid=${apiKey}&units=metric`);
          if (!resp.ok) throw new Error('Weather fetch failed');
          const data = await resp.json();

          const transformed: WeatherData = {
            temperature: Math.round(data.main?.temp ?? mockWeatherData.temperature),
            humidity: Math.round(data.main?.humidity ?? mockWeatherData.humidity),
            rainfall: mockWeatherData.rainfall,
            conditions: data.weather?.[0]?.description ? `${data.weather[0].description}` : mockWeatherData.conditions,
            windSpeed: Math.round(data.wind?.speed ?? mockWeatherData.windSpeed ?? 0),
            visibility: data.visibility ? Math.round(data.visibility / 1000) : mockWeatherData.visibility,
            location: `${data.name}, ${data.sys?.country || ''}`.trim(),
            forecast: mockWeatherData.forecast,
          };

          setWeather(transformed);
          setLastUpdated(new Date());
          checkSevereWeather(transformed);
          setLoading(false);
          setIsSearching(false);
          return;
        } catch (e) {
          console.error('Weather API failed, using mock data:', e);
          setIsSearching(false);
        }
      }

      // Fallback to mock data
      setWeather({ ...mockWeatherData, location: 'Kerala, India' });
      setLastUpdated(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Weather fetch failed:', error);
      setWeather(mockWeatherData);
      setLastUpdated(new Date());
      setLoading(false);
    }
  };

  const checkSevereWeather = (weatherData: WeatherData) => {
    // Check for severe weather conditions
    if (weatherData.temperature > 35 || weatherData.rainfall > 50) {
      toast({
        title: t.weatherAlert,
        description: t.severeWeatherWarning,
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    fetchWeatherData();
    toast({
      title: "Weather Updated",
      description: "Weather data has been refreshed",
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationQuery.trim()) return;
    fetchWeatherData();
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
        <div className="max-w-4xl mx-auto pt-20">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{t.title}</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {weather?.location}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
                <input
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Search city/place/country"
                  className="h-9 px-3 rounded-md bg-card border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button type="submit" variant="outline" size="sm" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  Go
                </Button>
              </form>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {isSearching ? '...' : t.refresh}
              </Button>
            </div>
          </div>

          {/* Current Weather */}
          <Card className="mb-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-primary" />
                {t.currentConditions}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {weather?.temperature}°C
                  </div>
                  <div className="text-sm text-muted-foreground">{t.temperature}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-1 flex items-center justify-center gap-1">
                    <Droplets className="h-6 w-6" />
                    {weather?.humidity}%
                  </div>
                  <div className="text-sm text-muted-foreground">{t.humidity}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {weather?.rainfall}mm
                  </div>
                  <div className="text-sm text-muted-foreground">{t.rainfall}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-1 flex items-center justify-center gap-1">
                    <Wind className="h-6 w-6" />
                    {weather?.windSpeed} km/h
                  </div>
                  <div className="text-sm text-muted-foreground">{t.windSpeed}</div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>{t.visibility}: {weather?.visibility} km</span>
                </div>
                <div className="text-muted-foreground text-sm">
                  {t.lastUpdated}: {lastUpdated.toLocaleTimeString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5-Day Forecast */}
          <Card>
            <CardHeader>
              <CardTitle>{t.forecast}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {weather?.forecast.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10"
                  >
                    <div className="font-semibold text-foreground mb-2">{day.day}</div>
                    <div className="text-4xl mb-2">{day.icon}</div>
                    <div className="text-sm text-muted-foreground mb-2">{day.conditions}</div>
                    <div className="flex justify-between text-sm">
                      <span className="text-red-600 font-semibold">{t.high} {day.high}°</span>
                      <span className="text-blue-600 font-semibold">{t.low} {day.low}°</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Weather;