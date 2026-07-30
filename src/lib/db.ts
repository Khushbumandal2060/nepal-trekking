import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || "";

if (!connectionString) {
  console.warn("DATABASE_URL is not set. Postgres connection will fail until you set it.");
}

export const pool = new Pool({ connectionString });

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}

export async function initDb() {
  // Create users and bookings tables if they don't exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT now()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      tour_slug TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      people INTEGER,
      message TEXT,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT now()
    )
  `);
}

// Initialize on import (best-effort)
initDb().catch((err) => {
  console.error("Failed to initialize database:", err.message || err);
});
