import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { useLanguage } from '@/contexts/LanguageContext';
import { CropData } from '@/types';
import { Sprout, Calendar, Pencil, Trash2, UploadCloud, Image as ImageIcon, Factory } from 'lucide-react';

const STORAGE_KEY = 'krishi-crops';

const getFallbackCropImage = (name?: string): string | undefined => {
  if (!name) return undefined;
  const key = name.trim().toLowerCase();
  if (key.includes('rice') || key.includes('paddy')) {
    // Rice field
    return 'https://images.unsplash.com/photo-1526657782461-9fe13402a841?auto=format&fit=crop&w=1200&q=60';
  }
  if (key.includes('banana')) {
    // Banana tree/plantation
    return 'https://images.unsplash.com/photo-1517260739337-6799d3cbb1c1?auto=format&fit=crop&w=1200&q=60';
  }
  return undefined;
};

const getSecondaryFallbackCropImage = (name?: string): string => {
  const key = (name || '').trim().toLowerCase();
  if (key.includes('rice') || key.includes('paddy')) {
    return 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=60';
  }
  if (key.includes('banana')) {
    return 'https://images.unsplash.com/photo-1582199328062-9f7ae3b2d6a2?auto=format&fit=crop&w=1200&q=60';
  }
  return 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?auto=format&fit=crop&w=1200&q=60';
};

const emptyForm: Omit<CropData, 'id' | 'status' | 'health'> & { image?: string } = {
  name: '',
  season: '',
  planted: new Date(),
  expectedHarvest: new Date(),
  harvestedAt: undefined,
  notes: '',
};

const Crops: React.FC = () => {
  const { t } = useLanguage();
  const [crops, setCrops] = useState<CropData[]>([]);
  const [form, setForm] = useState<typeof emptyForm>({ ...emptyForm });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | undefined>(undefined);
  const [byProducts, setByProducts] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: CropData[] = JSON.parse(saved);
        setCrops(parsed.map(c => ({ ...c, planted: new Date(c.planted), expectedHarvest: new Date(c.expectedHarvest) })));
      } catch {}
    } else {
      // Demo crops
      setCrops([
        { id: crypto.randomUUID(), name: 'Rice', season: 'Kharif', planted: new Date(Date.now() - 30*86400000), expectedHarvest: new Date(Date.now() + 60*86400000), status: 'growing', health: 85, notes: 'Lowland paddy – Jyothi', image: '', byproducts: 'Husk as mulch; bran for feed' },
        { id: crypto.randomUUID(), name: 'Banana', season: 'Year-round', planted: new Date(Date.now() - 60*86400000), expectedHarvest: new Date(Date.now() + 120*86400000), status: 'growing', health: 78, notes: 'Nendran variety', image: '', byproducts: 'Pseudostem fiber; leaves for plates' },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(crops));
  }, [crops]);

  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setImageData(undefined);
  };

  const onImageChange = (file?: File) => {
    if (!file) return setImageData(undefined);
    const reader = new FileReader();
    reader.onload = () => setImageData(reader.result as string);
    reader.readAsDataURL(file);
  };

  const addOrUpdate = () => {
    const newCrop: CropData = {
      id: editingId || crypto.randomUUID(),
      name: form.name.trim() || 'Crop',
      season: form.season.trim() || 'Season',
      planted: new Date(form.planted),
      expectedHarvest: new Date(form.expectedHarvest),
      status: 'growing',
      health: 80,
      notes: form.notes,
      image: imageData,
      byproducts: byProducts,
    };

    if (editingId) {
      setCrops(prev => prev.map(c => (c.id === editingId ? newCrop : c)));
    } else {
      setCrops(prev => [newCrop, ...prev]);
    }
    resetForm();
  };

  const edit = (crop: CropData) => {
    setEditingId(crop.id);
    setForm({
      name: crop.name,
      season: crop.season,
      planted: new Date(crop.planted),
      expectedHarvest: new Date(crop.expectedHarvest),
      harvestedAt: (crop as any).harvestedAt ? new Date((crop as any).harvestedAt) : undefined,
      notes: crop.notes,
    });
    setByProducts(crop.byproducts || '');
    setImageData(crop.image);
  };

  const remove = (id: string) => {
    setCrops(prev => prev.filter(c => c.id !== id));
    if (editingId === id) resetForm();
  };

  const previewCards = useMemo(() => crops.map((crop) => (
    <Card key={crop.id} className="bg-gradient-card border border-primary/10 shadow-card hover:shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sprout className="h-5 w-5 text-primary" />
          {crop.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-3 gap-3 items-start">
          <div className="col-span-1">
            <div className="aspect-[4/3] rounded-lg bg-background border border-border overflow-hidden flex items-center justify-center">
              {crop.image || getFallbackCropImage(crop.name) ? (
                <img
                  src={crop.image || getFallbackCropImage(crop.name)!}
                  alt={crop.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    const fallback = getSecondaryFallbackCropImage(crop.name);
                    const el = e.currentTarget as HTMLImageElement;
                    if (el.src !== fallback) {
                      el.src = fallback;
                    }
                  }}
                />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
          </div>
          <div className="col-span-2 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Planted: {new Date(crop.planted).toLocaleDateString()} • Harvest: {new Date(crop.expectedHarvest).toLocaleDateString()}
            </div>
            <div className="text-muted-foreground">Season: {crop.season} • Status: {crop.status} • Health: {crop.health}%</div>
            {crop.byproducts && (
              <div className="text-xs text-foreground/80 flex items-center gap-2">
                <Factory className="h-3 w-3 text-accent" /> By-products: {crop.byproducts}
              </div>
            )}
          </div>
        </div>
        <div className="text-foreground whitespace-pre-wrap bg-background/40 p-3 rounded-md border border-border">
          {crop.notes}
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => edit(crop)} className="gap-2">
            <Pencil className="h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => remove(crop.id)} className="gap-2">
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )), [crops]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-6xl mx-auto pt-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 bg-gradient-card border border-primary/20 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-primary" />
                  My Crops
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Crop name" />
                  <Input value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })} placeholder="Season" />

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {form.planted ? new Date(form.planted).toLocaleDateString() : 'Select planted date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarPicker
                        mode="single"
                        selected={form.planted ? new Date(form.planted) : undefined}
                        onSelect={(d) => d && setForm({ ...form, planted: d })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {form.expectedHarvest ? new Date(form.expectedHarvest).toLocaleDateString() : 'Select expected harvest'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarPicker
                        mode="single"
                        selected={form.expectedHarvest ? new Date(form.expectedHarvest) : undefined}
                        onSelect={(d) => d && setForm({ ...form, expectedHarvest: d })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start font-normal col-span-2">
                        <Calendar className="mr-2 h-4 w-4" />
                        {form.harvestedAt ? new Date(form.harvestedAt).toLocaleDateString() : 'Harvested on (optional)'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarPicker
                        mode="single"
                        selected={form.harvestedAt ? new Date(form.harvestedAt) : undefined}
                        onSelect={(d) => setForm({ ...form, harvestedAt: d || undefined })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <textarea
                  className="w-full border border-border rounded-md p-3 bg-background text-foreground"
                  rows={3}
                  placeholder="Notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
                <div className="text-sm text-foreground flex items-center gap-2">
                  <Factory className="h-4 w-4 text-accent" /> By-products / Uses
                </div>
                <textarea
                  className="w-full border border-border rounded-md p-3 bg-background text-foreground"
                  rows={2}
                  placeholder="E.g., rice husk mulch, banana fiber, coconut coir"
                  value={byProducts}
                  onChange={(e) => setByProducts(e.target.value)}
                />
                <label className="flex items-center gap-2 text-sm cursor-pointer text-muted-foreground">
                  <UploadCloud className="h-4 w-4" /> Attach photo
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => onImageChange(e.target.files?.[0])} />
                </label>
                {imageData ? (
                  <img src={imageData} alt="preview" className="rounded-md border border-border" />
                ) : (
                  <div className="h-24 rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground text-xs">
                    <ImageIcon className="h-4 w-4 mr-2" /> No image selected
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={addOrUpdate} className="bg-gradient-primary hover:opacity-90">
                    {editingId ? 'Update Crop' : 'Add Crop'}
                  </Button>
                  {editingId && (
                    <Button variant="outline" onClick={resetForm}>Cancel</Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
              {previewCards.length > 0 ? previewCards : (
                <Card className="md:col-span-2 bg-gradient-card border-border/50">
                  <CardContent className="p-10 text-center text-muted-foreground">
                    No crops added yet. Use the form to add your first crop.
                  </CardContent>
                </Card>
              )}
              <Card className="md:col-span-2 bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" /> Harvest Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="md:col-span-2 flex flex-wrap items-center gap-3 pb-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-blue-500" /> Upcoming
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-amber-500" /> Due soon (≤ 2 weeks)
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-red-500" /> Overdue
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> Harvested
                    </div>
                  </div>
                  {crops
                    .slice()
                    .sort((a,b)=> new Date(a.expectedHarvest).getTime()-new Date(b.expectedHarvest).getTime())
                    .map(c => {
                      const now = new Date();
                      const expected = new Date(c.expectedHarvest);
                      const harvested = (c as any).harvestedAt ? new Date((c as any).harvestedAt) : undefined;
                      const twoWeeksMs = 14 * 24 * 60 * 60 * 1000;
                      let badge = { color: 'bg-blue-500', border: 'border-l-blue-400' } as { color: string; border: string };
                      if (harvested) {
                        badge = { color: 'bg-emerald-500', border: 'border-l-emerald-400' };
                      } else if (expected.getTime() < now.getTime()) {
                        badge = { color: 'bg-red-500', border: 'border-l-red-400' };
                      } else if (expected.getTime() - now.getTime() <= twoWeeksMs) {
                        badge = { color: 'bg-amber-500', border: 'border-l-amber-400' };
                      }
                      return (
                        <div key={c.id} className={`p-3 rounded-md bg-background/60 border border-border flex items-center justify-between gap-3 border-l-4 ${badge.border}`}>
                          <div className="flex items-center gap-2">
                            <span className={`inline-block h-2 w-2 rounded-full ${badge.color}`} />
                            <span>{c.name} — {new Date(c.expectedHarvest).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {harvested && (
                              <span className="text-xs text-foreground/70">Harvested: {harvested.toLocaleDateString()}</span>
                            )}
                            <span className="text-muted-foreground">{c.season}</span>
                          </div>
                        </div>
                      );
                    })}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Crops;


