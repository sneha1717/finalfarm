import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Leaf, Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChatMessage } from '@/types';

const ChatBot: React.FC = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: t('chat.welcome'),
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize voice recognition
  useEffect(() => {
    const initVoiceRecognition = () => {
      // Check if browser supports speech recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setIsVoiceSupported(false);
        setVoiceError('Voice recognition not supported in this browser');
        return;
      }

      setIsVoiceSupported(true);
      const recognition = new SpeechRecognition();
      
      // Configure recognition settings
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      // Set language based on current language context
      const languageMap: { [key: string]: string } = {
        'en': 'en-US',
        'ml': 'ml-IN', // Malayalam
        'ta': 'ta-IN'  // Tamil
      };
      
      recognition.lang = languageMap[language] || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        switch (event.error) {
          case 'no-speech':
            setVoiceError('No speech detected. Please try again.');
            break;
          case 'audio-capture':
            setVoiceError('No microphone found. Please check your microphone.');
            break;
          case 'not-allowed':
            setVoiceError('Microphone permission denied. Please allow microphone access.');
            break;
          case 'network':
            setVoiceError('Network error. Please check your connection.');
            break;
          default:
            setVoiceError('Voice recognition failed. Please try again.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    };

    initVoiceRecognition();
  }, [language]);

  const startVoiceRecognition = () => {
    if (!recognitionRef.current || isListening) return;
    
    try {
      setVoiceError(null);
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setVoiceError('Failed to start voice recognition');
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  // Google Gemini API configuration
  const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyD8NcyoR3sx8_zMedVZrOF2GFCB9cDWcBU";

  // Automated responses for specific farming topics
  const getAutomatedResponse = (userMessage: string): string | null => {
    const message = userMessage.toLowerCase();
    
    const responses = {
      en: {
        coconut: [
          "Coconut trees are perfect for Kerala's climate! Plant them 8-10 meters apart for optimal growth. Water young trees regularly and use organic manure. Harvest mature coconuts every 45 days for best quality.",
          "For healthy coconut palms, ensure good drainage and avoid waterlogging. Use neem cake and cow dung as organic fertilizer. Watch for red palm weevil and treat with neem oil if needed.",
          "Coconut farming in Kerala: Plant during monsoon season (June-July). Use disease-resistant varieties like West Coast Tall or Chowghat Orange Dwarf. Regular pruning and pest control are essential.",
          "Coconut oil extraction: Use traditional methods or modern expellers. Fresh coconut oil has many health benefits and good market value. Consider value-added products like coconut milk and desiccated coconut."
        ],
        neem: [
          "Neem trees are excellent for organic farming! They act as natural pest repellents and improve soil fertility. Plant neem trees around your farm boundary for natural pest control.",
          "Neem oil is a powerful organic pesticide. Mix 2ml neem oil with 1 liter water and spray on crops weekly. It's safe for beneficial insects and effective against many pests.",
          "Neem cake is excellent organic fertilizer. Apply 2-3 kg per tree or 500kg per acre. It also acts as a natural nematicide and improves soil structure.",
          "Neem leaves can be used as green manure. Collect fallen leaves and mix with soil. They decompose quickly and add nutrients while repelling harmful insects."
        ],
        rice: [
          "Rice cultivation in Kerala: Best planting season is June-July during monsoon. Use disease-resistant varieties like Jyothi, Uma, or Ponni. Ensure proper water management and level fields.",
          "For healthy rice crops, maintain 2-3 inches of standing water during vegetative stage. Use organic fertilizers like compost and green manure. Practice crop rotation to prevent diseases.",
          "Rice pest management: Use neem oil spray for leaf folder and stem borer. Introduce beneficial insects like spiders and ladybugs. Avoid excessive use of chemical pesticides.",
          "Rice harvesting: Harvest when 80% of grains are mature. Use combine harvesters for large fields or traditional methods for small plots. Dry grains properly to prevent fungal growth."
        ],
        community: [
          "Join local farming communities to share knowledge and resources! Many Kerala farmers form cooperatives for better market access and collective farming practices.",
          "Community farming helps reduce costs through shared equipment and bulk purchasing. Consider joining farmer producer organizations (FPOs) for better market prices.",
          "Participate in local agricultural fairs and exhibitions to learn new techniques and showcase your produce. Networking with other farmers is valuable for knowledge sharing.",
          "Community seed banks help preserve traditional varieties. Share seeds with neighbors and participate in seed exchange programs to maintain biodiversity."
        ],
        default: "I can help you with farming advice, weather updates, crop management, pest control, and market information. What specific topic would you like to know about?"
      },
      ml: {
        coconut: [
          "കേരളത്തിന്റെ കാലാവസ്ഥയിൽ തെങ്ങ് മികച്ചതാണ്! ഒപ്റ്റിമൽ വളർച്ചയ്ക്ക് 8-10 മീറ്റർ അകലത്തിൽ നടുക. ചെറുതായ തെങ്ങുകളെ നിരന്തരം നനയ്ക്കുക, ജൈവ വളം ഉപയോഗിക്കുക.",
          "ആരോഗ്യമുള്ള തെങ്ങ് വളർത്താൻ നല്ല ജലനിർഗമനം ഉറപ്പാക്കുക. നീം കേക്ക്, പശുവിന്റെ ചാണകം ഉപയോഗിക്കുക. ചുവന്ന തെങ്ങ് കീടത്തിനെതിരെ നീം ഓയിൽ ഉപയോഗിക്കുക.",
          "കേരളത്തിൽ തെങ്ങ് കൃഷി: മൺസൂൺ സീസണിൽ (ജൂൺ-ജൂലൈ) നടുക. രോഗ പ്രതിരോധ ഇനങ്ങൾ ഉപയോഗിക്കുക. നിരന്തരമായ വെട്ടിത്തിരുക്കൽ, കീട നിയന്ത്രണം ആവശ്യമാണ്.",
          "തെങ്ങ് എണ്ണ ഉത്പാദനം: പരമ്പരാഗത രീതികൾ അല്ലെങ്കിൽ ആധുനിക എക്സ്പെല്ലറുകൾ ഉപയോഗിക്കുക. പുതിയ തെങ്ങ് എണ്ണയ്ക്ക് നല്ല മാർക്കറ്റ് മൂല്യമുണ്ട്."
        ],
        neem: [
          "നീം മരങ്ങൾ ജൈവ കൃഷിക്ക് മികച്ചതാണ്! സ്വാഭാവിക കീട നിരോധകമായി പ്രവർത്തിക്കുന്നു. കൃഷിസ്ഥലത്തിന്റെ അതിരിൽ നീം മരങ്ങൾ നടുക.",
          "നീം ഓയിൽ ശക്തമായ ജൈവ കീടനാശിനിയാണ്. 2ml നീം ഓയിൽ 1 ലിറ്റർ വെള്ളത്തിൽ കലർത്തി ആഴ്ചയിൽ ഒരിക്കൽ തളിക്കുക. ഗുണകരമായ കീടങ്ങൾക്ക് സുരക്ഷിതമാണ്.",
          "നീം കേക്ക് മികച്ച ജൈവ വളമാണ്. മരത്തിന് 2-3 കിലോ അല്ലെങ്കിൽ ഏക്കറിന് 500 കിലോ ഉപയോഗിക്കുക. സ്വാഭാവിക നെമാറ്റിസൈഡായും പ്രവർത്തിക്കുന്നു.",
          "നീം ഇലകൾ ഹരിത വളമായി ഉപയോഗിക്കാം. വീണ ഇലകൾ ശേഖരിച്ച് മണ്ണിൽ കലർത്തുക. അവ വേഗത്തിൽ അഴുകി പോഷകങ്ങൾ ചേർക്കുന്നു."
        ],
        rice: [
          "കേരളത്തിൽ നെല്ല് കൃഷി: മികച്ച നട്ടുപിടിപ്പിക്കൽ സീസൺ മൺസൂൺ കാലത്ത് ജൂൺ-ജൂലൈയാണ്. രോഗ പ്രതിരോധ ഇനങ്ങൾ ഉപയോഗിക്കുക. ശരിയായ ജല മാനേജ്മെന്റ് ആവശ്യമാണ്.",
          "ആരോഗ്യമുള്ള നെല്ല് വിളയ്ക്ക് വെജിറ്റേറ്റീവ് ഘട്ടത്തിൽ 2-3 ഇഞ്ച് വെള്ളം നിലനിർത്തുക. കമ്പോസ്റ്റ്, ഹരിത വളം ഉപയോഗിക്കുക. രോഗങ്ങൾ തടയാൻ വിള ഭ്രമണം പാലിക്കുക.",
          "നെല്ല് കീട നിയന്ത്രണം: ഇല മടക്കി കീടത്തിനും കാണ്ഡ കീടത്തിനും നീം ഓയിൽ തളിക്കുക. ചിലന്തികൾ, ലേഡിബഗുകൾ പോലുള്ള ഗുണകരമായ കീടങ്ങൾ അവതരിപ്പിക്കുക.",
          "നെല്ല് അറുതി: 80% ധാന്യങ്ങൾ പഴുത്താൽ അറുതി ചെയ്യുക. വലിയ വയലുകൾക്ക് കോംബൈൻ ഹാർവെസ്റ്റർ ഉപയോഗിക്കുക. ഫംഗസ് വളർച്ച തടയാൻ ധാന്യങ്ങൾ ശരിയായി ഉണക്കുക."
        ],
        community: [
          "അറിവും വിഭവങ്ങളും പങ്കിടാൻ പ്രാദേശിക കൃഷി കമ്മ്യൂണിറ്റികളിൽ ചേരുക! മികച്ച മാർക്കറ്റ് ആക്സസിനായി കോ-ഓപ്പറേറ്റീവുകൾ രൂപീകരിക്കുക.",
          "കമ്മ്യൂണിറ്റി കൃഷി പങ്കിട്ട ഉപകരണങ്ങളിലൂടെ ചെലവ് കുറയ്ക്കാൻ സഹായിക്കുന്നു. മികച്ച മാർക്കറ്റ് വിലകൾക്ക് എഫ്പിഒകളിൽ ചേരുക.",
          "പുതിയ സാങ്കേതിക വിദ്യകൾ പഠിക്കാൻ പ്രാദേശിക കാർഷിക ഫെയറുകളിൽ പങ്കെടുക്കുക. മറ്റ് കർഷകരുമായുള്ള നെറ്റ്‌വർക്കിംഗ് വിലപ്പെട്ടതാണ്.",
          "കമ്മ്യൂണിറ്റി വിത്ത് ബാങ്കുകൾ പരമ്പരാഗത ഇനങ്ങൾ സംരക്ഷിക്കാൻ സഹായിക്കുന്നു. ജൈവവൈവിധ്യം നിലനിർത്താൻ വിത്ത് കൈമാറ്റ പരിപാടികളിൽ പങ്കെടുക്കുക."
        ],
        default: "കൃഷി ഉപദേശം, കാലാവസ്ഥാ അപ്ഡേറ്റുകൾ, വിള മാനേജ്മെന്റ്, കീട നിയന്ത്രണം, മാർക്കറ്റ് വിവരങ്ങൾ എന്നിവയിൽ ഞാൻ സഹായിക്കാം. ഏത് പ്രത്യേക വിഷയത്തെ കുറിച്ചാണ് നിങ്ങൾ അറിയാൻ ആഗ്രഹിക്കുന്നത്?"
      },
      ta: {
        coconut: [
          "கேரளாவின் காலநிலையில் தென்னை மரங்கள் சிறந்தவை! உகந்த வளர்ச்சிக்கு 8-10 மீட்டர் தூரத்தில் நடவு செய்யுங்கள். இளம் தென்னைகளை வழக்கமாக நீர்ப்பாசனம் செய்யுங்கள், கரிம உரம் பயன்படுத்துங்கள்.",
          "ஆரோக்கியமான தென்னை வளர்ப்புக்கு நல்ல நீர் வடிகால் உறுதிப்படுத்துங்கள். வேப்ப எண்ணெய் கேக், மாட்டுச்சாணம் பயன்படுத்துங்கள். சிவப்பு தென்னை பூச்சிக்கு எதிராக வேப்ப எண்ணெய் பயன்படுத்துங்கள்.",
          "கேரளாவில் தென்னை விவசாயம்: பருவமழை காலத்தில் (ஜூன்-ஜூலை) நடவு செய்யுங்கள். நோய் எதிர்ப்பு வகைகளை பயன்படுத்துங்கள். வழக்கமான வெட்டுதல், பூச்சி கட்டுப்பாடு அவசியம்.",
          "தென்னை எண்ணெய் உற்பத்தி: பாரம்பரிய முறைகள் அல்லது நவீன எக்ஸ்பெல்லர்களை பயன்படுத்துங்கள். புதிய தென்னை எண்ணெய்க்கு நல்ல சந்தை மதிப்பு உள்ளது."
        ],
        neem: [
          "வேப்ப மரங்கள் கரிம விவசாயத்திற்கு சிறந்தவை! இயற்கை பூச்சி விரட்டியாக செயல்படுகின்றன. இயற்கை பூச்சி கட்டுப்பாட்டிற்கு உங்கள் விவசாய நிலத்தின் எல்லையில் வேப்ப மரங்களை நடவு செய்யுங்கள்.",
          "வேப்ப எண்ணெய் சக்திவாய்ந்த கரிம பூச்சிக்கொல்லி. 2ml வேப்ப எண்ணெயை 1 லிட்டர் தண்ணீரில் கலந்து வாரத்திற்கு ஒரு முறை தெளிக்கவும். பயனுள்ள பூச்சிகளுக்கு பாதுகாப்பானது.",
          "வேப்ப கேக் சிறந்த கரிம உரம். மரத்திற்கு 2-3 கிலோ அல்லது ஏக்கருக்கு 500 கிலோ பயன்படுத்துங்கள். இயற்கை நெமாடிசைடாகவும் செயல்படுகிறது.",
          "வேப்ப இலைகளை பச்சை உரமாக பயன்படுத்தலாம். விழுந்த இலைகளை சேகரித்து மண்ணில் கலக்கவும். அவை விரைவில் சிதைந்து ஊட்டச்சத்துக்களை சேர்க்கின்றன."
        ],
        rice: [
          "கேரளாவில் நெல் விவசாயம்: சிறந்த நடவு பருவம் பருவமழை காலத்தில் ஜூன்-ஜூலை ஆகும். நோய் எதிர்ப்பு வகைகளை பயன்படுத்துங்கள். சரியான நீர் மேலாண்மை அவசியம்.",
          "ஆரோக்கியமான நெல் பயிர்களுக்கு தாவர கட்டத்தில் 2-3 அங்குல நீரை பராமரிக்கவும். குப்பை, பச்சை உரம் பயன்படுத்தவும். நோய்களை தடுக்க பயிர் சுழற்சியை பின்பற்றவும்.",
          "நெல் பூச்சி கட்டுப்பாடு: இலை மடிப்பு மற்றும் தண்டு பூச்சிக்கு வேப்ப எண்ணெய் தெளிக்கவும். சிலந்திகள், லேடிபக்குகள் போன்ற பயனுள்ள பூச்சிகளை அறிமுகப்படுத்தவும்.",
          "நெல் அறுவடை: 80% தானியங்கள் பழுத்தால் அறுவடை செய்யுங்கள். பெரிய வயல்களுக்கு காம்பைன் ஹார்வெஸ்டர் பயன்படுத்தவும். பூஞ்சை வளர்ச்சியை தடுக்க தானியங்களை சரியாக உலர்த்தவும்."
        ],
        community: [
          "அறிவு மற்றும் வளங்களை பகிர்ந்து கொள்ள உள்ளூர் விவசாய சமூகங்களில் சேரவும்! சிறந்த சந்தை அணுகலுக்காக கூட்டுறவு சங்கங்களை உருவாக்குங்கள்.",
          "சமூக விவசாயம் பகிர்ந்த உபகரணங்கள் மூலம் செலவை குறைக்க உதவுகிறது. சிறந்த சந்தை விலைகளுக்கு எஃப்பிஓக்களில் சேரவும்.",
          "புதிய நுட்பங்களை கற்றுக்கொள்ள உள்ளூர் விவசாய கண்காட்சிகளில் பங்கேற்கவும். மற்ற விவசாயிகளுடன் நெட்வொர்க்கிங் மதிப்புமிக்கது.",
          "சமூக விதை வங்கிகள் பாரம்பரிய வகைகளை பாதுகாக்க உதவுகின்றன. பல்லுயிர் பெருக்கத்தை பராமரிக்க விதை பரிமாற்ற திட்டங்களில் பங்கேற்கவும்."
        ],
        default: "விவசாய ஆலோசனை, வானிலை புதுப்பிப்புகள், பயிர் மேலாண்மை, பூச்சி கட்டுப்பாடு, மற்றும் சந்தை தகவல்களில் நான் உதவ முடியும். எந்த குறிப்பிட்ட தலைப்பைப் பற்றி அறிய விரும்புகிறீர்கள்?"
      }
    };
    
    const currentResponses = responses[language] || responses.en;
    
    // Check for specific topics and return random response
    if (message.includes('coconut') || message.includes('തേങ്ങ') || message.includes('தேங்காய்') || message.includes('coconut tree') || message.includes('തെങ്ങ്') || message.includes('தென்னை')) {
      return currentResponses.coconut[Math.floor(Math.random() * currentResponses.coconut.length)];
    }
    
    if (message.includes('neem') || message.includes('വേപ്പ്') || message.includes('வேப்ப') || message.includes('neem oil') || message.includes('വേപ്പെണ്ണ') || message.includes('வேப்ப எண்ணெய்')) {
      return currentResponses.neem[Math.floor(Math.random() * currentResponses.neem.length)];
    }
    
    if (message.includes('rice') || message.includes('നെല്ല്') || message.includes('அரிசி') || message.includes('paddy') || message.includes('വരി') || message.includes('நெல்')) {
      return currentResponses.rice[Math.floor(Math.random() * currentResponses.rice.length)];
    }
    
    if (message.includes('community') || message.includes('സമൂഹം') || message.includes('சமூகம்') || message.includes('cooperative') || message.includes('കോ-ഓപ്പറേറ്റീവ്') || message.includes('கூட்டுறவு') || message.includes('farmer group') || message.includes('കർഷക സംഘം') || message.includes('விவசாயி குழு')) {
      return currentResponses.community[Math.floor(Math.random() * currentResponses.community.length)];
    }
    
    return null; // No automated response found
  };

  // Send message to Gemini API with fallback to automated responses
  const getAIResponse = async (userMessage: string): Promise<string> => {
    // First try automated responses
    const automatedResponse = getAutomatedResponse(userMessage);
    if (automatedResponse) {
      return automatedResponse;
    }

    // If no automated response, try Gemini API
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `(${language}) ${userMessage}` }],
            },
          ],
        }),
      });

      const data = await response.json();
      const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand.";
      return botReply;
    } catch (err) {
      console.error("Gemini API Error:", err);
      return "Error connecting to Gemini API. Please try again.";
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Get response from Gemini API
      const aiResponse = await getAIResponse(input);

      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };



  return (
    <div className="min-h-screen bg-[#f7f7f3] flex items-center justify-center py-10">
      <div className="max-w-2xl w-full mx-auto rounded-3xl shadow-lg border border-[#e0e0e0] bg-white">
        {/* Green Header */}
        <div className="rounded-t-3xl bg-gradient-to-r from-green-500 to-green-400 px-8 py-6 flex items-center gap-4">
          <div className="bg-white/30 rounded-full p-3 flex items-center justify-center">
            <Bot className="w-7 h-7 text-green-900" />
          </div>
          <div>
            <h2 className="text-white text-xl font-bold">Krishi AI Assistant</h2>
            <p className="text-white/90 text-sm">Your farming companion</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="px-8 py-6 min-h-[400px] flex flex-col gap-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'bot' ? 'items-start' : 'items-end justify-end'} gap-2`}>
              {message.sender === 'bot' && (
                <div className="bg-yellow-400 rounded-full p-2 flex items-center justify-center mt-1">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              <div className={`max-w-[70%] ${message.sender === 'bot' ? 'bg-white' : 'bg-green-500 text-white'} rounded-2xl shadow-md px-5 py-3`}>
                <span className="block text-base">{message.text}</span>
                <span className="block text-xs text-gray-400 mt-2">{message.timestamp instanceof Date ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
              </div>
              {message.sender === 'user' && (
                <div className="bg-green-500 rounded-full p-2 flex items-center justify-center mt-1">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-start gap-2">
              <div className="bg-yellow-400 rounded-full p-2 flex items-center justify-center mt-1">
                <Bot className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="bg-white rounded-2xl shadow-md px-5 py-3 flex gap-2">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="px-8 py-6 border-t border-[#e0e0e0] bg-[#f7f7f3] rounded-b-3xl flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('chat.placeholder') || 'Ask me anything about farming...'}
            disabled={isTyping}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-base bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {/* Voice Recognition Button */}
          {isVoiceSupported && (
            <button
              onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
              disabled={isTyping}
              title={isListening ? "Stop listening" : "Start voice input"}
              className="rounded-xl px-3 py-2 bg-white border border-gray-300 shadow-sm"
            >
              {isListening ? <MicOff className="w-5 h-5 text-green-500" /> : <Mic className="w-5 h-5 text-green-500" />}
            </button>
          )}
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className="rounded-xl px-4 py-2 bg-green-500 text-white font-semibold shadow-md hover:bg-green-600 transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Voice Error Message */}
        {voiceError && (
          <div className="px-8 pb-4">
            <div className="text-xs text-red-600 bg-red-100 border border-red-200 rounded-md p-2">
              {voiceError}
            </div>
          </div>
        )}

        {/* Voice Status */}
        {isListening && (
          <div className="px-8 pb-4">
            <div className="text-xs text-green-700 bg-green-100 border border-green-200 rounded-md p-2 flex items-center gap-2">
              <Mic className="h-3 w-3 animate-pulse" />
              {t('chat.listening')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBot;