import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Recycle, Droplets, Sun, Bug, Flower2, Wind, Factory } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const GoGreen: React.FC = () => {
  const { t } = useLanguage();
  
  const animals = [
    { 
      titleKey: 'gogreen.honeybees.title',
      descKey: 'gogreen.honeybees.desc',
      benefitsKey: 'gogreen.honeybees.benefits',
      accessKey: 'gogreen.honeybees.access',
      img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=60',
      icon: '🐝'
    },
    { 
      titleKey: 'gogreen.ladybugs.title',
      descKey: 'gogreen.ladybugs.desc',
      benefitsKey: 'gogreen.ladybugs.benefits',
      accessKey: 'gogreen.ladybugs.access',
      img: 'https://images.unsplash.com/photo-1465146633011-14f8e0781093?auto=format&fit=crop&w=1200&q=60',
      icon: '🐞'
    },
    { 
      titleKey: 'gogreen.earthworms.title',
      descKey: 'gogreen.earthworms.desc',
      benefitsKey: 'gogreen.earthworms.benefits',
      accessKey: 'gogreen.earthworms.access',
      img: 'https://images.unsplash.com/photo-1585238341800-1c69f88b0f72?auto=format&fit=crop&w=1200&q=60',
      icon: '🪱'
    },
  ];
  const plants = [
    { 
      titleKey: 'gogreen.neem.title',
      descKey: 'gogreen.neem.desc',
      benefitsKey: 'gogreen.neem.benefits',
      accessKey: 'gogreen.neem.access',
      img: 'https://images.unsplash.com/photo-1591522814312-ea52f54d29c8?auto=format&fit=crop&w=1200&q=60',
      icon: '🌿'
    },
    { 
      titleKey: 'gogreen.chilliGarlic.title',
      descKey: 'gogreen.chilliGarlic.desc',
      benefitsKey: 'gogreen.chilliGarlic.benefits',
      accessKey: 'gogreen.chilliGarlic.access',
      img: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?auto=format&fit=crop&w=1200&q=60',
      icon: '🌶️'
    },
    { 
      titleKey: 'gogreen.marigold.title',
      descKey: 'gogreen.marigold.desc',
      benefitsKey: 'gogreen.marigold.benefits',
      accessKey: 'gogreen.marigold.access',
      img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=60',
      icon: '🌻'
    },
  ];
  const tech = [
    { 
      titleKey: 'gogreen.solarPower.title',
      descKey: 'gogreen.solarPower.desc',
      benefitsKey: 'gogreen.solarPower.benefits',
      accessKey: 'gogreen.solarPower.access',
      img: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=60',
      icon: Sun,
      emoji: '☀️'
    },
    { 
      titleKey: 'gogreen.windPower.title',
      descKey: 'gogreen.windPower.desc',
      benefitsKey: 'gogreen.windPower.benefits',
      accessKey: 'gogreen.windPower.access',
      img: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=60',
      icon: Wind,
      emoji: '💨'
    },
    { 
      titleKey: 'gogreen.waterTreatment.title',
      descKey: 'gogreen.waterTreatment.desc',
      benefitsKey: 'gogreen.waterTreatment.benefits',
      accessKey: 'gogreen.waterTreatment.access',
      img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=1200&q=60',
      icon: Factory,
      emoji: '💧'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-5xl mx-auto pt-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" /> {t('gogreen.title')}
            </h1>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><Bug className="h-5 w-5 text-primary" /> {t('gogreen.helpfulAnimals')}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {animals.map((a, index) => (
                  <motion.div
                    key={a.titleKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group"
                  >
                    <Card className="bg-gradient-card border-border/50 shadow-card overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:border-primary/30 h-full">
                      <div className="relative overflow-hidden">
                        <img
                          src={a.img}
                          alt={t(a.titleKey)}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1465146633011-14f8e0781093?auto=format&fit=crop&w=1200&q=60'; }}
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 text-2xl">
                          {a.icon}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg group-hover:text-primary transition-colors duration-300">
                          <Flower2 className="h-5 w-5 text-primary" /> {t(a.titleKey)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-muted-foreground text-sm leading-relaxed">{t(a.descKey)}</p>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-foreground flex items-center gap-1">
                            <span className="text-primary">✓</span> {t('gogreen.benefits')}:
                          </h4>
                          <div className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                            {t(a.benefitsKey)}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-foreground flex items-center gap-1">
                            <span className="text-primary">📍</span> {t('gogreen.whereToAccess')}:
                          </h4>
                          <div className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                            {t(a.accessKey)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><Recycle className="h-5 w-5 text-primary" /> {t('gogreen.beneficialPlants')}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {plants.map((p, index) => (
                  <motion.div
                    key={p.titleKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index + 3) * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group"
                  >
                    <Card className="bg-gradient-card border-border/50 shadow-card overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:border-primary/30 h-full">
                      <div className="relative overflow-hidden">
                        <img
                          src={p.img}
                          alt={t(p.titleKey)}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            const fallback = p.titleKey === 'gogreen.neem.title'
                              ? 'https://images.unsplash.com/photo-1591522814312-ea52f54d29c8?auto=format&fit=crop&w=1200&q=60'
                              : p.titleKey === 'gogreen.marigold.title'
                              ? 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=60'
                              : 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?auto=format&fit=crop&w=1200&q=60';
                            (e.currentTarget as HTMLImageElement).src = fallback;
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 text-2xl">
                          {p.icon}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg group-hover:text-primary transition-colors duration-300">
                          <Flower2 className="h-5 w-5 text-primary" /> {t(p.titleKey)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-muted-foreground text-sm leading-relaxed">{t(p.descKey)}</p>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-foreground flex items-center gap-1">
                            <span className="text-primary">✓</span> {t('gogreen.benefits')}:
                          </h4>
                          <div className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                            {t(p.benefitsKey)}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-foreground flex items-center gap-1">
                            <span className="text-primary">📍</span> {t('gogreen.whereToAccess')}:
                          </h4>
                          <div className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                            {t(p.accessKey)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><Sun className="h-5 w-5 text-primary" /> {t('gogreen.greenTechnology')}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {tech.map((techItem, index) => (
                  <motion.div
                    key={techItem.titleKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index + 6) * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group"
                  >
                    <Card className="bg-gradient-card border-border/50 shadow-card overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:border-primary/30 h-full">
                      <div className="relative overflow-hidden">
                        <img
                          src={techItem.img}
                          alt={t(techItem.titleKey)}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            const fallback = techItem.titleKey === 'gogreen.solarPower.title'
                              ? 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=60'
                              : techItem.titleKey === 'gogreen.windPower.title'
                              ? 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=60'
                              : 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=1200&q=60';
                            (e.currentTarget as HTMLImageElement).src = fallback;
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 text-2xl">
                          {techItem.emoji}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg group-hover:text-primary transition-colors duration-300">
                          <techItem.icon className="h-5 w-5 text-primary" /> {t(techItem.titleKey)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-muted-foreground text-sm leading-relaxed">{t(techItem.descKey)}</p>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-foreground flex items-center gap-1">
                            <span className="text-primary">✓</span> {t('gogreen.benefits')}:
                          </h4>
                          <div className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                            {t(techItem.benefitsKey)}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-foreground flex items-center gap-1">
                            <span className="text-primary">📍</span> {t('gogreen.whereToAccess')}:
                          </h4>
                          <div className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                            {t(techItem.accessKey)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GoGreen;


