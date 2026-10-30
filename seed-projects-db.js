require('dotenv/config');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seedRealData() {
  const cmsStore = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'data', 'cms-store.json'), 'utf8'));

  // 1. Seed Projects into PostgreSQL
  if (Array.isArray(cmsStore.portfolio) && cmsStore.portfolio.length > 0) {
    for (const p of cmsStore.portfolio) {
      await pool.query(
        `INSERT INTO projects (id, slug, title, client, industry, categories, "heroImage", gallery, challenge, scope, approach, outcome, metrics, featured, "order", status, "metaTitle", "metaDescription", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           slug = EXCLUDED.slug,
           title = EXCLUDED.title,
           client = EXCLUDED.client,
           industry = EXCLUDED.industry,
           categories = EXCLUDED.categories,
           "heroImage" = EXCLUDED."heroImage",
           gallery = EXCLUDED.gallery,
           challenge = EXCLUDED.challenge,
           scope = EXCLUDED.scope,
           approach = EXCLUDED.approach,
           outcome = EXCLUDED.outcome,
           metrics = EXCLUDED.metrics,
           featured = EXCLUDED.featured,
           "order" = EXCLUDED."order",
           status = EXCLUDED.status,
           "metaTitle" = EXCLUDED."metaTitle",
           "metaDescription" = EXCLUDED."metaDescription",
           "updatedAt" = NOW()`,
        [
          p.id,
          p.slug,
          p.title,
          p.client || 'Confidential Partner',
          p.industry || 'Technology',
          p.categories || ['Branding'],
          p.heroImage || '/images/p1.jpg',
          p.gallery || [],
          p.challenge || '',
          p.scope || [],
          p.approach || '',
          p.outcome || '',
          JSON.stringify(p.metrics || []),
          Boolean(p.featured),
          Number(p.order) || 1,
          p.status || 'published',
          p.metaTitle || '',
          p.metaDescription || '',
        ]
      );
    }
    console.log(`Successfully seeded ${cmsStore.portfolio.length} projects into PostgreSQL.`);
  }

  // 2. Check counts
  const res = await pool.query('SELECT count(*) FROM projects');
  console.log('Total projects in DB now:', res.rows[0].count);
}

seedRealData().catch(console.error).finally(() => pool.end());

