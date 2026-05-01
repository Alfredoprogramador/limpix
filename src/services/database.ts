/**
 * Database service using expo-sqlite for persistent local storage.
 * All tables: users, providers, bookings, reviews.
 */
import * as SQLite from 'expo-sqlite';
import { Booking, Review, ServiceProvider, User } from '../types';

const DB_NAME = 'limpix.db';

let _db: SQLite.SQLiteDatabase | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!_db) {
    _db = await SQLite.openDatabaseAsync(DB_NAME);
  }
  return _db;
}

// ─── Init ──────────────────────────────────────────────────────────────────────
export async function initDatabase(): Promise<void> {
  const db = await getDb();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      role TEXT NOT NULL,
      address TEXT,
      avatar TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS providers (
      id TEXT PRIMARY KEY NOT NULL,
      services TEXT NOT NULL,
      description TEXT NOT NULL,
      city TEXT NOT NULL,
      neighborhood TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      whatsapp TEXT NOT NULL,
      available INTEGER NOT NULL DEFAULT 1,
      priceRange TEXT NOT NULL,
      rating REAL NOT NULL DEFAULT 0,
      reviewCount INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY NOT NULL,
      clientId TEXT NOT NULL,
      clientName TEXT NOT NULL,
      providerId TEXT NOT NULL,
      providerName TEXT NOT NULL,
      service TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pendente',
      totalPrice TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY NOT NULL,
      bookingId TEXT NOT NULL,
      clientId TEXT NOT NULL,
      clientName TEXT NOT NULL,
      providerId TEXT NOT NULL,
      rating REAL NOT NULL,
      comment TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);

  // Seed demo providers if table is empty
  const count = await db.getFirstAsync<{ c: number }>('SELECT COUNT(*) as c FROM users');
  if ((count?.c ?? 0) === 0) {
    await seedDemoData(db);
  }
}

// ─── Seed Demo Data ────────────────────────────────────────────────────────────
async function seedDemoData(db: SQLite.SQLiteDatabase): Promise<void> {
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

  for (const p of demoProviders) {
    await db.runAsync(
      `INSERT OR IGNORE INTO users (id, name, email, phone, role, address, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [p.id, p.name, p.email, p.phone, p.role, p.address ?? '', p.createdAt]
    );
    await db.runAsync(
      `INSERT OR IGNORE INTO providers (id, services, description, city, neighborhood, latitude, longitude, whatsapp, available, priceRange, rating, reviewCount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.id,
        JSON.stringify(p.services),
        p.description,
        p.city,
        p.neighborhood,
        p.latitude ?? null,
        p.longitude ?? null,
        p.whatsapp,
        p.available ? 1 : 0,
        p.priceRange,
        p.rating,
        p.reviewCount,
      ]
    );
  }
}

// ─── Users ─────────────────────────────────────────────────────────────────────
export async function createUser(user: User): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO users (id, name, email, phone, role, address, avatar, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [user.id, user.name, user.email, user.phone, user.role, user.address ?? '', user.avatar ?? '', user.createdAt]
  );
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<User>('SELECT * FROM users WHERE email = ?', [email]);
  return row ?? null;
}

export async function getUserById(id: string): Promise<User | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<User>('SELECT * FROM users WHERE id = ?', [id]);
  return row ?? null;
}

export async function updateUser(user: Partial<User> & { id: string }): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE users SET name=?, phone=?, address=? WHERE id=?`,
    [user.name ?? '', user.phone ?? '', user.address ?? '', user.id]
  );
}

// ─── Providers ─────────────────────────────────────────────────────────────────
export async function createProvider(provider: ServiceProvider): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT OR REPLACE INTO providers (id, services, description, city, neighborhood, latitude, longitude, whatsapp, available, priceRange, rating, reviewCount)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      provider.id,
      JSON.stringify(provider.services),
      provider.description,
      provider.city,
      provider.neighborhood,
      provider.latitude ?? null,
      provider.longitude ?? null,
      provider.whatsapp,
      provider.available ? 1 : 0,
      provider.priceRange,
      provider.rating,
      provider.reviewCount,
    ]
  );
}

export async function updateProvider(provider: Partial<ServiceProvider> & { id: string }): Promise<void> {
  const db = await getDb();
  if (provider.services !== undefined) {
    await db.runAsync(
      `UPDATE providers SET services=?, description=?, city=?, neighborhood=?, whatsapp=?, available=?, priceRange=? WHERE id=?`,
      [
        JSON.stringify(provider.services),
        provider.description ?? '',
        provider.city ?? '',
        provider.neighborhood ?? '',
        provider.whatsapp ?? '',
        provider.available ? 1 : 0,
        provider.priceRange ?? '',
        provider.id,
      ]
    );
  }
}

interface ProviderRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  address: string;
  avatar: string;
  createdAt: string;
  services: string;
  description: string;
  city: string;
  neighborhood: string;
  latitude: number | null;
  longitude: number | null;
  whatsapp: string;
  available: number;
  priceRange: string;
  rating: number;
  reviewCount: number;
}

function rowToProvider(row: ProviderRow): ServiceProvider {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: 'provider',
    address: row.address,
    avatar: row.avatar,
    createdAt: row.createdAt,
    services: JSON.parse(row.services),
    description: row.description,
    city: row.city,
    neighborhood: row.neighborhood,
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    whatsapp: row.whatsapp,
    available: row.available === 1,
    priceRange: row.priceRange,
    rating: row.rating,
    reviewCount: row.reviewCount,
  };
}

export async function getProviders(service?: string): Promise<ServiceProvider[]> {
  const db = await getDb();
  let rows: ProviderRow[];
  if (service) {
    rows = await db.getAllAsync<ProviderRow>(
      `SELECT u.*, p.services, p.description, p.city, p.neighborhood, p.latitude, p.longitude,
              p.whatsapp, p.available, p.priceRange, p.rating, p.reviewCount
       FROM users u JOIN providers p ON u.id = p.id
       WHERE u.role = 'provider' AND p.services LIKE ?`,
      [`%${service}%`]
    );
  } else {
    rows = await db.getAllAsync<ProviderRow>(
      `SELECT u.*, p.services, p.description, p.city, p.neighborhood, p.latitude, p.longitude,
              p.whatsapp, p.available, p.priceRange, p.rating, p.reviewCount
       FROM users u JOIN providers p ON u.id = p.id
       WHERE u.role = 'provider'`
    );
  }
  return rows.map(rowToProvider);
}

export async function getProviderById(id: string): Promise<ServiceProvider | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<ProviderRow>(
    `SELECT u.*, p.services, p.description, p.city, p.neighborhood, p.latitude, p.longitude,
            p.whatsapp, p.available, p.priceRange, p.rating, p.reviewCount
     FROM users u JOIN providers p ON u.id = p.id
     WHERE u.id = ?`,
    [id]
  );
  return row ? rowToProvider(row) : null;
}

// ─── Bookings ──────────────────────────────────────────────────────────────────
export async function createBooking(booking: Booking): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO bookings (id, clientId, clientName, providerId, providerName, service, date, time, address, city, notes, status, totalPrice, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      booking.id, booking.clientId, booking.clientName, booking.providerId,
      booking.providerName, booking.service, booking.date, booking.time,
      booking.address, booking.city, booking.notes, booking.status,
      booking.totalPrice ?? '', booking.createdAt,
    ]
  );
}

export async function getBookingsByClient(clientId: string): Promise<Booking[]> {
  const db = await getDb();
  return db.getAllAsync<Booking>(
    'SELECT * FROM bookings WHERE clientId = ? ORDER BY createdAt DESC',
    [clientId]
  );
}

export async function getBookingsByProvider(providerId: string): Promise<Booking[]> {
  const db = await getDb();
  return db.getAllAsync<Booking>(
    'SELECT * FROM bookings WHERE providerId = ? ORDER BY date ASC, time ASC',
    [providerId]
  );
}

export async function updateBookingStatus(id: string, status: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Booking>('SELECT * FROM bookings WHERE id = ?', [id]);
  return row ?? null;
}

// ─── Reviews ───────────────────────────────────────────────────────────────────
export async function createReview(review: Review): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO reviews (id, bookingId, clientId, clientName, providerId, rating, comment, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [review.id, review.bookingId, review.clientId, review.clientName, review.providerId, review.rating, review.comment, review.createdAt]
  );

  // Update provider rating average
  const avgRow = await db.getFirstAsync<{ avg: number; cnt: number }>(
    'SELECT AVG(rating) as avg, COUNT(*) as cnt FROM reviews WHERE providerId = ?',
    [review.providerId]
  );
  if (avgRow) {
    await db.runAsync(
      'UPDATE providers SET rating = ?, reviewCount = ? WHERE id = ?',
      [Math.round(avgRow.avg * 10) / 10, avgRow.cnt, review.providerId]
    );
  }
}

export async function getReviewsByProvider(providerId: string): Promise<Review[]> {
  const db = await getDb();
  return db.getAllAsync<Review>(
    'SELECT * FROM reviews WHERE providerId = ? ORDER BY createdAt DESC',
    [providerId]
  );
}

export async function getReviewByBooking(bookingId: string): Promise<Review | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Review>('SELECT * FROM reviews WHERE bookingId = ?', [bookingId]);
  return row ?? null;
}
