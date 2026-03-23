import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  onRate: (stars: number) => void;
  promptText: string;
  thanksText: string;
}

export function StarRating({ onRate, promptText, thanksText }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const [rated, setRated] = useState(0);

  if (rated > 0) {
    return (
      <div className="flex items-center gap-1.5 mt-2 px-1">
        <span className="text-xs text-muted-foreground">{thanksText}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-2 px-1">
      <span className="text-xs text-muted-foreground">{promptText}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => {
              setRated(star);
              onRate(star);
            }}
            className="p-0.5 transition-transform active:scale-90"
          >
            <Star
              className={`w-4 h-4 transition-colors ${
                star <= (hovered || rated)
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
