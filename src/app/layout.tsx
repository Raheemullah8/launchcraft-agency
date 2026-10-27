import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#2C4018",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://launchcraft.agency"),
  title: "Launch Craft (launch.craft) — Digital Growth Agency | Branding • Social Media • Marketing",
  description:
    "Helping businesses launch, grow & stand out. Launch Craft is a digital growth agency specializing in Brand Strategy, Social Media Management, Meta & Google Ads, Web Development, SEO, and E-commerce.",
  keywords: [
    "Launch Craft",
    "launch.craft",
    "Digital Growth Agency",
    "Branding Agency",
    "Social Media Marketing",
    "Meta Ads Management",
    "Google Ads Campaigns",
    "Web Design and Development",
    "SEO Services",
    "E-commerce Growth",
  ],
  authors: [{ name: "Launch Craft", url: "https://www.instagram.com/p/Dejl280EscV/?img_index=3&dlrf=MXNkb2VzN3BrcmkzMw%3D%3D" }],
  creator: "Launch Craft",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://launchcraft.agency",
    title: "Launch Craft (launch.craft) — Digital Growth Agency",
    description:
      "Branding • Social Media • Marketing. Helping businesses launch, grow & stand out with modern strategies and high-performing digital platforms.",
    siteName: "Launch Craft Digital Growth Agency",
    images: [
      {
        url: "/images/p1.jpg",
        width: 1200,
        height: 630,
        alt: "Launch Craft Digital Growth Agency - Helping businesses launch, grow & stand out",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Launch Craft (launch.craft) — Digital Growth Agency",
    description:
      "Helping businesses launch, grow & stand out with high-end branding, paid ads, and web engineering.",
    images: ["/images/p1.jpg"],
    creator: "@launch.craft",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Launch Craft",
              alternateName: "launch.craft",
              description:
                "Digital Growth Agency helping businesses launch, grow & stand out through Branding, Social Media, and Performance Marketing.",
              url: "https://launchcraft.agency",
              sameAs: [
                "https://www.instagram.com/p/Dejl280EscV/?img_index=3&dlrf=MXNkb2VzN3BrcmkzMw%3D%3D",
              ],
              serviceType: [
                "Business Consulting",
                "Brand Strategy",
                "Logo & Graphic Design",
                "Social Media Management",
                "Meta Ads",
                "Google Ads",
                "Website Design & Development",
                "SEO",
                "E-commerce Setup",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-white text-[#1E293B] antialiased selection:bg-[#7A9A60] selection:text-white">
        {children}
      </body>
    </html>
  );
}
