import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Mail, Sparkles, Heart, Star, Smile } from "lucide-react";
import ContactDialog from "./ContactDialog";
import { useState } from "react";
import profileImage from "@/assets/profile.png";

const Hero = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <ContactDialog open={isContactOpen} onOpenChange={setIsContactOpen} />
      <section className="relative min-h-screen flex items-center justify-center px-4 py-16 md:py-20 overflow-hidden" style={{ background: 'var(--gradient-soft)' }}>
        {/* Cute floating icons */}
        <div className="absolute top-10 left-[10%] animate-float opacity-60 hidden md:block">
          <Heart className="w-10 h-10 text-accent" fill="currentColor" />
        </div>
        <div className="absolute top-20 right-[15%] animate-float opacity-60 hidden md:block" style={{ animationDelay: '1s' }}>
          <Star className="w-8 h-8 text-primary" fill="currentColor" />
        </div>
        <div className="absolute bottom-20 left-[20%] animate-float opacity-60 hidden md:block" style={{ animationDelay: '2s' }}>
          <Smile className="w-9 h-9 text-accent" />
        </div>
        <div className="absolute bottom-10 right-[10%] animate-float opacity-60 hidden md:block" style={{ animationDelay: '1.5s' }}>
          <Sparkles className="w-8 h-8 text-primary" fill="currentColor" />
        </div>

        <div className="relative z-10 container max-w-6xl mx-auto">
          <div className="text-center space-y-6 md:space-y-8 animate-fade-in">
            <div className="inline-block">
              <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 gradient-border-animated shadow-2xl hover-lift pulse-ring">
                <img
                  src={profileImage}
                  alt="Nguyễn Khôi Nguyên"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent text-gradient-animated">
                Nguyễn Khôi Nguyên
              </h1>
              <div className="flex items-center justify-center gap-2 text-lg md:text-2xl text-muted-foreground mb-3 md:mb-4">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary animate-pulse" />
                <p className="font-medium">Student Developer</p>
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-accent animate-pulse" />
              </div>
              <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
                12 years old • Learning JavaScript & TypeScript • From Vietnam 🇻🇳
              </p>
            </div>

            <div className="flex flex-wrap gap-3 md:gap-4 justify-center px-4">
              <Button
                asChild
                size="lg"
                className="gap-2 bg-gradient-to-r from-primary via-purple-500 to-accent hover:opacity-90 transition-all hover-lift btn-glow btn-shimmer btn-press text-sm md:text-base"
              >
                <a href="https://github.com/Nguyenidkskibidi" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">View GitHub</span>
                  <span className="sm:hidden">GitHub</span>
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 hover-lift gradient-border-animated hover:bg-accent/10 btn-press text-sm md:text-base"
                onClick={() => setIsContactOpen(true)}
              >
                <Mail className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Contact Me</span>
                <span className="sm:hidden">Contact</span>
              </Button>
            </div>

            <div className="animate-bounce mt-6 md:mt-8">
              <ArrowDown className="w-5 h-5 md:w-6 md:h-6 mx-auto text-primary" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
