export interface AgencyService {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  deliverables: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  tags: string[];
  results: string[];
  metrics: { label: string; value: string }[];
}

export const AGENCY_INFO = {
  name: "Launch Craft",
  handle: "launch.craft",
  tagline: "Digital Growth Agency",
  subTagline: "Branding • Social Media • Marketing. Helping businesses launch, grow & stand out.",
  specialOffer: "$0 Agency Fees for 7 Days — Experience our strategy before committing.",
  instagramUrl: "https://www.instagram.com/p/Dejl280EscV/?img_index=3&dlrf=MXNkb2VzN3BrcmkzMw%3D%3D",
  email: "hello@launchcraft.agency",
  location: "Islamabad, PK • Serving Global Clients",
  yearsActive: "4+ Years",
  brandsScaled: "50+",
  adSpendManaged: "$500K+",
  averageROAS: "4.8x",
};

export const SERVICES_9_GRID: AgencyService[] = [
  {
    id: "business-consulting",
    title: "Business Consulting",
    subtitle: "Strategy & Growth Planning",
    description:
      "Market feasibility, unit economics analysis, and bespoke scale roadmaps tailored to your industry positioning.",
    iconName: "TrendingUp",
    deliverables: ["Growth Roadmapping", "Competitor Intelligence", "Market Opportunity Audit"],
  },
  {
    id: "brand-strategy",
    title: "Brand Strategy",
    subtitle: "Positioning & Identity",
    description:
      "Clarify your unique value proposition, tone of voice, visual narrative, and customer archetype to dominate mindshare.",
    iconName: "Sparkles",
    deliverables: ["Brand Core & Archetypes", "Positioning Statement", "Tone of Voice Guide"],
  },
  {
    id: "logo-graphic-design",
    title: "Logo & Graphic Design",
    subtitle: "Creative Visuals",
    description:
      "High-end editorial vector logos, typography guidelines, collateral packages, and social aesthetic templates.",
    iconName: "Palette",
    deliverables: ["Vector Logo Suite", "Color & Typography Systems", "Marketing Assets Package"],
  },
  {
    id: "social-media",
    title: "Social Media Management",
    subtitle: "Setup, Content & Growth",
    description:
      "Full-service Instagram, LinkedIn & TikTok content creation, carousel designs, reel editing, and community nurturing.",
    iconName: "Share2",
    deliverables: ["Monthly Content Calendars", "High-Converting Reels/Carousels", "Community Engagement"],
  },
  {
    id: "meta-ads",
    title: "Meta Ads",
    subtitle: "Facebook & Instagram Ads",
    description:
      "Targeted paid ad funnels, scroll-stopping UGC creatives, pixel event tracking, and retargeting systems that convert.",
    iconName: "Target",
    deliverables: ["Full-Funnel Campaign Architecture", "Creative A/B Split Testing", "ROAS Optimization"],
  },
  {
    id: "google-ads",
    title: "Google Ads",
    subtitle: "Targeted Search & PMax Campaigns",
    description:
      "High-intent search keyword bidding, Performance Max campaigns, conversion rate tracking, and negative keyword filtering.",
    iconName: "Search",
    deliverables: ["Search & Shopping Ads", "Negative Keyword Scrubbing", "Conversion Tracking Setup"],
  },
  {
    id: "web-design-dev",
    title: "Website Design & Development",
    subtitle: "WordPress & Custom Web Platforms",
    description:
      "Next.js, Tailwind CSS and modern CMS platforms built for sub-second speeds, editorial visual appeal, and high conversions.",
    iconName: "Code2",
    deliverables: ["Responsive Mobile-First UI/UX", "Next.js / WordPress Engineering", "Technical SEO Foundations"],
  },
  {
    id: "seo-optimization",
    title: "SEO",
    subtitle: "Website, Local & Social SEO",
    description:
      "Rank on page 1 for high-value buying keywords with on-page schema, technical performance tuning, and local Google profiles.",
    iconName: "Gauge",
    deliverables: ["On-Page & Schema Markup", "Local Google Business Profile", "High-Authority Keyword Research"],
  },
  {
    id: "ecommerce-setup",
    title: "E-commerce Setup",
    subtitle: "Online Stores & Product Launch",
    description:
      "Turnkey Shopify and headless commerce storefronts with optimized checkout flows, upsell triggers, and analytics pipelines.",
    iconName: "ShoppingBag",
    deliverables: ["Shopify & Custom Store Build", "High-Converting Checkout Funnels", "Product Launch Strategy"],
  },
];

export const WORKFLOW_4_STEPS = [
  {
    step: "01",
    title: "Discover",
    tagline: "We understand your business, goals, and audience.",
    description:
      "We dive deep into your market dynamics, audit past marketing campaigns, analyze competitors, and identify friction points holding your brand back.",
  },
  {
    step: "02",
    title: "Strategize",
    tagline: "We create a tailored growth plan for your brand.",
    description:
      "No cookie-cutter templates. We architect a bespoke roadmap defining creative angles, ad budgets, content pillars, and high-converting funnel mechanics.",
  },
  {
    step: "03",
    title: "Execute",
    tagline: "Bringing your ideas to life with creative solutions.",
    description:
      "Our team launches your visual identity, produces editorial content, runs high-intent ad campaigns, and deploys high-speed web infrastructure.",
  },
  {
    step: "04",
    title: "Optimize",
    tagline: "We track, analyze, and refine to maximize results.",
    description:
      "Continuous growth through data. We monitor ROAS, LTV, conversion rates, and SEO traction, doubling down on what drives the highest revenue.",
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "lumina-wellness",
    title: "Scaling Lumina Organics to $120k/mo with Meta Ads & Editorial Redesign",
    client: "Lumina Organics",
    category: "Meta Ads • E-Commerce • Brand Strategy",
    tagline: "4.6x ROAS and +140% organic reach increase within 90 days.",
    description:
      "Lumina was struggling with rising acquisition costs and stale creative angles. Launch Craft engineered a full rebrand, produced viral educational carousels, and revamped the Shopify store checkout flow.",
    image: "/images/p4.jpg",
    tags: ["Meta Ads", "Brand Identity", "Shopify Store", "Content Creation"],
    results: ["+140% Organic Reach", "4.6x Blended ROAS", "-32% Customer Acquisition Cost"],
    metrics: [
      { label: "Revenue Lift", value: "+185%" },
      { label: "Average ROAS", value: "4.6x" },
      { label: "Checkout Conversion", value: "3.8%" },
    ],
  },
  {
    id: "veritas-consulting",
    title: "B2B Brand Positioning & Custom Next.js Platform for Veritas Growth",
    client: "Veritas Growth Capital",
    category: "Web Development • Brand Strategy • SEO",
    tagline: "Generated 42 qualified enterprise inbound leads in the first 60 days.",
    description:
      "A complete zero-to-one transformation for a boutique investment advisory firm. We designed an editorial visual identity, crafted high-authority thought-leadership content, and built a sub-second Next.js digital presence.",
    image: "/images/p5.jpg",
    tags: ["Next.js Platform", "Editorial Branding", "LinkedIn Marketing", "Technical SEO"],
    results: ["42 Enterprise Leads", "100/100 Lighthouse Performance", "Page 1 Google Rankings"],
    metrics: [
      { label: "Lead Influx", value: "42 Inbounds" },
      { label: "Page Speed", value: "0.4s LCP" },
      { label: "Organic Search Lift", value: "+310%" },
    ],
  },
];
