import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, Cloud, TrendingUp, Users, Leaf, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import heroImage from '@/assets/kerala-farming-hero.jpg';

const Index = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Bot,
      title: 'AI Assistant',
      description: 'Get instant farming advice powered by artificial intelligence',
      color: 'text-primary'
    },
    {
      icon: Cloud,
      title: 'Weather Insights', 
      description: 'Real-time weather updates and forecasts for better planning',
      color: 'text-accent'
    },
    {
      icon: TrendingUp,
      title: 'Market Prices',
      description: 'Stay updated with current market prices and trends',
      color: 'text-earth'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with fellow farmers and share experiences',
      color: 'text-primary-glow'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/70 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        <div className="relative z-20 container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <Leaf className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-primary">
                  Kerala Krishi Sahayak
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  {t('hero.title')}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                {t('hero.subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <>
                    <Button 
                      asChild 
                      size="lg" 
                      className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium h-12 px-8"
                    >
                      <Link to="/chat" className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Start Chatting
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button 
                      asChild 
                      variant="outline" 
                      size="lg"
                      className="h-12 px-8 border-primary/30 hover:bg-primary/10"
                    >
                      <Link to="/dashboard">
                        Go to Dashboard
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      className="h-12 px-8 bg-lime-500 hover:bg-lime-500/90 text-black font-semibold"
                    >
                      <Link to="/fundraiser" className="flex items-center gap-2">
                        Fundraiser
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      asChild 
                      size="lg" 
                      className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium h-12 px-8"
                    >
                      <Link to="/login" className="flex items-center gap-2">
                        {t('hero.cta')}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button 
                      asChild 
                      variant="outline" 
                      size="lg"
                      className="h-12 px-8 border-primary/30 hover:bg-primary/10"
                    >
                      <Link to="/login">
                        {t('hero.login')}
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      className="h-12 px-8 bg-lime-500 hover:bg-lime-500/90 text-black font-semibold"
                    >
                      <Link to="/fundraiser" className="flex items-center gap-2">
                        Fundraiser
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Empowering Kerala Farmers
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Modern technology meets traditional farming wisdom to help you grow better crops
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-gradient-card border-border/50 shadow-card hover:shadow-floating transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-primary/10 group-hover:bg-gradient-primary/20 transition-colors">
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section for logged-out users */}
      {!isAuthenticated && (
        <section className="py-20 bg-background/60">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold text-center mb-8">What Farmers Say</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[{
                  name: 'Raman (Kottayam)',
                  quote: 'AI assistant helped me plan irrigation and saved water by 30%.',
                },{
                  name: 'Lakshmi (Thrissur)',
                  quote: 'Market prices widget helps me decide the best time to sell.',
                },{
                  name: 'Priya (Kozhikode)',
                  quote: 'Weather alerts warned me ahead of heavy rain. Saved my seedlings!',
                }].map((r) => (
                  <Card key={r.name} className="bg-gradient-card border-border/50 shadow-card">
                    <CardContent className="p-6">
                      <p className="text-muted-foreground mb-4">“{r.quote}”</p>
                      <div className="font-semibold">{r.name}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Transform Your Farming?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of Kerala farmers who are already using AI to improve their harvest
            </p>
            <Button 
              asChild 
              size="lg" 
              variant="secondary"
              className="h-12 px-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <Link to={isAuthenticated ? "/chat" : "/login"} className="flex items-center gap-2">
                Get Started Today
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
