// ─── User & Auth ─────────────────────────────────────────────────────────────
export type UserRole = 'client' | 'provider';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address?: string;
  avatar?: string;
  createdAt: string;
}

// ─── Service Provider ─────────────────────────────────────────────────────────
export interface ServiceProvider extends User {
  services: ServiceCategory[];
  description: string;
  rating: number;
  reviewCount: number;
  city: string;
  neighborhood: string;
  latitude?: number;
  longitude?: number;
  whatsapp: string;
  available: boolean;
  priceRange: string;
}

// ─── Service Categories ───────────────────────────────────────────────────────
export type ServiceCategory =
  | 'limpeza'
  | 'pintura'
  | 'pedreiro'
  | 'encanador'
  | 'eletricista'
  | 'estofado';

// ─── Booking / Agendamento ────────────────────────────────────────────────────
export type BookingStatus = 'pendente' | 'confirmado' | 'concluido' | 'cancelado';

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  providerId: string;
  providerName: string;
  service: ServiceCategory;
  date: string;       // ISO date string YYYY-MM-DD
  time: string;       // HH:MM
  address: string;
  city: string;
  notes: string;
  status: BookingStatus;
  totalPrice?: string;
  createdAt: string;
}

// ─── Review / Avaliação ───────────────────────────────────────────────────────
export interface Review {
  id: string;
  bookingId: string;
  clientId: string;
  clientName: string;
  providerId: string;
  rating: number;     // 1-5
  comment: string;
  createdAt: string;
}

// ─── Navigation Param Lists ───────────────────────────────────────────────────
export type AuthStackParamList = {
  Login: undefined;
  Register: { role?: UserRole };
};

export type ClientTabParamList = {
  Início: undefined;
  Histórico: undefined;
  Perfil: undefined;
};

export type ClientStackParamList = {
  ClientTabs: undefined;
  ProviderList: { category: ServiceCategory };
  ProviderProfile: { providerId: string };
  Booking: { providerId: string; providerName: string; service: ServiceCategory };
  Review: { bookingId: string; providerId: string; providerName: string };
};

export type ProviderTabParamList = {
  Dashboard: undefined;
  Agenda: undefined;
  Perfil: undefined;
};
