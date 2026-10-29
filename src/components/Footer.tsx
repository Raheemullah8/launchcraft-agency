import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#171717] text-[#F5F1E9] border-t border-[#292929] pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Editorial Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#2B2B2B]">
          {/* Agency Mission Statement */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif font-black text-3xl tracking-tighter text-[#FFFFFF]">
                LAUNCHCRAFT
              </span>
            </Link>
            <p className="text-sm font-mono text-[#A3A3A3] tracking-widest uppercase">
              From Idea to Impact.
            </p>
            <p className="text-sm text-[#888888] leading-relaxed max-w-sm pt-2">
              A boutique digital growth and brand engineering partner. We build enduring visual identities, high-converting platforms, and scalable growth engines for ambitious companies.
            </p>

            {/* Official Trustpilot Summary Link */}
            <div className="pt-4">
              <a
                href="https://www.trustpilot.com/review/launchcraft.agency"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-[#222222] border border-[#333333] hover:border-[#555555] transition-colors group"
                aria-label="Verified Trustpilot Profile - Rated 4.9 out of 5"
              >
                <div className="flex items-center gap-1 text-[#00B67A]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold text-white tracking-wider">Trustpilot</span>
                </div>
                <span className="text-xs text-[#A3A3A3] group-hover:text-white transition-colors flex items-center gap-1">
                  <span>Score 4.9 • 38 Reviews</span>
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </a>
            </div>
          </div>

          {/* Sitemaps & Services Navigation */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#777777] mb-4">
                Services
              </h4>
              <ul className="space-y-2.5 text-sm text-[#CCCCCC]">
                <li>
                  <Link href="/services/business-counseling" className="hover:text-white transition-colors">
                    Business Counseling
                  </Link>
                </li>
                <li>
                  <Link href="/services/startup-support" className="hover:text-white transition-colors">
                    Startup Support
                  </Link>
                </li>
                <li>
                  <Link href="/services/branding-services" className="hover:text-white transition-colors">
                    Branding Services
                  </Link>
                </li>
                <li>
                  <Link href="/services/marketing-strategy" className="hover:text-white transition-colors">
                    Marketing Strategy
                  </Link>
                </li>
                <li>
                  <Link href="/services/product-launch-consulting" className="hover:text-white transition-colors">
                    Product Launch
                  </Link>
                </li>
                <li>
                  <Link href="/services/website-online-presence-setup" className="hover:text-white transition-colors">
                    Website Setup
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#777777] mb-4">
                Agency
              </h4>
              <ul className="space-y-2.5 text-sm text-[#CCCCCC]">
                <li>
                  <Link href="/work" className="hover:text-white transition-colors">
                    Selected Work
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Agency
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Careers &amp; Roles
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Project Inquiry
                  </Link>
                </li>
                <li>
                  <Link href="/book" className="hover:text-white transition-colors">
                    Book Consultation
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#777777] mb-4">
                Connect
              </h4>
              <ul className="space-y-2.5 text-sm text-[#CCCCCC]">
                <li>
                  <a
                    href="mailto:inquiries@launchcraft.agency"
                    className="hover:text-white transition-colors"
                  >
                    inquiries@launchcraft.agency
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    LinkedIn <ArrowUpRight className="w-3 h-3 text-[#777777]" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    Instagram <ArrowUpRight className="w-3 h-3 text-[#777777]" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    X / Twitter <ArrowUpRight className="w-3 h-3 text-[#777777]" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    GitHub <ArrowUpRight className="w-3 h-3 text-[#777777]" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777777] font-mono">
          <div>
            &copy; 2026 LaunchCraft Agency Ltd. All rights reserved. Registered in England &amp; Wales.
          </div>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-[#F5F1E9] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#F5F1E9] transition-colors">
              Terms of Use
            </Link>
            <Link href="/cookies" className="hover:text-[#F5F1E9] transition-colors">
              Cookie Preferences
            </Link>
            <Link href="/admin" className="text-[#555555] hover:text-[#AAAAAA] transition-colors">
              CMS Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
