import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeartHandshake, ExternalLink, Star, Plus, LogIn } from 'lucide-react';
import headerBg from '@/assets/istockphoto-187251869-612x612.jpg';

// Import local NGO logos
import thanalLogo from '/thanal.png';
import kifaLogo from '/kifa.png';
import keffLogo from '/keff.avif';
import sfacLogo from '/sfac.jpg';
import wsssLogo from '/wsss.png';
import jaivagramamLogo from '/jaivagramam.jpg';
import kudumbashreeLogo from '/kudumbashree.jpg';

const NGO: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');

  const [items, setItems] = useState([
    {
      name: 'Thanal Trust',
      url: 'https://thanaltrust.org/',
      focus: 'Promotes sustainable farming practices, biodiversity conservation, and organic certification through PGS. Operates in Thiruvananthapuram, Wayanad, and Palakkad.',
      img: thanalLogo,
      rating: 4.8,
      region: 'Kerala',
    },
    {
      name: 'Kerala Independent Farmers Association (KIFA)',
      url: 'https://kifa.co.in/',
      focus: 'Advocates for farmers\' rights, sustainable agriculture, and policy reforms. Empowers marginalized farming communities.',
      img: kifaLogo,
      rating: 4.7,
      region: 'Kerala',
    },
    {
      name: 'Kerala Farmers Federation (KeFF)',
      url: 'https://keralafarmersfederation.org/',
      focus: 'Represents over 670,000 farmers, promotes sustainable farming, and advocates for farmers\' rights.',
      img: keffLogo,
      rating: 4.6,
      region: 'Kerala',
    },
    {
      name: 'Small Farmers Agri-business Consortium (SFAC) Kerala',
      url: 'https://www.sfackerala.org/',
      focus: 'Supports agribusiness startups and farmer entrepreneurs with training, market access, and financial assistance.',
      img: sfacLogo,
      rating: 4.5,
      region: 'Kerala',
    },
    {
      name: 'Wayanad Social Service Society (WSSS)',
      url: 'https://wsssindia.in/',
      focus: 'Promotes organic agriculture, offers certification programs, and enhances farmers\' income.',
      img: wsssLogo,
      rating: 4.6,
      region: 'Kerala',
    },
    {
      name: 'Jaivagramam Project',
      url: 'https://www.jaivagramam.org/',
      focus: 'Focuses on sustainable farming and community development through collaboration of over 170 NGOs.',
      img: jaivagramamLogo,
      rating: 4.5,
      region: 'Kerala',
    },
    {
      name: 'Kudumbashree Farmer\'s Collective',
      url: 'https://www.kudumbashree.org/',
      focus: 'Empowers women farmers through regenerative farming techniques and training in sustainable agricultural practices.',
      img: kudumbashreeLogo,
      rating: 4.7,
      region: 'Kerala',
    },
  ]);

  const [activity] = useState([
    { text: 'Conducted vermicompost training at Thrissur', when: 'Today' },
    { text: 'Distributed drip kits to 25 farmers in Kochi', when: 'Yesterday' },
    { text: 'Launched pollinator garden program', when: '2 days ago' },
  ]);

  const filtered = useMemo(() => items.filter(n => filter === 'all' ? true : n.region === filter), [items, filter]);

  const addNGO = () => {
    const name = prompt('NGO Name');
    if (!name) return;
    const url = prompt('Website URL (https://...)') || '#';
    const focus = prompt('Focus / About') || '';
    const img = prompt('Image URL') || 'https://images.pexels.com/photos/296230/pexels-photo-296230.jpeg';
    setItems(prev => [{ name, url, focus, img, rating: 4.0, region: 'Kerala' }, ...prev]);
  };

  return (
    <div className="min-h-screen p-0">
      <div
        className="w-full h-44 md:h-56 relative flex items-end"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.5) 100%), url(${headerBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-5xl mx-auto w-full px-4 pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <HeartHandshake className="h-6 w-6" /> NGOs for Farmers
          </h1>
          <p className="text-white/90 text-sm">Find, rate, and connect with agriculture NGOs</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto pt-6 px-4 pb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-9 px-3 rounded-md bg-background border border-border text-sm">
                <option value="all">All regions</option>
                <option value="Kerala">Kerala</option>
                <option value="National">National</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild className="gap-2">
                <a href="/ngo-login"><LogIn className="h-4 w-4" /> Login as NGO</a>
              </Button>
              <Button onClick={addNGO} className="gap-2"><Plus className="h-4 w-4" /> Add your NGO</Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((n) => (
              <Card key={n.name} className="bg-gradient-card border-border/50 shadow-card h-full">
                <CardHeader>
                  <CardTitle>{n.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm space-y-3">
                  <div className="flex gap-3">
                    {/* Uniform logo size using local images */}
                    <img
                      src={n.img}
                      alt={n.name}
                      className="w-28 h-28 object-contain rounded-md border border-border"
                    />
                    <div className="flex-1">
                      <div className="text-foreground mb-1">{n.focus}</div>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.round(n.rating) ? 'fill-amber-400' : ''}`} />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">{n.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="gap-2">
                    <a href={n.url} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" /> Visit
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Activity Log */}
          <div className="mt-8">
            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {activity.map((a, idx) => (
                  <div key={idx} className="p-3 rounded-md bg-background/60 border border-border flex items-center justify-between">
                    <span className="text-foreground">{a.text}</span>
                    <span className="text-muted-foreground text-xs">{a.when}</span>
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

export default NGO;
