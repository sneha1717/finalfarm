import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Newspaper, Search, Landmark } from 'lucide-react';
import marketBg from '@/assets/istockphoto-187251869-612x612.jpg';

const NewsEvents: React.FC = () => {
  const news = [
    { title: 'Kerala announces subsidy for drip irrigation', date: 'Sep 10, 2025', img: 'https://images.pexels.com/photos/296230/pexels-photo-296230.jpeg' },
    { title: 'New disease-resistant paddy variety released', date: 'Sep 5, 2025', img: 'https://images.pexels.com/photos/1462012/pexels-photo-1462012.jpeg' },
  ];
  const events = [
    { title: 'Krishi Mela - Kochi', date: 'Oct 15, 2025', img: 'https://images.pexels.com/photos/302347/pexels-photo-302347.jpeg' },
    { title: 'Organic Farming Workshop - Thrissur', date: 'Oct 28, 2025', img: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg' },
  ];
  const schemes = [
    { title: 'PM-Kisan Samman Nidhi - Installment Released', date: 'Sep 1, 2025' },
    { title: 'Sub-Mission on Agricultural Mechanization (SMAM)', date: 'Aug 20, 2025' },
  ];

  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return {
      news: news.filter(n => n.title.toLowerCase().includes(q)),
      events: events.filter(e => e.title.toLowerCase().includes(q)),
      schemes: schemes.filter(s => s.title.toLowerCase().includes(q)),
    };
  }, [query]);

  return (
    <div className="min-h-screen p-0">
      <div
        className="w-full h-44 md:h-56 relative flex items-end"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.5) 100%), url(${marketBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-5xl mx-auto w-full px-4 pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">News & Events</h1>
          <p className="text-white/90 text-sm">Government schemes, fairs and updates</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto pt-6 px-4 pb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                className="pl-10 pr-3 py-2 w-full rounded-md border border-border bg-background text-foreground"
                placeholder="Search news, events, schemes"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Newspaper className="h-5 w-5 text-primary" /> Latest News
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {filtered.news.map(n => (
                  <div key={n.title} className="p-0 rounded-md overflow-hidden border border-border">
                    <img src={n.img} alt="news" className="w-full h-28 object-cover" />
                    <div className="p-3">
                      <div className="text-foreground font-medium">{n.title}</div>
                      <div className="text-xs">{n.date}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" /> Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {filtered.events.map(e => (
                  <div key={e.title} className="p-0 rounded-md overflow-hidden border border-border">
                    <img src={e.img} alt="event" className="w-full h-28 object-cover" />
                    <div className="p-3">
                      <div className="text-foreground font-medium">{e.title}</div>
                      <div className="text-xs">{e.date}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-primary" /> Government Schemes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {filtered.schemes.map(s => (
                  <div key={s.title} className="p-3 rounded-md bg-background/50">
                    <div className="text-foreground font-medium">{s.title}</div>
                    <div className="text-xs">{s.date}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NewsEvents;


