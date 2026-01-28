import { Building2 } from "lucide-react";

interface WelcomeCardProps {
  title: string;
  subtitle: string;
  description: string;
}

export function WelcomeCard({ title, subtitle, description }: WelcomeCardProps) {
  return (
    <div className="welcome-gradient rounded-2xl p-6 text-primary-foreground animate-slide-up">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="text-sm opacity-90">{subtitle}</p>
        </div>
      </div>
      <p className="text-sm opacity-90 leading-relaxed">{description}</p>
    </div>
  );
}
