import React from 'react';
import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/types';

const languages = [
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'ml' as Language, name: 'മലയാളം', flag: '🇮🇳' },
  { code: 'ta' as Language, name: 'தமிழ்', flag: '🇮🇳' },
];

export const LanguageSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className={`w-auto gap-2 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-colors ${className}`}>
        <Globe className="h-4 w-4 text-muted-foreground" />
        <SelectValue>
          <span className="flex items-center gap-2">
            <span>{currentLanguage?.flag}</span>
            <span className="hidden sm:inline">{currentLanguage?.name}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-card/95 backdrop-blur-md border-border/50">
        {languages.map((lang) => (
          <SelectItem 
            key={lang.code} 
            value={lang.code}
            className="flex items-center gap-2 hover:bg-primary/10 focus:bg-primary/10"
          >
            <span className="mr-2">{lang.flag}</span>
            <span>{lang.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};