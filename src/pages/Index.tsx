import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import mascot from "@/assets/chocofarms-mascot.png";

const Index = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Thanks for your interest!",
        description: "We'll keep you updated on our journey.",
      });
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Mascot */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <img
              src={mascot}
              alt="ChocoFarms Mascot"
              className="w-64 h-auto md:w-80 lg:w-96 drop-shadow-2xl"
            />
          </div>

          {/* Headline */}
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              Where Nature Meets
              <span className="block text-primary mt-2">Sweet Adventures</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Imagine a place where cocoa trees whisper stories, where the earth
              feeds your soul, and every moment tastes like discovery...
            </p>
          </div>

          {/* Mystery Box */}
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-10 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 shadow-lg">
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                Something Special is Growing
              </h2>
              <p className="text-muted-foreground">
                An experience that blends the tranquility of nature with the
                richness of authentic farm life. Stay tuned for the reveal.
              </p>
            </div>

            {/* Email Form */}
            <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-background/80"
              />
              <Button
                type="submit"
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all hover:scale-105"
              >
                Notify Me
              </Button>
            </form>
          </div>

          {/* Footer Hint */}
          <p className="text-sm text-muted-foreground/70 animate-in fade-in duration-700 delay-500 pt-8">
            🌱 Agro-Resorts & Cocoa Fun | Coming Soon
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
