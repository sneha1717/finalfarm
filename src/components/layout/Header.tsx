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
          ) : (
            <Button asChild variant="default" className="bg-gradient-primary hover:opacity-90">
              <Link to="/login">{t('hero.login')}</Link>
            </Button>
          )}

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
    </motion.header>
  );
};

export default Header;