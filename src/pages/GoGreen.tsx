import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Recycle, Droplets, Sun, Bug, Flower2, Wind, Factory } from 'lucide-react';

const GoGreen: React.FC = () => {
  const animals = [
    { title: 'Honeybees', desc: 'Pollination champions; improve fruit set and yields.', img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=60' },
    { title: 'Ladybugs', desc: 'Natural predators of aphids and soft-bodied pests.', img: 'https://images.unsplash.com/photo-1465146633011-14f8e0781093?auto=format&fit=crop&w=1200&q=60' },
    { title: 'Earthworms', desc: 'Enhance soil aeration and nutrient cycling.', img: 'https://images.unsplash.com/photo-1585238341800-1c69f88b0f72?auto=format&fit=crop&w=1200&q=60' },
  ];
  const plants = [
    { title: 'Neem', desc: 'Neem oil/NSKE as botanical insecticide.', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=60' },
    { title: 'Chilli-Garlic', desc: 'Homemade chilli-garlic extract for sucking pests.', img: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?auto=format&fit=crop&w=1200&q=60' },
    { title: 'Marigold', desc: 'Trap crop; reduces nematodes and pests.', img: 'https://images.unsplash.com/photo-1501769214405-5e5ee5125a02?auto=format&fit=crop&w=1200&q=60' },
  ];
  const tech = [
    { title: 'Solar Power', desc: 'Solar pumps and rooftop panels for farms.', img: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=60', icon: Sun },
    { title: 'Wind Power', desc: 'Small wind turbines for off-grid power.', img: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=1200&q=60', icon: Wind },
    { title: 'Water Treatment', desc: 'Low-cost filtration and bio-sand filters.', img: 'https://images.unsplash.com/photo-1565354899597-61a962a6a7a7?auto=format&fit=crop&w=1200&q=60', icon: Factory },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-5xl mx-auto pt-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" /> Go Green
            </h1>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><Bug className="h-5 w-5 text-primary" /> Helpful Animals</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {animals.map(a => (
                  <Card key={a.title} className="bg-gradient-card border-border/50 shadow-card overflow-hidden">
                    <img
                      src={a.img}
                      alt={a.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-44 object-cover"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1465146633011-14f8e0781093?auto=format&fit=crop&w=1200&q=60'; }}
                    />
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Flower2 className="h-5 w-5 text-primary" /> {a.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm">{a.desc}</CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><Recycle className="h-5 w-5 text-primary" /> Beneficial Plants</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {plants.map(p => (
                  <Card key={p.title} className="bg-gradient-card border-border/50 shadow-card overflow-hidden">
                    <img
                      src={p.img}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-44 object-cover"
                      onError={(e) => {
                        const fallback = p.title === 'Neem'
                          ? 'https://images.unsplash.com/photo-1591522814312-ea52f54d29c8?auto=format&fit=crop&w=1200&q=60'
                          : p.title === 'Marigold'
                          ? 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=60'
                          : 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?auto=format&fit=crop&w=1200&q=60';
                        (e.currentTarget as HTMLImageElement).src = fallback;
                      }}
                    />
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Flower2 className="h-5 w-5 text-primary" /> {p.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm">{p.desc}</CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><Sun className="h-5 w-5 text-primary" /> Green Technology</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {tech.map(t => (
                  <Card key={t.title} className="bg-gradient-card border-border/50 shadow-card overflow-hidden">
                    <img
                      src={t.img}
                      alt={t.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-44 object-cover"
                      onError={(e) => {
                        const fallback = 'https://images.unsplash.com/photo-1607706009771-c5a869d7a6a5?auto=format&fit=crop&w=1200&q=60';
                        (e.currentTarget as HTMLImageElement).src = fallback;
                      }}
                    />
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><t.icon className="h-5 w-5 text-primary" /> {t.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm">{t.desc}</CardContent>
                  </Card>
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


