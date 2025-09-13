import React from 'react';
import { motion } from 'framer-motion';
import ChatBot from '@/components/chat/ChatBot';
import { useLanguage } from '@/contexts/LanguageContext';

const Chat: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-4rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full max-w-4xl mx-auto"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {t('nav.chat')}
          </h1>
          <p className="text-muted-foreground mt-2">
            Get instant farming advice from our AI assistant
          </p>
        </div>
        
        <div className="h-[calc(100%-5rem)]">
          <ChatBot />
        </div>
      </motion.div>
    </div>
  );
};

export default Chat;