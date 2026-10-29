import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/layout/SiteShell";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#171717",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://launchcraft.agency"),
  title: {
    default: "LaunchCraft — Creative & Growth Partner | From Idea to Impact",
    template: "%s | LaunchCraft",
  },
  description:
    "LaunchCraft is an editorial creative & growth agency. We partner with ambitious leaders to build enduring brands, high-converting digital platforms, and disciplined customer acquisition.",
  keywords: [
    "LaunchCraft",
    "Digital Growth Agency",
    "Brand Strategy",
    "Next.js Web Development",
    "Performance Marketing",
    "Product Launch Consulting",
    "Editorial Design",
    "Startup Advisory",
  ],
  authors: [{ name: "LaunchCraft Agency", url: "https://launchcraft.agency" }],
  creator: "LaunchCraft Agency",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://launchcraft.agency",
    title: "LaunchCraft — Creative & Growth Partner | From Idea to Impact",
    description:
      "From Idea to Impact. Editorial brand architecture, high-performance web engineering, and disciplined acquisition engines.",
    siteName: "LaunchCraft Agency",
    images: [
      {
        url: "/images/p1.jpg",
        width: 1200,
        height: 630,
        alt: "LaunchCraft — From Idea to Impact",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LaunchCraft — Creative & Growth Partner",
    description:
      "From Idea to Impact. Editorial brand architecture and disciplined growth engineering.",
    images: ["/images/p1.jpg"],
    creator: "@launchcraft",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "LaunchCraft",
              alternateName: "LaunchCraft Agency",
              description:
                "Creative and growth partner building enduring brands, high-performance web experiences, and sustainable acquisition funnels.",
              url: "https://launchcraft.agency",
              slogan: "From Idea to Impact.",
              email: "inquiries@launchcraft.agency",
              telephone: "+442079460192",
              address: {
                "@type": "PostalAddress",
                streetAddress: "14 Berwick Street, Soho",
                addressLocality: "London",
                postalCode: "W1F 0PP",
                addressCountry: "GB",
              },
              sameAs: [
                "https://www.linkedin.com/company/launchcraft",
                "https://www.instagram.com/launch.craft",
                "https://x.com/launchcraft",
              ],
              serviceType: [
                "Business Counseling",
                "Startup Support",
                "Branding Services",
                "Marketing Strategy",
                "Product Launch Consulting",
                "Website & Online Presence Setup",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-[#F5F1E9] text-[#171717] antialiased selection:bg-[#171717] selection:text-[#F5F1E9] flex flex-col">
        {/* Skip to Main Content for Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#171717] focus:text-[#F5F1E9] focus:rounded-md focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>

        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
