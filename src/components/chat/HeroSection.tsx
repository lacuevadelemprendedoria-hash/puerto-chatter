import nestLogo from "@/assets/puerto-nest-logo.png";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
}

export function HeroSection({ title, subtitle, description }: HeroSectionProps) {
  return (
    <div className="bg-primary px-6 py-8 text-primary-foreground">
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        {/* Logo */}
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4 overflow-hidden">
          <img 
            src={nestLogo} 
            alt="Puerto Nest Logo" 
            className="w-16 h-16 object-contain"
          />
        </div>
        
        {/* Title */}
        <h1 className="text-2xl font-bold mb-1">{title}</h1>
        <p className="text-sm opacity-90 mb-3">{subtitle}</p>
        
        {/* Helper text */}
        <p className="text-sm opacity-80 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
