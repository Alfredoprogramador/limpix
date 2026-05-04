/**
 * Database service for WEB using localStorage
 * This mimics the mobile SQLite API but stores data in browser localStorage
 */
import { Booking, Review, ServiceProvider, User, ServiceCategory, BookingStatus } from '../types';

const STORAGE_KEYS = {
  USERS: 'limpix_users',
  PROVIDERS: 'limpix_providers',
  BOOKINGS: 'limpix_bookings',
  REVIEWS: 'limpix_reviews',
  INITIALIZED: 'limpix_initialized',
};

// ─── Init ──────────────────────────────────────────────────────────────────────
export async function initDatabase(): Promise<void> {
  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);

  if (!initialized) {
    // Initialize empty stores
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([]));

    // Seed demo data
    await seedDemoData();

    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

// ─── Seed Demo Data ────────────────────────────────────────────────────────────
async function seedDemoData(): Promise<void> {
  const demoProviders: Array<User & ServiceProvider> = [
    {
      id: 'p1',
      name: 'Maria Silva',
      email: 'maria@limpix.com',
      phone: '11999990001',
      role: 'provider',
      address: 'Rua das Flores, 100',
      createdAt: new Date().toISOString(),
      services: ['limpeza'],
      description: 'Profissional de limpeza com 8 anos de experiência. Faxina completa, higienização e organização.',
      city: 'São Paulo',
      neighborhood: 'Vila Madalena',
      latitude: -23.5505,
      longitude: -46.6333,
      whatsapp: '11999990001',
      available: true,
      priceRange: 'R$ 80 – R$ 200',
      rating: 4.8,
      reviewCount: 42,
    },
    {
      id: 'p2',
      name: 'João Costa',
      email: 'joao@limpix.com',
      phone: '11999990002',
      role: 'provider',
      address: 'Av. Paulista, 500',
      createdAt: new Date().toISOString(),
      services: ['pintura', 'pedreiro'],
      description: 'Pintor e pedreiro com mais de 15 anos de experiência. Serviço de qualidade e acabamento perfeito.',
      city: 'São Paulo',
      neighborhood: 'Bela Vista',
      latitude: -23.5618,
      longitude: -46.6561,
      whatsapp: '11999990002',
      available: true,
      priceRange: 'R$ 150 – R$ 500',
      rating: 4.6,
      reviewCount: 28,
    },
    {
      id: 'p3',
      name: 'Carlos Santos',
      email: 'carlos@limpix.com',
      phone: '11999990003',
      role: 'provider',
      address: 'Rua Augusta, 200',
      createdAt: new Date().toISOString(),
      services: ['encanador'],
      description: 'Encanador certificado. Resolvo vazamentos, instalo pias, vasos sanitários e chuveiros.',
      city: 'São Paulo',
      neighborhood: 'Consolação',
      latitude: -23.5489,
      longitude: -46.6388,
      whatsapp: '11999990003',
      available: true,
      priceRange: 'R$ 120 – R$ 400',
      rating: 4.7,
      reviewCount: 35,
    },
    {
      id: 'p4',
      name: 'André Lima',
      email: 'andre@limpix.com',
      phone: '11999990004',
      role: 'provider',
      address: 'Rua Oscar Freire, 300',
      createdAt: new Date().toISOString(),
      services: ['eletricista'],
      description: 'Eletricista formado com NR10. Instalações, manutenção e projetos elétricos residenciais.',
      city: 'São Paulo',
      neighborhood: 'Jardins',
      latitude: -23.5630,
      longitude: -46.6598,
      whatsapp: '11999990004',
      available: true,
      priceRange: 'R$ 100 – R$ 350',
      rating: 4.9,
      reviewCount: 61,
    },
    {
      id: 'p5',
      name: 'Fernanda Oliveira',
      email: 'fernanda@limpix.com',
      phone: '11999990005',
      role: 'provider',
      address: 'Rua Harmonia, 50',
      createdAt: new Date().toISOString(),
      services: ['estofado', 'limpeza'],
      description: 'Especialista em higienização e reforma de estofados. Sofás, cadeiras, poltronas e colchões.',
      city: 'São Paulo',
      neighborhood: 'Vila Madalena',
      latitude: -23.5540,
      longitude: -46.6900,
      whatsapp: '11999990005',
      available: true,
      priceRange: 'R$ 100 – R$ 300',
      rating: 4.5,
      reviewCount: 19,
    },
    {
      id: 'p6',
      name: 'Roberto Alves',
      email: 'roberto@limpix.com',
      phone: '11999990006',
      role: 'provider',
      address: 'Rua Teodoro Sampaio, 800',
      createdAt: new Date().toISOString(),
      services: ['pedreiro', 'pintura'],
      description: 'Pedreiro com experiência em reformas, revestimentos, azulejos e pisos.',
      city: 'São Paulo',
      neighborhood: 'Pinheiros',
      latitude: -23.5640,
      longitude: -46.6812,
      whatsapp: '11999990006',
      available: false,
      priceRange: 'R$ 200 – R$ 800',
      rating: 4.4,
      reviewCount: 23,
    },
    {
      id: 'p7',
      name: 'Lucas Monteiro',
      email: 'lucas@limpix.com',
      phone: '11999990007',
      role: 'provider',
      address: 'Rua Clélia, 320',
      createdAt: new Date().toISOString(),
      services: ['montador'],
      description: 'Montador de móveis com 6 anos de experiência. Armários, estantes, camas, guarda-roupas e móveis de escritório.',
      city: 'São Paulo',
      neighborhood: 'Lapa',
      latitude: -23.5274,
      longitude: -46.7040,
      whatsapp: '11999990007',
      available: true,
      priceRange: 'R$ 80 – R$ 250',
      rating: 4.7,
      reviewCount: 31,
    },
  ];

  const users: User[] = [];
  const providers: ServiceProvider[] = [];

  for (const p of demoProviders) {
    users.push({
      id: p.id,
      name: p.name,
      email: p.email,
      phone: p.phone,
      role: p.role,
      address: p.address,
      createdAt: p.createdAt,
    });
    providers.push(p);
  }

  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(providers));
}

// ─── Users ─────────────────────────────────────────────────────────────────────
export async function createUser(user: User): Promise<void> {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]') as User[];
  users.push(user);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]') as User[];
  return users.find(u => u.email === email) ?? null;
}

export async function getUserById(id: string): Promise<User | null> {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]') as User[];
  return users.find(u => u.id === id) ?? null;
}

export async function updateUser(user: Partial<User> & { id: string }): Promise<void> {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]') as User[];
  const index = users.findIndex(u => u.id === user.id);
  if (index !== -1) {
    users[index] = { ...users[index], ...user };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
}

// ─── Providers ─────────────────────────────────────────────────────────────────
export async function createProvider(provider: ServiceProvider): Promise<void> {
  const providers = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROVIDERS) || '[]') as ServiceProvider[];
  const index = providers.findIndex(p => p.id === provider.id);
  if (index !== -1) {
    providers[index] = provider;
  } else {
    providers.push(provider);
  }
  localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(providers));
}

export async function updateProvider(provider: Partial<ServiceProvider> & { id: string }): Promise<void> {
  const providers = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROVIDERS) || '[]') as ServiceProvider[];
  const index = providers.findIndex(p => p.id === provider.id);
  if (index !== -1) {
    providers[index] = { ...providers[index], ...provider };
    localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(providers));
  }
}

export async function getProviders(service?: ServiceCategory): Promise<ServiceProvider[]> {
  const providers = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROVIDERS) || '[]') as ServiceProvider[];

  if (service) {
    return providers.filter(p => p.services.includes(service));
  }
  return providers;
}

export async function getProviderById(id: string): Promise<ServiceProvider | null> {
  const providers = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROVIDERS) || '[]') as ServiceProvider[];
  return providers.find(p => p.id === id) ?? null;
}

// ─── Bookings ──────────────────────────────────────────────────────────────────
export async function createBooking(booking: Booking): Promise<void> {
  const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]') as Booking[];
  bookings.push(booking);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
}

export async function getBookingsByClient(clientId: string): Promise<Booking[]> {
  const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]') as Booking[];
  return bookings.filter(b => b.clientId === clientId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getBookingsByProvider(providerId: string): Promise<Booking[]> {
  const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]') as Booking[];
  return bookings.filter(b => b.providerId === providerId).sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`).getTime();
    const dateB = new Date(`${b.date} ${b.time}`).getTime();
    return dateA - dateB;
  });
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<void> {
  const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]') as Booking[];
  const index = bookings.findIndex(b => b.id === id);
  if (index !== -1) {
    bookings[index].status = status;
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]') as Booking[];
  return bookings.find(b => b.id === id) ?? null;
}

// ─── Reviews ───────────────────────────────────────────────────────────────────
export async function createReview(review: Review): Promise<void> {
  const reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]') as Review[];
  reviews.push(review);
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));

  // Update provider rating average
  const providerReviews = reviews.filter(r => r.providerId === review.providerId);
  const avgRating = providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length;

  const providers = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROVIDERS) || '[]') as ServiceProvider[];
  const providerIndex = providers.findIndex(p => p.id === review.providerId);
  if (providerIndex !== -1) {
    providers[providerIndex].rating = Math.round(avgRating * 10) / 10;
    providers[providerIndex].reviewCount = providerReviews.length;
    localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(providers));
  }
}

export async function getReviewsByProvider(providerId: string): Promise<Review[]> {
  const reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]') as Review[];
  return reviews.filter(r => r.providerId === providerId).sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getReviewByBooking(bookingId: string): Promise<Review | null> {
  const reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]') as Review[];
  return reviews.find(r => r.bookingId === bookingId) ?? null;
}
