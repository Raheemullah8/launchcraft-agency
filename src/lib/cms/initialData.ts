import { CMSData } from "./types";

export const initialCMSData: CMSData = {
  services: [
    {
      id: "srv-1",
      slug: "business-counseling",
      title: "Business Counseling",
      icon: "Compass",
      shortBenefit: "Strategic advisory to align business models, unit economics, and operational clarity before market entry.",
      heroHeadline: "Clarity Before Capital: Navigating Critical Growth Transitions",
      valueProp: "We help founders and executive teams pressure-test their revenue models, pinpoint product-market alignment, and navigate complex business pivots with confidence.",
      whoItHelps: [
        "Founders preparing for seed or Series A capital rounds",
        "Established SMB owners looking to unlock stagnant revenue lines",
        "Leadership teams evaluating corporate spin-offs or restructuring",
        "Entrepreneurs seeking objective strategic mentorship and governance"
      ],
      deliverables: [
        "Comprehensive Business Model Diagnostics",
        "Unit Economics & Margin Optimization Playbook",
        "Go-to-Market Readiness Assessment",
        "Competitive Moat & Positioning Architecture",
        "Executive Strategy Sessions & Quarterly Roadmaps"
      ],
      workflowSteps: [
        { step: 1, title: "Diagnostic Audit", description: "Deep dive into financial structures, customer dynamics, and market positioning." },
        { step: 2, title: "Hypothesis Formulation", description: "Identifying high-leverage growth levers and eliminating operational friction points." },
        { step: 3, title: "Strategic Roadmap", description: "Delivering a pragmatic, sequenced execution blueprint for leadership." },
        { step: 4, title: "Advisory Cadence", description: "Bi-weekly advisory sessions to track milestones and pivot where necessary." }
      ],
      faqs: [
        {
          question: "How does LaunchCraft differ from traditional management consultancies?",
          answer: "We pair high-level strategic counsel with hands-on brand and engineering capability, ensuring strategies are immediately actionable rather than theoretical slide decks."
        },
        {
          question: "What is the typical engagement duration?",
          answer: "Engagements typically run across 3-month focused advisory sprints or ongoing fractional advisory retainers tailored to your milestone targets."
        }
      ],
      order: 1,
      status: "published",
      metaTitle: "Business Counseling & Strategic Advisory | LaunchCraft",
      metaDescription: "Objective strategic advisory for founders and leadership teams. Clarify unit economics, business models, and market positioning."
    },
    {
      id: "srv-2",
      slug: "startup-support",
      title: "Startup Support",
      icon: "Rocket",
      shortBenefit: "End-to-end founder enablement from pre-seed validation through MVP delivery and initial customer traction.",
      heroHeadline: "From Zero to Traction: De-Risking Early-Stage Venture Execution",
      valueProp: "Fast-track early-stage growth without burning scarce runway on misaligned hires or unvalidated product builds.",
      whoItHelps: [
        "First-time founders building their inaugural venture",
        "Technical creators needing commercialization and brand expertise",
        "Bootstrapped ventures requiring accelerated MVP launch assistance",
        "Accelerators seeking vetted venture studio capabilities for portfolio companies"
      ],
      deliverables: [
        "Customer Validation & Problem Discovery Synthesis",
        "Lean MVP Scoping & Rapid Architecture Blueprint",
        "Investor Pitch Deck Narrative & Data Room Readiness",
        "Initial Customer Acquisition Funnel",
        "Foundational Tech Stack & Operational Tooling Setup"
      ],
      workflowSteps: [
        { step: 1, title: "Validation Sprint", description: "Direct customer interviews, demand signal testing, and risk de-coupling." },
        { step: 2, title: "Lean Prototyping", description: "Iterative wireframing and technical scoping focused solely on high-value features." },
        { step: 3, title: "Alpha Launch", description: "Controlled deployment to an exclusive beta cohort to capture qualitative signals." },
        { step: 4, title: "Traction Iteration", description: "Rapid refinement loops based on real retention and activation metrics." }
      ],
      faqs: [
        {
          question: "Do you take equity in exchange for services?",
          answer: "Our standard engagements operate on professional service retainers. In select strategic partnerships, hybrid advisory and equity structures are considered."
        },
        {
          question: "How quickly can we get an MVP to market?",
          answer: "Our focused startup sprints target working, deployable MVPs within 6 to 10 weeks depending on technical complexity."
        }
      ],
      order: 2,
      status: "published",
      metaTitle: "Startup Support & Venture Studio Services | LaunchCraft",
      metaDescription: "Accelerate your startup from validation to market traction with LaunchCraft. MVP scoping, pitch narratives, and early customer acquisition."
    },
    {
      id: "srv-3",
      slug: "branding-services",
      title: "Branding Services",
      icon: "Sparkles",
      shortBenefit: "Distinctive editorial brand identities, bespoke typography, and design systems that command authority.",
      heroHeadline: "Command Authority: Visual & Editorial Identity That Resonates",
      valueProp: "In crowded markets, mediocre design is an invisible tax on growth. We forge disciplined, high-recall brand identities built to last.",
      whoItHelps: [
        "High-growth ventures outgrowing their placeholder branding",
        "B2B service providers seeking premium market positioning",
        "Direct-to-consumer labels aiming for editorial distinction",
        "Companies undergoing strategic mergers or corporate repositioning"
      ],
      deliverables: [
        "Core Brand Strategy, Tone of Voice & Editorial Manifesto",
        "Distinctive Logomark, Monogram & Responsive Signature System",
        "Curated Color Taxonomy & Typographic Scale",
        "Comprehensive Digital Design System & Component Library",
        "Brand Guidelines & Multi-Channel Collateral Templates"
      ],
      workflowSteps: [
        { step: 1, title: "Brand Archetype Exploration", description: "Uncovering your competitive whitespace and authentic emotional resonance." },
        { step: 2, title: "Visual Directions", description: "Presenting contrasting high-fidelity concepts with contextual mockups." },
        { step: 3, title: "Refinement & Craft", description: "Micro-typography adjustments, color contrast validation, and icon drafting." },
        { step: 4, title: "System Delivery", description: "Compiling vector assets, web tokens, and exhaustive guidelines for all teams." }
      ],
      faqs: [
        {
          question: "What assets are delivered upon completion?",
          answer: "You receive complete master vector files (SVG, EPS, PDF), responsive web icon sets, custom typography licensing recommendations, and an exhaustive digital brand book."
        },
        {
          question: "Do you help apply the branding to marketing collateral?",
          answer: "Yes, our team creates presentation decks, social templates, email stationery, and physical packaging systems aligned with the new identity."
        }
      ],
      order: 3,
      status: "published",
      metaTitle: "Brand Strategy & Visual Identity Design | LaunchCraft",
      metaDescription: "Editorial brand identity, visual systems, and typography that command authority. Built for modern digital brands."
    },
    {
      id: "srv-4",
      slug: "marketing-strategy",
      title: "Marketing Strategy",
      icon: "TrendingUp",
      shortBenefit: "Full-funnel customer acquisition, content architecture, and conversion rate optimization tailored to sustainable growth.",
      heroHeadline: "Sustainable Growth: High-Intent Acquisition Without Ad Waste",
      valueProp: "Escape the cycle of vanity metrics. We construct disciplined, compounding acquisition engines across paid, organic, and lifecycle channels.",
      whoItHelps: [
        "Companies experiencing customer acquisition cost (CAC) inflation",
        "Brands seeking to reduce single-channel advertising dependency",
        "Product teams with strong conversion rates needing amplified top-of-funnel reach",
        "B2B enterprises wanting high-touch account-based pipeline generation"
      ],
      deliverables: [
        "Full-Funnel Acquisition Audit & Attribution Modeling",
        "High-Intent Paid Search & Social Architecture",
        "Compounding SEO & Content Strategy Framework",
        "Lifecycle Email & Retention Nurture Sequences",
        "Conversion Rate Optimization (CRO) Heatmap & Experiment Roadmap"
      ],
      workflowSteps: [
        { step: 1, title: "Attribution Audit", description: "Mapping every customer touchpoint and verifying analytics data accuracy." },
        { step: 2, title: "Channel Prioritization", description: "Selecting the top 2-3 compounding acquisition channels for immediate focus." },
        { step: 3, title: "Campaign Deployment", description: "Structuring creative assets, audience targeting, and bespoke landing experiences." },
        { step: 4, title: "Quantitative Optimization", description: "Weekly sprint cycles analyzing CAC, LTV, and downstream revenue contribution." }
      ],
      faqs: [
        {
          question: "Which advertising platforms do you specialize in?",
          answer: "We deploy disciplined media strategies across Google Search, LinkedIn Ads, Meta, and niche industry networks, prioritized strictly by audience intent."
        },
        {
          question: "How do you track conversion without third-party cookies?",
          answer: "We implement privacy-compliant server-side conversions API (CAPI) and first-party attribution infrastructure."
        }
      ],
      order: 4,
      status: "published",
      metaTitle: "Marketing Strategy & Growth Optimization | LaunchCraft",
      metaDescription: "Full-funnel customer acquisition, conversion optimization, and attribution architecture designed for long-term compounding growth."
    },
    {
      id: "srv-5",
      slug: "product-launch-consulting",
      title: "Product Launch Consulting",
      icon: "Layers",
      shortBenefit: "Go-to-market choreography that coordinates narrative, timing, distribution, and press for maximum launch velocity.",
      heroHeadline: "Orchestrated Velocity: Turning Market Introductions Into Industry Events",
      valueProp: "A great product launched quietly is an opportunity squandered. We choreograph every day of your launch cycle to turn interest into revenue.",
      whoItHelps: [
        "SaaS startups unveiling major version upgrades or new tiers",
        "Consumer brands debuting new product collections",
        "Founders aiming for #1 Product of the Day on Product Hunt and press coverage",
        "Established enterprises introducing digital innovation initiatives"
      ],
      deliverables: [
        "Launch Sequence Timetable & Cross-Functional RACI Matrix",
        "Positioning Whitepaper & Press Kit Distribution Package",
        "VIP Waitlist & Early Access Viral Loop Mechanics",
        "Keynote Presentation & Product Demo Video Storyboarding",
        "Post-Launch Churn Mitigation & Feedback Assimilation Protocol"
      ],
      workflowSteps: [
        { step: 1, title: "Positioning & Hook", description: "Synthesizing the undeniable reason why your target market must care now." },
        { step: 2, title: "Pre-Launch Seeding", description: "Building community anticipation, creator briefing, and early access tiers." },
        { step: 3, title: "Launch Day Blitz", description: "Synchronized activation across communities, social channels, and press outlets." },
        { step: 4, title: "Momentum Sustained", description: "Converting launch day spikes into ongoing referral and search momentum." }
      ],
      faqs: [
        {
          question: "When should we begin planning our product launch?",
          answer: "Ideally 8 to 12 weeks prior to your target release date to ensure adequate audience seeding and distribution alignment."
        },
        {
          question: "Can you assist with community activation?",
          answer: "Yes, we architect Discord, Slack, and newsletter outreach sequences to mobilize your core champions."
        }
      ],
      order: 5,
      status: "published",
      metaTitle: "Product Launch Consulting & GTM Choreography | LaunchCraft",
      metaDescription: "Turn product introductions into industry events. Coordinated launch choreography, press readiness, and customer waitlists."
    },
    {
      id: "srv-6",
      slug: "website-online-presence-setup",
      title: "Website & Online Presence Setup",
      icon: "Monitor",
      shortBenefit: "High-performance editorial websites built on Next.js, engineered for lightning speed, accessibility, and conversion.",
      heroHeadline: "Digital Flagships: Speed, Accessibility, and Conversion-Driven Engineering",
      valueProp: "Your website is your agency's permanent digital headquarters. We engineer bespoke web platforms that rank high, load instantly, and turn visits into consultations.",
      whoItHelps: [
        "B2B service firms needing a modern digital flagship",
        "High-growth tech companies replacing cumbersome legacy platforms",
        "Agencies requiring high-end typography and bespoke editorial aesthetics",
        "Firms demanding WCAG 2.2 AA accessibility and top-tier SEO performance"
      ],
      deliverables: [
        "Next.js App Router Architecture with React Server Components",
        "Mobile-First Responsive Layouts (320px to 1440px+)",
        "Self-Hosted Font Loading & Zero Layout Shift (CLS < 0.1)",
        "Structured Data (Schema.org JSON-LD) for Search Authority",
        "Private Storage & Enterprise CMS Integration"
      ],
      workflowSteps: [
        { step: 1, title: "Information Architecture", description: "Mapping frictionless visitor paths directly to consultation booking." },
        { step: 2, title: "Design Prototyping", description: "Crafting editorial typography and responsive layouts without bloated graphics." },
        { step: 3, title: "Clean Engineering", description: "Production Next.js implementation with strict TypeScript and accessibility audits." },
        { step: 4, title: "Vercel / Node Deployment", description: "Zero-downtime deployment, DNS configuration, and performance budgeting." }
      ],
      faqs: [
        {
          question: "Can non-technical team members update site content?",
          answer: "Yes, all case studies, services, open jobs, and company data are managed through an intuitive, lightweight CMS admin portal."
        },
        {
          question: "How fast will the site load on mobile?",
          answer: "Our builds consistently score 90+ on Google Lighthouse with LCP under 2.5s and zero cumulative layout shift."
        }
      ],
      order: 6,
      status: "published",
      metaTitle: "Website Design & Web Development Services | LaunchCraft",
      metaDescription: "Bespoke editorial websites built on Next.js. Engineered for speed, WCAG accessibility, and qualified lead conversion."
    }
  ],
  portfolio: [
    {
      id: "work-1",
      slug: "lumina-capital-partners",
      title: "Lumina Capital Partners",
      client: "Lumina Capital",
      industry: "Venture Capital & Private Equity",
      categories: ["Branding", "Websites", "Consulting"],
      heroImage: "/images/p1.jpg",
      gallery: ["/images/p1.jpg", "/images/p2.jpg", "/images/p3.jpg"],
      challenge: "Lumina needed to reposition their visual identity and digital presence from a legacy conservative private equity firm into an agile early-stage climate tech fund commanding credibility with next-generation founders.",
      scope: ["Brand Repositioning", "Editorial Identity", "Next.js Web Platform", "Investor Portal Architecture"],
      approach: "We stripped away dense institutional clutter in favor of generous negative space, crisp architectural typography, and interactive thesis summaries that allow founders to navigate investment areas in seconds.",
      outcome: "A cohesive digital flagship that elevated fund visibility and established Lumina as a standout destination for climate tech founders.",
      metrics: [
        { label: "Founder Inquiries", value: "+148%" },
        { label: "Mobile Bounce Rate", value: "-36%" },
        { label: "Lighthouse Performance", value: "98/100" }
      ],
      featured: true,
      order: 1,
      status: "published",
      metaTitle: "Lumina Capital Partners Case Study | LaunchCraft",
      metaDescription: "How LaunchCraft transformed Lumina Capital's brand positioning and web presence for next-generation climate tech investments."
    },
    {
      id: "work-2",
      slug: "apex-os-platform-launch",
      title: "Apex OS Platform Launch",
      client: "Apex Systems",
      industry: "Enterprise SaaS & Developer Tooling",
      categories: ["Launch Campaigns", "Marketing", "Websites"],
      heroImage: "/images/p4.jpg",
      gallery: ["/images/p4.jpg", "/images/p5.jpg", "/images/p6.jpg"],
      challenge: "Apex was unveiling a breakthrough real-time collaboration engine for distributed engineering teams and needed a synchronized multi-channel launch to capture initial enterprise pilots.",
      scope: ["GTM Choreography", "Interactive Documentation Portal", "Product Hunt Campaign", "Conversion Rate Optimization"],
      approach: "We architected an invite-only early access release cycle supported by high-fidelity interactive product previews and direct technical storytelling that resonated with senior CTOs.",
      outcome: "Achieved the #1 Product of the Day on Product Hunt, driving hundreds of enterprise demo requests within 48 hours of public launch.",
      metrics: [
        { label: "Product Hunt Ranking", value: "#1 Day" },
        { label: "Enterprise Waitlist", value: "8,400+" },
        { label: "Demo Conversion Rate", value: "14.2%" }
      ],
      featured: true,
      order: 2,
      status: "published",
      metaTitle: "Apex OS Platform Launch Case Study | LaunchCraft",
      metaDescription: "Go-to-market choreography and technical documentation launch for enterprise SaaS platform Apex OS."
    },
    {
      id: "work-3",
      slug: "vanguard-atelier-identity",
      title: "Vanguard Atelier Identity System",
      client: "Vanguard Atelier",
      industry: "High-End Architectural Design",
      categories: ["Branding", "Social Media"],
      heroImage: "/images/p2.jpg",
      gallery: ["/images/p2.jpg", "/images/p3.jpg", "/images/p7.jpg"],
      challenge: "An internationally acclaimed interior architecture studio required a minimalist, editorial brand overhaul that let their photography take center stage while preserving subtle brand signatures.",
      scope: ["Monogram & Signature", "Bespoke Editorial Typography", "Print Collateral", "Social Grid Curation"],
      approach: "We developed a disciplined monochromatic brand taxonomy anchored by custom serif glyphs, blind debossed stationery, and an elevated social editorial framework.",
      outcome: "An enduring visual system that positioned the studio alongside the world's most prestigious luxury architectural consultancies.",
      metrics: [
        { label: "Press Features", value: "6 Global" },
        { label: "High-Net-Worth Leads", value: "+82%" },
        { label: "Brand Recall Score", value: "94%" }
      ],
      featured: true,
      order: 3,
      status: "published",
      metaTitle: "Vanguard Atelier Brand Identity | LaunchCraft",
      metaDescription: "Bespoke editorial brand identity and social curation for luxury architectural studio Vanguard Atelier."
    },
    {
      id: "work-4",
      slug: "strata-cloud-acquisition-funnel",
      title: "Strata Cloud Growth Architecture",
      client: "Strata Cloud",
      industry: "B2B Cloud Infrastructure",
      categories: ["Marketing", "SEO", "Consulting"],
      heroImage: "/images/p5.jpg",
      gallery: ["/images/p5.jpg", "/images/p6.jpg"],
      challenge: "Strata faced escalating pay-per-click costs and declining conversion efficiency across their paid customer acquisition funnels.",
      scope: ["Attribution Restructuring", "High-Intent SEO Silos", "Landing Page Rearchitecture", "Lifecycle Nurture"],
      approach: "We eliminated low-intent bidding, implemented server-side attribution, and published deep technical comparison guides tailored to DevOps leaders seeking cloud migration alternatives.",
      outcome: "Substantially decreased customer acquisition costs while multiplying pipeline qualification rates.",
      metrics: [
        { label: "Blended CAC Reduction", value: "-42%" },
        { label: "Organic Search Leads", value: "+210%" },
        { label: "Sales Pipeline Added", value: "$3.4M" }
      ],
      featured: false,
      order: 4,
      status: "published",
      metaTitle: "Strata Cloud Acquisition Architecture | LaunchCraft",
      metaDescription: "Customer acquisition cost reduction and organic search pipeline growth for B2B cloud infrastructure provider."
    },
    {
      id: "work-5",
      slug: "solis-biotech-rebrand",
      title: "Solis BioTech Digital Evolution",
      client: "Solis BioTechnologies",
      industry: "Biomedical & Life Sciences",
      categories: ["Branding", "Websites", "SEO"],
      heroImage: "/images/p3.jpg",
      gallery: ["/images/p3.jpg", "/images/p1.jpg"],
      challenge: "Solis required a modern scientific web portal to communicate their clinical trial findings to investors, research partners, and clinical participants.",
      scope: ["Visual Guidelines", "Next.js Scientific Portal", "WCAG 2.2 AA Compliance", "Research Library CMS"],
      approach: "Built a lightning-fast digital library featuring interactive data charts, clean typographic hierarchies, and full compliance with international digital accessibility standards.",
      outcome: "A widely praised portal that streamlined clinical recruitment and earned top accessibility ratings.",
      metrics: [
        { label: "WCAG Rating", value: "AA Pass" },
        { label: "Trial Enrollments", value: "+95%" },
        { label: "Page Speed Score", value: "99/100" }
      ],
      featured: false,
      order: 5,
      status: "published",
      metaTitle: "Solis BioTech Digital Evolution | LaunchCraft",
      metaDescription: "WCAG 2.2 AA compliant scientific portal and brand evolution for biomedical research leader."
    },
    {
      id: "work-6",
      slug: "modus-apparel-launch",
      title: "Modus Sustainable Goods Launch",
      client: "Modus Collective",
      industry: "Sustainable Consumer Goods",
      categories: ["Launch Campaigns", "Social Media", "Marketing"],
      heroImage: "/images/p6.jpg",
      gallery: ["/images/p6.jpg", "/images/p7.jpg"],
      challenge: "Modus needed to debut their zero-waste outerwear collection directly to consumer audiences without relying on deep promotional discounts.",
      scope: ["Launch Strategy", "Editorial Campaign Production", "VIP SMS Waitlist", "Conversion Funnel"],
      approach: "We centered the campaign around transparent supply chain provenance, documentary-style visual assets, and an exclusive drop schedule.",
      outcome: "The inaugural collection sold through its entire production batch within 72 hours of public release.",
      metrics: [
        { label: "Sellout Velocity", value: "72 Hours" },
        { label: "Email Opt-in Rate", value: "19.8%" },
        { label: "Average Order Value", value: "$280" }
      ],
      featured: false,
      order: 6,
      status: "published",
      metaTitle: "Modus Goods Launch Case Study | LaunchCraft",
      metaDescription: "Go-to-market drop strategy and campaign execution for sustainable goods collective Modus."
    }
  ],
  jobs: [
    {
      id: "job-1",
      slug: "senior-brand-strategist",
      title: "Senior Brand Strategist",
      department: "Strategy & Creative",
      location: "London, UK / Remote",
      workArrangement: "Hybrid",
      type: "Full-time",
      postedDate: "2026-10-15",
      summary: "Lead brand positioning, narrative architecture, and naming frameworks for venture-backed startups and premium enterprises.",
      responsibilities: [
        "Facilitate brand discovery workshops with executive founders and leadership teams",
        "Author comprehensive brand manifestos, positioning frameworks, and verbal identity guidelines",
        "Partner closely with design and engineering leads to ensure strategic fidelity throughout execution",
        "Lead client presentations and defend creative decisions with commercial rigor"
      ],
      qualifications: [
        "5+ years of demonstrable agency or studio brand strategy experience",
        "Exceptional editorial writing and narrative synthesis skills",
        "Proven track record of positioning high-growth technology or premium consumer brands",
        "High degree of emotional intelligence and comfortable leading executive stakeholders"
      ],
      deadline: "2026-11-30",
      status: "published"
    },
    {
      id: "job-2",
      slug: "lead-front-end-engineer",
      title: "Lead Front-End Engineer",
      department: "Engineering",
      location: "Remote (UK/EU/US East)",
      workArrangement: "Remote",
      type: "Full-time",
      postedDate: "2026-10-18",
      summary: "Architect blazing fast, accessible, and editorial web experiences using Next.js App Router, TypeScript, and modern CSS.",
      responsibilities: [
        "Lead technical development of client web flagships using Next.js App Router and React Server Components",
        "Enforce strict WCAG 2.2 AA accessibility standards and Lighthouse 90+ performance budgets",
        "Collaborate with visual designers to implement fluid, restrained micro-interactions",
        "Maintain code quality, automated test pipelines, and deployment infrastructure"
      ],
      qualifications: [
        "4+ years with modern React/Next.js and strong TypeScript foundations",
        "Deep command of semantic HTML, web performance profiling, and browser rendering lifecycles",
        "Experience building custom headless CMS integrations and resilient server actions",
        "Appreciation for micro-typography, negative space, and disciplined design systems"
      ],
      deadline: "2026-12-15",
      status: "published"
    },
    {
      id: "job-3",
      slug: "performance-growth-lead",
      title: "Performance & Growth Marketing Lead",
      department: "Growth",
      location: "Remote (UK/EU)",
      workArrangement: "Remote",
      type: "Full-time",
      postedDate: "2026-10-22",
      summary: "Own full-funnel customer acquisition, paid media strategy, and conversion optimization for high-growth client engagements.",
      responsibilities: [
        "Develop and execute high-intent paid search, LinkedIn, and social media campaigns",
        "Implement first-party attribution modeling and privacy-compliant conversion tracking",
        "Run disciplined weekly A/B testing sprints on landing page layouts and messaging",
        "Synthesize clear, actionable monthly growth reports for client executives"
      ],
      qualifications: [
        "4+ years managing significant paid budgets with verified ROI across B2B SaaS or premium DTC",
        "Expertise in Google Tag Manager, GA4, CAPI, and server-side tracking setups",
        "Strong quantitative reasoning coupled with creative copywriting intuition",
        "Commitment to ethical marketing free of misleading tricks or vanity metrics"
      ],
      deadline: "2026-11-25",
      status: "published"
    }
  ],
  applications: [],
  leads: [],
  subscribers: [],
  settings: {
    agencyName: "LaunchCraft",
    tagline: "From Idea to Impact.",
    heroHeadline: "Creative & Growth Partner for Modern Ambitious Brands.",
    heroSubheadline: "We partner with visionary founders and leadership teams to architect enduring brand identities, high-converting digital platforms, and disciplined growth campaigns.",
    email: "inquiries@launchcraft.agency",
    phone: "+44 (0) 20 7946 0192",
    address: "14 Berwick Street, Soho, London W1F 0PP",
    socials: [
      { platform: "Instagram", url: "https://www.instagram.com/launch.craft", handle: "@launch.craft" },
      { platform: "LinkedIn", url: "https://www.linkedin.com/company/launchcraft", handle: "LaunchCraft Agency" },
      { platform: "X / Twitter", url: "https://x.com/launchcraft", handle: "@launchcraft" },
      { platform: "GitHub", url: "https://github.com/launchcraft", handle: "launchcraft" }
    ],
    trustpilotUrl: "https://www.trustpilot.com/review/launchcraft.agency",
    trustpilotScore: 4.9,
    trustpilotReviewCount: 38,
    bookingUrl: "/book",
    bookingNotice: "30-minute private consultation with an executive partner to explore your growth objectives."
  }
};

