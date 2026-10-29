import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-8">
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
          Error 404 • Page Not Located
        </span>
        <h1 className="font-serif text-5xl sm:text-7xl font-black text-[#171717] tracking-tight">
          Destination Uncharted.
        </h1>
        <p className="text-base text-[#555555] max-w-lg mx-auto leading-relaxed">
          The requested page does not exist or has been relocated to another section of the LaunchCraft archive.
        </p>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
        <Button href="/" variant="default" size="default">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </Button>
        <Button href="/services" variant="secondary" size="default">
          <span>View Capabilities</span>
        </Button>
        <Button href="/work" variant="outline" size="default">
          <span>Case Studies</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="text-xs font-mono text-[#888888] pt-8">
        Need assistance? Email <a href="mailto:inquiries@launchcraft.agency" className="text-[#171717] underline">inquiries@launchcraft.agency</a>
      </div>
    </div>
  );
}

