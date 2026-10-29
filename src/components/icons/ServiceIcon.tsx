import React from "react";
import {
  Compass,
  Rocket,
  Sparkles,
  TrendingUp,
  Layers,
  Monitor,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

interface ServiceIconProps {
  name: string;
  className?: string;
}

export function ServiceIcon({ name, className = "w-6 h-6" }: ServiceIconProps) {
  switch (name.toLowerCase()) {
    case "compass":
    case "business-counseling":
      return <Compass className={className} strokeWidth={1.5} />;
    case "rocket":
    case "startup-support":
      return <Rocket className={className} strokeWidth={1.5} />;
    case "sparkles":
    case "branding-services":
      return <Sparkles className={className} strokeWidth={1.5} />;
    case "trendingup":
    case "marketing-strategy":
      return <TrendingUp className={className} strokeWidth={1.5} />;
    case "layers":
    case "product-launch-consulting":
      return <Layers className={className} strokeWidth={1.5} />;
    case "monitor":
    case "website-online-presence-setup":
      return <Monitor className={className} strokeWidth={1.5} />;
    default:
      return <CheckCircle2 className={className} strokeWidth={1.5} />;
  }
}

