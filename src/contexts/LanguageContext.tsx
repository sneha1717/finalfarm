import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.chat': 'AI Assistant',
    'nav.crops': 'My Crops',
    'nav.weather': 'Weather',
    'nav.market': 'Market Prices',
    'nav.profile': 'Profile',
    'nav.community': 'Community',
    
    // Hero Section
    'hero.title': 'Your Smart Farming Assistant',
    'hero.subtitle': 'AI-powered guidance for Kerala farmers. Get expert advice, weather updates, and market insights.',
    'hero.cta': 'Start Farming Smarter',
    'hero.login': 'Login',
    
    // Chatbot
    'chat.placeholder': 'Ask me anything about farming...',
    'chat.send': 'Send',
    'chat.welcome': 'Hello! I\'m your farming assistant. How can I help you today?',
    'chat.listening': 'Listening... Speak now',
    'chat.voiceError': 'Voice recognition failed. Please try again.',
    
    // Community
    'community.title': 'Farming Community',
    'community.subtitle': 'Kerala Farmers Community',
    'community.welcome': 'Welcome',
    'community.discussions': 'active discussions',
    'community.share': 'Share Your Farming Experience',
    'community.shareSubtitle': 'Ask questions, share tips, or celebrate your harvest',
    'community.category': 'Choose Category',
    'community.general': '🌱 General',
    'community.support': '🤝 Need Support',
    'community.advice': '💡 Seeking Advice',
    'community.celebration': '🌾 Celebration',
    'community.placeholder': 'Share your farming experience, challenges, or questions...',
    'community.characters': 'characters',
    'community.shareButton': 'Share with Community',
    'community.reply': 'Reply',
    'community.replies': 'replies',
    'community.replyPlaceholder': 'Share your thoughts, advice, or encouragement...',
    'community.cancel': 'Cancel',
    'community.startConversation': 'Start the Conversation',
    'community.firstShare': 'Be the first to share your farming experience!',
    
    // Weather
    'weather.title': 'Weather Forecast',
    'weather.currentConditions': 'Current Conditions',
    'weather.forecast': '5-Day Forecast',
    'weather.temperature': 'Temperature',
    'weather.humidity': 'Humidity',
    'weather.rainfall': 'Rainfall',
    'weather.windSpeed': 'Wind Speed',
    'weather.visibility': 'Visibility',
    'weather.lastUpdated': 'Last Updated',
    'weather.refresh': 'Refresh',
    'weather.high': 'High',
    'weather.low': 'Low',
    'weather.alert': 'Weather Alert',
    'weather.severeWarning': 'Severe weather conditions detected in your area!',
    
    // Notifications
    'notifications.title': 'Weather Alert Details',
    'notifications.backToHome': 'Back to Home',
    'notifications.activeAlerts': 'Active Weather Alerts',
    'notifications.severity': 'Severity',
    'notifications.issued': 'Issued',
    'notifications.expires': 'Expires',
    'notifications.location': 'Location',
    'notifications.affectedAreas': 'Affected Areas',
    'notifications.recommendedActions': 'Recommended Actions',
    'notifications.additionalInfo': 'Additional Information',
    'notifications.noAlerts': 'No active alerts at this time',
    'notifications.allClear': 'All Clear!',
    'notifications.viewDetails': 'View Details',

    // Market
    'market.title': 'Market Prices',
    'market.search': 'Search crop or product',
    'market.sectionCrops': 'Crops',
    'market.sectionMachinery': 'Agri Machinery',
    'market.sectionChemicals': 'Agro-chemicals',
    'market.price': 'Price',
    'market.unit': 'Unit',
    'market.market': 'Market',
    'market.aiTipsTitle': 'AI Tips for This Month',
    'market.aiTipsSubtitle': 'Suggested crops to plant and items to buy',
    'market.viewMore': 'View more',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.crops': 'Active Crops',
    'dashboard.weather': 'Today\'s Weather',
    'dashboard.market': 'Market Updates',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.retry': 'Retry',
    'common.close': 'Close',
    'common.gotIt': 'Got it',
  },
  ml: {
    // Navigation (Malayalam)
    'nav.dashboard': 'ഡാഷ്ബോർഡ്',
    'nav.chat': 'AI സഹായി',
    'nav.crops': 'എന്റെ വിളകൾ',
    'nav.weather': 'കാലാവസ്ഥ',
    'nav.market': 'മാർക്കറ്റ് വില',
    'nav.profile': 'പ്രൊഫൈൽ',
    'nav.community': 'കൂട്ടായ്മ',
    
    // Hero Section
    'hero.title': 'നിങ്ങളുടെ സ്മാർട്ട് കൃഷി സഹായി',
    'hero.subtitle': 'കേരള കർഷകർക്കായി AI-പവർഡ് ഗൈഡൻസ്. വിദഗ്ധ ഉപദേശം, കാലാവസ്ഥാ അപ്ഡേറ്റുകൾ, മാർക്കറ്റ് വിവരങ്ങൾ.',
    'hero.cta': 'സ്മാർട്ട് കൃഷി തുടങ്ങൂ',
    'hero.login': 'ലോഗിൻ',
    
    // Chatbot
    'chat.placeholder': 'കൃഷിയെ കുറിച്ച് എന്തെങ്കിലും ചോദിക്കൂ...',
    'chat.send': 'അയയ്ക്കുക',
    'chat.welcome': 'ഹലോ! ഞാൻ നിങ്ങളുടെ കൃഷി സഹായിയാണ്. ഇന്ന് എങ്ങനെ സഹായിക്കാം?',
    'chat.listening': 'കേൾക്കുന്നു... ഇപ്പോൾ സംസാരിക്കുക',
    'chat.voiceError': 'വോയ്സ് തിരിച്ചറിയൽ പരാജയപ്പെട്ടു. വീണ്ടും ശ്രമിക്കുക.',
    
    // Community
    'community.title': 'കൃഷി കൂട്ടായ്മ',
    'community.subtitle': 'കേരള കർഷകർ കൂട്ടായ്മ',
    'community.welcome': 'സ്വാഗതം',
    'community.discussions': 'സജീവ ചർച്ചകൾ',
    'community.share': 'നിങ്ങളുടെ കൃഷി അനുഭവം പങ്കിടുക',
    'community.shareSubtitle': 'ചോദ്യങ്ങൾ ചോദിക്കുക, നുറുങ്ങുകൾ പങ്കിടുക, അല്ലെങ്കിൽ നിങ്ങളുടെ വിളവ് ആഘോഷിക്കുക',
    'community.category': 'വിഭാഗം തിരഞ്ഞെടുക്കുക',
    'community.general': '🌱 പൊതുവായത്',
    'community.support': '🤝 പിന്തുണ വേണം',
    'community.advice': '💡 ഉപദേശം തേടുന്നു',
    'community.celebration': '🌾 ആഘോഷം',
    'community.placeholder': 'നിങ്ങളുടെ കൃഷി അനുഭവം, വെല്ലുവിളികൾ, അല്ലെങ്കിൽ ചോദ്യങ്ങൾ പങ്കിടുക...',
    'community.characters': 'അക്ഷരങ്ങൾ',
    'community.shareButton': 'കൂട്ടായ്മയുമായി പങ്കിടുക',
    'community.reply': 'മറുപടി',
    'community.replies': 'മറുപടികൾ',
    'community.replyPlaceholder': 'നിങ്ങളുടെ ചിന്തകൾ, ഉപദേശം, അല്ലെങ്കിൽ പ്രോത്സാഹനം പങ്കിടുക...',
    'community.cancel': 'റദ്ദാക്കുക',
    'community.startConversation': 'സംഭാഷണം ആരംഭിക്കുക',
    'community.firstShare': 'നിങ്ങളുടെ കൃഷി അനുഭവം പങ്കിടുന്ന ആദ്യ വ്യക്തിയാകുക!',
    
    // Weather
    'weather.title': 'കാലാവസ്ഥാ പ്രവചനം',
    'weather.currentConditions': 'നിലവിലെ അവസ്ഥ',
    'weather.forecast': '5 ദിവസത്തെ പ്രവചനം',
    'weather.temperature': 'താപനില',
    'weather.humidity': 'ആർദ്രത',
    'weather.rainfall': 'മഴ',
    'weather.windSpeed': 'കാറ്റിന്റെ വേഗത',
    'weather.visibility': 'ദൃശ്യത',
    'weather.lastUpdated': 'അവസാനം അപ്ഡേറ്റ് ചെയ്തത്',
    'weather.refresh': 'പുതുക്കുക',
    'weather.high': 'ഉയർന്നത്',
    'weather.low': 'താഴ്ന്നത്',
    'weather.alert': 'കാലാവസ്ഥാ മുന്നറിയിപ്പ്',
    'weather.severeWarning': 'നിങ്ങളുടെ പ്രദേശത്ത് കഠിനമായ കാലാവസ്ഥാ സാഹചര്യങ്ങൾ കണ്ടെത്തി!',
    
    // Notifications
    'notifications.title': 'കാലാവസ്ഥാ മുന്നറിയിപ്പ് വിവരങ്ങൾ',
    'notifications.backToHome': 'ഹോമിലേക്ക് മടങ്ങുക',
    'notifications.activeAlerts': 'സജീവ കാലാവസ്ഥാ മുന്നറിയിപ്പുകൾ',
    'notifications.severity': 'തീവ്രത',
    'notifications.issued': 'ഇഷ്യൂ ചെയ്തത്',
    'notifications.expires': 'കാലാവധി',
    'notifications.location': 'സ്ഥലം',
    'notifications.affectedAreas': 'ബാധിത പ്രദേശങ്ങൾ',
    'notifications.recommendedActions': 'ശുപാർശ ചെയ്യുന്ന പ്രവർത്തനങ്ങൾ',
    'notifications.additionalInfo': 'അധിക വിവരങ്ങൾ',
    'notifications.noAlerts': 'ഈ സമയത്ത് സജീവ മുന്നറിയിപ്പുകളൊന്നുമില്ല',
    'notifications.allClear': 'എല്ലാം ശുഭമാണ്!',
    'notifications.viewDetails': 'വിവരങ്ങൾ കാണുക',

    // Market
    'market.title': 'മാർക്കറ്റ് വില',
    'market.search': 'വിള/ഉൽപ്പന്നം തിരയുക',
    'market.sectionCrops': 'വിളകൾ',
    'market.sectionMachinery': 'കൃഷി യന്ത്രങ്ങൾ',
    'market.sectionChemicals': 'കൃഷി രാസവസ്തുക്കൾ',
    'market.price': 'വില',
    'market.unit': 'യൂണിറ്റ്',
    'market.market': 'മാർക്കറ്റ്',
    'market.aiTipsTitle': 'ഈ മാസത്തേക്കുള്ള AI നിർദ്ദേശങ്ങൾ',
    'market.aiTipsSubtitle': 'നട്ടുപിടിപ്പിക്കാനും വാങ്ങാനും അനുയോജ്യമായവ',
    'market.viewMore': 'കൂടുതൽ കാണുക',
    
    // Dashboard
    'dashboard.welcome': 'തിരികെ സ്വാഗതം',
    'dashboard.crops': 'സജീവ വിളകൾ',
    'dashboard.weather': 'ഇന്നത്തെ കാലാവസ്ഥ',
    'dashboard.market': 'മാർക്കറ്റ് അപ്ഡേറ്റുകൾ',
    
    // Common
    'common.loading': 'ലോഡിംഗ്...',
    'common.error': 'എന്തോ പ്രശ്നം സംഭവിച്ചു',
    'common.retry': 'വീണ്ടും ശ്രമിക്കുക',
    'common.close': 'അടയ്ക്കുക',
    'common.gotIt': 'മനസ്സിലായി',
  },
  ta: {
    // Navigation (Tamil)
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.chat': 'AI உதவியாளர்',
    'nav.crops': 'என் பயிர்கள்',
    'nav.weather': 'வானிலை',
    'nav.market': 'சந்தை விலைகள்',
    'nav.profile': 'சுயவிவரம்',
    'nav.community': 'சமூகம்',
    
    // Hero Section
    'hero.title': 'உங்கள் ஸ்மார்ட் விவசாய உதவியாளர்',
    'hero.subtitle': 'கேரள விவசாயிகளுக்கு AI-இயங்கும் வழிகாட்டுதல். நிபுணர் ஆலோசனை, வானிலை புதுப்பிப்புகள், சந்தை நுண்ணறிவுகள்.',
    'hero.cta': 'ஸ்மார்ட் விவசாயத்தைத் தொடங்குங்கள்',
    'hero.login': 'உள்நுழைய',
    
    // Chatbot
    'chat.placeholder': 'விவசாயத்தைப் பற்றி எதையும் கேளுங்கள்...',
    'chat.send': 'அனுப்பு',
    'chat.welcome': 'வணக்கம்! நான் உங்கள் விவசாய உதவியாளர். இன்று எவ்வாறு உதவ முடியும்?',
    'chat.listening': 'கேட்டுக்கொண்டிருக்கிறேன்... இப்போது பேசுங்கள்',
    'chat.voiceError': 'குரல் அங்கீகாரம் தோல்வியடைந்தது. மீண்டும் முயற்சி செய்யுங்கள்.',
    
    // Community
    'community.title': 'விவசாய சமூகம்',
    'community.subtitle': 'கேரள விவசாயிகள் சமூகம்',
    'community.welcome': 'வரவேற்கிறோம்',
    'community.discussions': 'செயலில் உள்ள விவாதங்கள்',
    'community.share': 'உங்கள் விவசாய அனுபவத்தை பகிர்ந்து கொள்ளுங்கள்',
    'community.shareSubtitle': 'கேள்விகள் கேளுங்கள், குறிப்புகள் பகிர்ந்து கொள்ளுங்கள், அல்லது உங்கள் அறுவடையை கொண்டாடுங்கள்',
    'community.category': 'வகையை தேர்ந்தெடுக்கவும்',
    'community.general': '🌱 பொது',
    'community.support': '🤝 ஆதரவு தேவை',
    'community.advice': '💡 ஆலோசனை தேடுகிறது',
    'community.celebration': '🌾 கொண்டாட்டம்',
    'community.placeholder': 'உங்கள் விவசாய அனுபவம், சவால்கள் அல்லது கேள்விகளை பகிர்ந்து கொள்ளுங்கள்...',
    'community.characters': 'எழுத்துகள்',
    'community.shareButton': 'சமூகத்துடன் பகிர்ந்து கொள்ளுங்கள்',
    'community.reply': 'பதில்',
    'community.replies': 'பதில்கள்',
    'community.replyPlaceholder': 'உங்கள் எண்ணங்கள், ஆலோசனை அல்லது ஊக்கத்தை பகிர்ந்து கொள்ளுங்கள்...',
    'community.cancel': 'ரத்து செய்',
    'community.startConversation': 'உரையாடலைத் தொடங்குங்கள்',
    'community.firstShare': 'உங்கள் விவசாய அனுபவத்தை பகிர்ந்து கொள்ளும் முதல் நபராக இருங்கள்!',
    
    // Weather
    'weather.title': 'வானிலை முன்னறிவிப்பு',
    'weather.currentConditions': 'தற்போதைய நிலைமைகள்',
    'weather.forecast': '5 நாள் முன்னறிவிப்பு',
    'weather.temperature': 'வெப்பநிலை',
    'weather.humidity': 'ஈரப்பதம்',
    'weather.rainfall': 'மழை',
    'weather.windSpeed': 'காற்றின் வேகம்',
    'weather.visibility': 'பார்வை தூரம்',
    'weather.lastUpdated': 'கடைசியாக புதுப்பிக்கப்பட்டது',
    'weather.refresh': 'புதுப்பிக்கவும்',
    'weather.high': 'உயர்ந்த',
    'weather.low': 'குறைந்த',
    'weather.alert': 'வானிலை எச்சரிக்கை',
    'weather.severeWarning': 'உங்கள் பகுதியில் கடுமையான வானிலை நிலைமைகள் கண்டறியப்பட்டுள்ளன!',
    
    // Notifications
    'notifications.title': 'வானிலை எச்சரிக்கை விவரங்கள்',
    'notifications.backToHome': 'முகப்புக்கு திரும்பு',
    'notifications.activeAlerts': 'செயலில் உள்ள வானிலை எச்சரிக்கைகள்',
    'notifications.severity': 'கடுமை',
    'notifications.issued': 'வெளியிடப்பட்டது',
    'notifications.expires': 'காலாவதி',
    'notifications.location': 'இடம்',
    'notifications.affectedAreas': 'பாதிக்கப்பட்ட பகுதிகள்',
    'notifications.recommendedActions': 'பரிந்துரைக்கப்பட்ட செயல்கள்',
    'notifications.additionalInfo': 'கூடுதல் தகவல்',
    'notifications.noAlerts': 'இந்த நேரத்தில் செயலில் உள்ள எச்சரிக்கைகள் எதுவும் இல்லை',
    'notifications.allClear': 'எல்லாம் நன்றாக உள்ளது!',
    'notifications.viewDetails': 'விவரங்களைக் காண்க',

    // Market
    'market.title': 'சந்தை விலைகள்',
    'market.search': 'பயிர்/பொருள் தேடு',
    'market.sectionCrops': 'பயிர்கள்',
    'market.sectionMachinery': 'விவசாய இயந்திரங்கள்',
    'market.sectionChemicals': 'விவசாய இரசாயனங்கள்',
    'market.price': 'விலை',
    'market.unit': 'அலகு',
    'market.market': 'சந்தை',
    'market.aiTipsTitle': 'இந்த மாதத்திற்கான AI குறிப்புகள்',
    'market.aiTipsSubtitle': 'நடவுக்கு/வாங்குவதற்கு பரிந்துரைகள்',
    'market.viewMore': 'மேலும் பார்க்க',
    
    // Dashboard
    'dashboard.welcome': 'மீண்டும் வரவேற்கிறோம்',
    'dashboard.crops': 'செயலில் உள்ள பயிர்கள்',
    'dashboard.weather': 'இன்றைய வானிலை',
    'dashboard.market': 'சந்தை புதுப்பிப்புகள்',
    
    // Common
    'common.loading': 'ஏற்றுகிறது...',
    'common.error': 'ஏதோ தவறு நடந்தது',
    'common.retry': 'மீண்டும் முயற்சி செய்யுங்கள்',
    'common.close': 'மூடு',
    'common.gotIt': 'புரிந்தது',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('krishi-sakhi-language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('krishi-sakhi-language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};