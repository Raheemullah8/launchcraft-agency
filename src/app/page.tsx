import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { Work } from "@/components/Work";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 1. Header / Navbar with Special Offer Announcement */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero Section: Hook, $0 Fees Trial & /images/p1.jpg */}
        <Hero />

        {/* 3. Agency Services Grid: 9 Services & /images/p3.jpg */}
        <Services />

        {/* 4. Process / Workflow: 4 Steps & /images/p6.jpg */}
        <Process />

        {/* 5. Featured Work / Case Studies: Mockups /images/p4.jpg & /images/p5.jpg */}
        <Work />

        {/* 6. About / Agency Overview: Visual /images/p2.jpg */}
        <About />

        {/* 7. Contact & Lead Capture: 7-Day Free Trial & Banner /images/p7.jpg */}
        <Contact />
      </main>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}
