export type Language = 'en' | 'ml' | 'ta';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  farmSize: number;
  location: string;
  crops: string[];
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'image' | 'suggestion';
}

export interface CropData {
  id: string;
  name: string;
  season: string;
  planted: Date;
  expectedHarvest: Date;
  harvestedAt?: Date;
  status: 'planted' | 'growing' | 'ready' | 'harvested';
  health: number;
  notes: string;
  image?: string;
  byproducts?: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  conditions: string;
  windSpeed?: number;
  visibility?: number;
  location?: string;
  forecast: {
    day: string;
    high: number;
    low: number;
    conditions: string;
    icon?: string;
  }[];
}

export interface MarketPrice {
  crop: string;
  price: number;
  unit: string;
  change: number;
  market: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date;
  read: boolean;
}