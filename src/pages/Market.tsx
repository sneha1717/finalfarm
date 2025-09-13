import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import marketBg from '@/assets/istockphoto-187251869-612x612.jpg';
import {
  TrendingUp,
  IndianRupee,
  Store,
  Tractor,
  Beaker,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Notes about images:
 * - For convenience I used Unsplash's keyword endpoints which return a real photo for the keyword:
 *   https://source.unsplash.com/800x600/?<keyword>
 * - You can replace these URLs with local assets or hosted images if you prefer stable images.
 */

export interface MarketPricePoint {
  market: string;
  price: number;     // current price in INR (or specified currency)
  changePercent: number; // percent change relative to previous period (e.g. +2.5)
}

export interface MarketItem {
  id: string; // unique
  name: string; // crop or machinery/chemical name
  unit: string;
  image: string; // url
  description: string;
  points: MarketPricePoint[]; // prices across various marketplaces
  tag?: string; // optional tag like 'crop'|'machinery'|'chemical'
}

const Market: React.FC = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('');
  // top-level arrays
  const [crops, setCrops] = useState<MarketItem[]>([]);
  const [machinery, setMachinery] = useState<MarketItem[]>([]);
  const [chemicals, setChemicals] = useState<MarketItem[]>([]);

  useEffect(() => {
    // Using Unsplash keyword endpoints to provide real photos
    const cropsData: MarketItem[] = [
      {
        id: 'coconut',
        name: 'Coconut',
        unit: 'per piece',
        image: 'https://source.unsplash.com/800x600/?coconut',
        description: 'Fresh mature coconuts — used for oil, water, and coir.',
        tag: 'crop',
        points: [
          { market: 'Kochi', price: 36, changePercent: 2.1 },
          { market: 'Alappuzha', price: 34, changePercent: -1.5 },
          { market: 'Kannur', price: 38, changePercent: +0.5 },
        ],
      },
      {
        id: 'rice',
        name: 'Rice (Paddy)',
        unit: 'per kg',
        image: 'https://source.unsplash.com/800x600/?rice-field',
        description: 'Locally milled paddy — suitable for local consumption and milling.',
        tag: 'crop',
        points: [
          { market: 'Thrissur', price: 24, changePercent: -0.5 },
          { market: 'Palakkad', price: 25, changePercent: +0.8 },
          { market: 'Kollam', price: 23.5, changePercent: -1.2 },
        ],
      },
      {
        id: 'pepper',
        name: 'Pepper',
        unit: 'per kg',
        image: 'https://source.unsplash.com/800x600/?pepper-spice',
        description: 'Premium black pepper from traditional plantations.',
        tag: 'crop',
        points: [
          { market: 'Kozhikode', price: 520, changePercent: 1.2 },
          { market: 'Wayanad', price: 535, changePercent: 2.5 },
          { market: 'Ernakulam', price: 510, changePercent: -0.9 },
        ],
      },
      {
        id: 'banana',
        name: 'Banana (Nendran)',
        unit: 'per kg',
        image: 'https://source.unsplash.com/800x600/?banana',
        description: 'Nendran variety — ideal for cooking and chips.',
        tag: 'crop',
        points: [
          { market: 'Thiruvananthapuram', price: 68, changePercent: 0.9 },
          { market: 'Kottayam', price: 64, changePercent: -1.0 },
          { market: 'Alappuzha', price: 70, changePercent: +1.5 },
        ],
      },
      {
        id: 'coffee',
        name: 'Coffee (Arabica)',
        unit: 'per kg',
        image: 'https://source.unsplash.com/800x600/?coffee-plant',
        description: 'Shade-grown Arabica beans from high-altitude farms.',
        tag: 'crop',
        points: [
          { market: 'Wayanad', price: 150, changePercent: 3.0 },
          { market: 'Idukki', price: 158, changePercent: 4.2 },
          { market: 'Nilgiris', price: 145, changePercent: -0.8 },
        ],
      },
      {
        id: 'maize',
        name: 'Maize (Corn)',
        unit: 'per kg',
        image: 'https://source.unsplash.com/800x600/?corn-field',
        description: 'Hybrid maize for food and feed.',
        tag: 'crop',
        points: [
          { market: 'Palakkad', price: 50, changePercent: -1.0 },
          { market: 'Thrissur', price: 52, changePercent: +0.5 },
          { market: 'Kozhikode', price: 49, changePercent: -2.2 },
        ],
      },
    ];

    const machineryData: MarketItem[] = [
      {
        id: 'power-tiller',
        name: 'Power Tiller',
        unit: 'unit',
        image: 'https://source.unsplash.com/800x600/?tractor',
        description: 'Compact tractor for tilling and light field work.',
        tag: 'machinery',
        points: [
          { market: 'Ernakulam', price: 125000, changePercent: 0.0 },
          { market: 'Thrissur', price: 119500, changePercent: -1.4 },
          { market: 'Palakkad', price: 128000, changePercent: 1.6 },
        ],
      },
      {
        id: 'drip-kit',
        name: 'Drip Kit (1 acre)',
        unit: 'set',
        image: 'https://source.unsplash.com/800x600/?drip-irrigation',
        description: 'Drip irrigation kit optimized for 1 acre installations.',
        tag: 'machinery',
        points: [
          { market: 'Palakkad', price: 38000, changePercent: -1.2 },
          { market: 'Kottayam', price: 39500, changePercent: 0.8 },
          { market: 'Idukki', price: 37200, changePercent: -2.1 },
        ],
      },
      {
        id: 'solar-pump',
        name: 'Solar Pump 2HP',
        unit: 'unit',
        image: 'https://source.unsplash.com/800x600/?solar-pump',
        description: 'Solar-powered water pump for off-grid irrigation.',
        tag: 'machinery',
        points: [
          { market: 'Alappuzha', price: 210000, changePercent: 0.5 },
          { market: 'Kollam', price: 205000, changePercent: -0.7 },
          { market: 'Kozhikode', price: 215000, changePercent: 1.1 },
        ],
      },
      {
        id: 'baler',
        name: 'Baler Machine',
        unit: 'unit',
        image: 'https://source.unsplash.com/800x600/?baler,hay',
        description: 'High-capacity baler for compressing residues and hay.',
        tag: 'machinery',
        points: [
          { market: 'Thrissur', price: 350000, changePercent: 2.5 },
          { market: 'Malappuram', price: 342000, changePercent: -0.8 },
          { market: 'Palakkad', price: 360000, changePercent: 3.1 },
        ],
      },
      {
        id: 'solar-fence',
        name: 'Solar Fence Kit',
        unit: 'set',
        image: 'https://source.unsplash.com/800x600/?solar,fence',
        description: 'Solar-powered perimeter fence to deter wildlife and theft.',
        tag: 'machinery',
        points: [
          { market: 'Idukki', price: 45000, changePercent: 1.0 },
          { market: 'Wayanad', price: 44000, changePercent: -0.5 },
          { market: 'Thekkady', price: 47000, changePercent: 2.2 },
        ],
      },
      {
        id: 'soil-sensor',
        name: 'Soil Sensor (IoT)',
        unit: 'device',
        image: 'https://source.unsplash.com/800x600/?soil-sensor,iot',
        description: 'Wireless soil moisture & nutrient sensor with cloud integration.',
        tag: 'machinery',
        points: [
          { market: 'Kannur', price: 12000, changePercent: 3.5 },
          { market: 'Kozhikode', price: 11500, changePercent: -1.7 },
          { market: 'Kollam', price: 12500, changePercent: 2.0 },
        ],
      },
    ];

    const chemicalsData: MarketItem[] = [
      {
        id: 'vermicompost',
        name: 'Vermicompost',
        unit: 'per kg',
        image: 'https://source.unsplash.com/800x600/?vermicompost,compost',
        description: 'Organic compost produced by earthworms; improves soil structure.',
        tag: 'chemical',
        points: [
          { market: 'Idukki', price: 14, changePercent: 0.0 },
          { market: 'Kottayam', price: 15, changePercent: 2.0 },
          { market: 'Palakkad', price: 13.5, changePercent: -1.2 },
        ],
      },
      {
        id: 'neem-oil',
        name: 'Neem Oil',
        unit: 'per liter',
        image: 'https://source.unsplash.com/800x600/?neem,oil',
        description: 'Botanical pesticide and fungicide for integrated pest management.',
        tag: 'chemical',
        points: [
          { market: 'Kottayam', price: 280, changePercent: 1.0 },
          { market: 'Thrissur', price: 275, changePercent: -0.4 },
          { market: 'Kannur', price: 290, changePercent: 3.0 },
        ],
      },
      {
        id: 'nske',
        name: 'Insecticide (NSKE 5%)',
        unit: 'per liter',
        image: 'https://source.unsplash.com/800x600/?insecticide,neem',
        description: 'Neem seed kernel extract — a low-cost botanical insecticide.',
        tag: 'chemical',
        points: [
          { market: 'Kannur', price: 190, changePercent: -0.5 },
          { market: 'Palakkad', price: 185, changePercent: -1.1 },
          { market: 'Kozhikode', price: 195, changePercent: 0.8 },
        ],
      },
      {
        id: 'npk',
        name: 'NPK Fertilizer (10-26-26)',
        unit: '50 kg bag',
        image: 'https://source.unsplash.com/800x600/?fertilizer,npk',
        description: 'Balanced fertilizer for flowering and fruiting crops.',
        tag: 'chemical',
        points: [
          { market: 'Palakkad', price: 1400, changePercent: 2.0 },
          { market: 'Thrissur', price: 1380, changePercent: -0.7 },
          { market: 'Kollam', price: 1420, changePercent: 1.8 },
        ],
      },
      {
        id: 'urea',
        name: 'Urea (46% N)',
        unit: '50 kg bag',
        image: 'https://source.unsplash.com/800x600/?urea,fertilizer',
        description: 'High nitrogen fertilizer for vegetative growth.',
        tag: 'chemical',
        points: [
          { market: 'Thrissur', price: 650, changePercent: -0.5 },
          { market: 'Ernakulam', price: 660, changePercent: 0.6 },
          { market: 'Kozhikode', price: 645, changePercent: -1.1 },
        ],
      },
      {
        id: 'potash',
        name: 'Potassium Sulphate',
        unit: '50 kg bag',
        image: 'https://source.unsplash.com/800x600/?potash,potassium',
        description: 'Potassium source to improve fruit quality & stress tolerance.',
        tag: 'chemical',
        points: [
          { market: 'Kollam', price: 950, changePercent: 0.8 },
          { market: 'Kottayam', price: 930, changePercent: -0.3 },
          { market: 'Idukki', price: 970, changePercent: 2.5 },
        ],
      },
    ];

    setCrops(cropsData);
    setMachinery(machineryData);
    setChemicals(chemicalsData);
  }, []);

  // helper to compute previous price before the percent change
  const prevPriceFromChange = (current: number, changePercent: number) => {
    // If changePercent = ((current - prev) / prev) * 100
    // => prev = current / (1 + change/100)
    const prev = current / (1 + changePercent / 100);
    return Number(prev.toFixed(2));
  };

  // Carousel builder (ref per carousel)
  const useCarouselMaker = () => {
    const ref = useRef<HTMLDivElement | null>(null);
    const scroll = (dir: 'left' | 'right') => {
      const el = ref.current;
      if (!el) return;
      const step = Math.round(el.clientWidth * 0.6); // scroll by viewport chunk
      el.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
    };
    return { ref, scroll };
  };

  const makeCarousel = (items: MarketItem[], ariaLabel = 'carousel') => {
    const { ref, scroll } = useCarouselMaker();

    return (
      <div className="relative" aria-label={ariaLabel}>
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-slate-800 p-2 rounded-full shadow"
          aria-label="scroll-left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div
          ref={ref}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-10 py-2"
          style={{ scrollBehavior: 'smooth' }}
        >
          {items.map((it) => (
            <Card key={it.id} className="min-w-[280px] max-w-[320px] bg-background border-border/50">
              <div className="h-40 w-full overflow-hidden rounded-t-md">
                <img
                  src={it.image}
                  alt={it.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform"
                  loading="lazy"
                />
              </div>

              <CardContent className="p-4 text-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-foreground">{it.name}</div>
                    <div className="text-xs text-muted-foreground">{it.unit}</div>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">{it.tag?.toUpperCase()}</div>
                </div>

                <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{it.description}</p>

                <div className="mt-3 space-y-2">
                  {it.points.map((pt, idx) => {
                    const prev = prevPriceFromChange(pt.price, pt.changePercent);
                    const up = pt.changePercent >= 0;
                    return (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex flex-col">
                          <span className="font-medium">{pt.market}</span>
                          <span className="text-muted-foreground">Prev: ₹ {prev}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">₹ {pt.price}</div>
                          <div className={`text-xs px-2 py-0.5 rounded ${up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {pt.changePercent >= 0 ? '+' : ''}{pt.changePercent}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-slate-800 p-2 rounded-full shadow"
          aria-label="scroll-right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  };

  // combined lists filtered by search
  const filteredCrops = crops.filter((c) => c.name.toLowerCase().includes(filter.toLowerCase()));
  const filteredMachinery = machinery.filter((m) => m.name.toLowerCase().includes(filter.toLowerCase()));
  const filteredChemicals = chemicals.filter((c) => c.name.toLowerCase().includes(filter.toLowerCase()));

  const aiTips = useMemo(() => {
    const month = new Date().getMonth() + 1;
    if ([6, 7, 8, 9].includes(month)) {
      return [
        'Prefer paddy and vegetables tolerant to heavy rain.',
        'Buy mulch films and drainage tools if rainfall is high.',
      ];
    }
    if ([1, 2, 3].includes(month)) {
      return [
        'Start summer vegetables like okra and cucurbits.',
        'Consider drip kits to save water.',
      ];
    }
    return [
      'Plant coconut seedlings; ensure shade and irrigation.',
      'Stock organic inputs like vermicompost and neem oil.',
    ];
  }, []);

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
        <div className="max-w-6xl mx-auto w-full px-4 pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">{t('market.title')}</h1>
          <p className="text-white/90 text-sm">Live prices, machinery and agro-chemicals — multiple markets shown</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-6 px-4 pb-12 space-y-10">
        {/* Search + Crops */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" /> {t('market.sectionCrops') ?? 'Crops'}
            </h2>
            <div className="flex items-center gap-2">
              <Input placeholder={t('market.search') ?? 'Search...'} value={filter} onChange={(e) => setFilter(e.target.value)} className="w-64" />
            </div>
          </div>

          {makeCarousel(filteredCrops.length ? filteredCrops : crops, 'crops-carousel')}
        </div>

        {/* Machinery */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Tractor className="h-5 w-5 text-primary" /> {t('market.sectionMachinery') ?? 'Machinery'}
            </h2>
          </div>

          {makeCarousel(filteredMachinery.length ? filteredMachinery : machinery, 'machinery-carousel')}
        </div>

        {/* Chemicals */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Beaker className="h-5 w-5 text-primary" /> {t('market.sectionChemicals') ?? 'Agro-chemicals & Inputs'}
            </h2>
          </div>

          {makeCarousel(filteredChemicals.length ? filteredChemicals : chemicals, 'chemicals-carousel')}
        </div>

        {/* AI Tips */}
        <div>
          <Card className="bg-gradient-primary text-primary-foreground border-border/50">
            <CardHeader>
              <CardTitle>{t('market.aiTipsTitle') ?? 'AI Market Tips'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-primary-foreground/80 mb-2">{t('market.aiTipsSubtitle') ?? 'Seasonal suggestions'}</p>
              <ul className="list-disc ml-6 space-y-1">
                {aiTips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Market;