import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full py-6 mt-auto">
      <div className="container mx-auto text-center text-muted-foreground">
        <p className="flex items-center justify-center gap-1.5">
          Fait avec <Heart className="h-4 w-4 text-accent fill-accent" /> par LAROMADEV
        </p>
      </div>
    </footer>
  );
}
