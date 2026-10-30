require('dotenv/config');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function verify() {
  // Check tables count
  const tables = ['services', 'projects', 'jobs', 'applications', 'leads', 'subscribers', 'bookings', 'booking_schedules', 'settings'];
  console.log('--- POSTGRESQL TABLES VERIFICATION ---');
  for (const t of tables) {
    const res = await pool.query('SELECT COUNT(*) FROM ' + t);
    console.log(`${t}:`, res.rows[0].count);
  }
}

verify().catch(console.error).finally(() => pool.end());

