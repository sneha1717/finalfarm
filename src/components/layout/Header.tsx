import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Menu, User, LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/ui/language-selector';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import WeatherNotifications from '@/components/weather/WeatherNotifications';
import KYCModal from '@/components/KYCModal';
import KYCNGOModal from '@/components/KYCNGOModal';
import LoginModal from '@/components/LoginModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

const Header: React.FC = () => {
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [showKYCFarmerModal, setShowKYCFarmerModal] = useState(false);
  const [showKYCNGOModal, setShowKYCNGOModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navItems = [
    { href: '/dashboard', label: t('nav.dashboard') },
    { href: '/community', label: 'Community' },
    { href: '/chat', label: t('nav.chat') },
    { href: '/crops', label: t('nav.crops') },
    { href: '/weather', label: t('nav.weather') },
    { href: '/market', label: t('nav.market') },
  ];

  const NavLinks = ({ mobile = false }) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={`text-foreground/80 hover:text-primary transition-colors font-medium ${
            mobile ? 'block py-2' : ''
          }`}
        >
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="flex items-center gap-2"
          >
            <div className="rounded-lg bg-gradient-primary p-2">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Krishi Sakhi
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated && <NavLinks />}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <LanguageSelector />
          
          {/* KYC and Login Buttons - Only show when not authenticated */}
          {!isAuthenticated && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowKYCFarmerModal(true)}
                className="text-xs px-3 py-1 h-8 border-green-300 hover:bg-green-50 text-green-700"
              >
                KYC FARMER 🌾
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowKYCNGOModal(true)}
                className="text-xs px-3 py-1 h-8 border-blue-300 hover:bg-blue-50 text-blue-700"
              >
                KYC NGO 🏢
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLoginModal(true)}
                className="text-xs px-3 py-1 h-8 border-purple-300 hover:bg-purple-50 text-purple-700"
              >
                LOGIN 🔐
              </Button>
            </div>
          )}
          
          {/* Weather Notifications - Only show when authenticated */}
          {isAuthenticated && (
            <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative text-muted-foreground hover:text-foreground"
                >
                  <Bell className="h-4 w-4" />
                  {/* Red alert dot */}
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full border-2 border-background animate-pulse" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-96 max-h-96 overflow-y-auto p-4">
                <WeatherNotifications onClose={() => setNotificationOpen(false)} />
              </PopoverContent>
            </Popover>
          )}
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/10">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-md border-border/50">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t('nav.profile')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-destructive">
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}

          {/* Mobile menu */}
          {isAuthenticated && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gradient-card">
                <nav className="flex flex-col gap-4 mt-8">
                  <NavLinks mobile />
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>

      {/* KYC and Login Modals */}
      <KYCModal isOpen={showKYCFarmerModal} onClose={() => setShowKYCFarmerModal(false)} />
      <KYCNGOModal isOpen={showKYCNGOModal} onClose={() => setShowKYCNGOModal(false)} />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </motion.header>
  );
};

export default Header;