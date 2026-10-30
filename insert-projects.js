require('dotenv/config');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function insertProjects() {
  const cms = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'data', 'cms-store.json'), 'utf8'));
  const projs = cms.portfolio || [];
  console.log(`Found ${projs.length} projects in cms-store.json`);

  for (const p of projs) {
    const id = p.id || `proj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const slug = p.slug;
    const title = p.title;
    const client = p.client || 'Client';
    const industry = p.industry || 'Tech';
    const categories = p.categories || ['Branding'];
    const heroImage = p.heroImage || '/images/p1.jpg';
    const gallery = p.gallery || [];
    const challenge = p.challenge || '';
    const scope = p.scope || [];
    const approach = p.approach || '';
    const outcome = p.outcome || '';
    const metrics = JSON.stringify(p.metrics || []);
    const featured = Boolean(p.featured);
    const order = Number(p.order) || 1;
    const status = p.status || 'published';
    const metaTitle = p.metaTitle || '';
    const metaDescription = p.metaDescription || '';

    await pool.query(
      `INSERT INTO projects (id, slug, title, client, industry, categories, "heroImage", gallery, challenge, scope, approach, outcome, metrics, featured, "order", status, "metaTitle", "metaDescription", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW(), NOW())
       ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title`,
      [id, slug, title, client, industry, categories, heroImage, gallery, challenge, scope, approach, outcome, metrics, featured, order, status, metaTitle, metaDescription]
    );
    console.log(`Inserted project: ${title} (${slug})`);
  }

  const res = await pool.query('SELECT count(*) FROM projects');
  console.log('Total projects in DB now:', res.rows[0].count);
}

insertProjects().catch(console.error).finally(() => pool.end());

