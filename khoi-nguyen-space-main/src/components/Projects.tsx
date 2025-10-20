import { Card } from "@/components/ui/card";
import { Code2, ExternalLink, Youtube, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Button } from "@/components/ui/button";

const Projects = () => {
  const { ref: sectionRef, isRevealed: sectionRevealed } = useScrollReveal();

  return (
    <section ref={sectionRef} className="py-16 md:py-20 px-4 bg-secondary/20 relative overflow-hidden">
      <div className="container max-w-6xl mx-auto">
        <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-16 bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent scroll-reveal text-gradient-animated ${sectionRevealed ? 'revealed' : ''}`}>
          <Sparkles className="inline w-6 h-6 md:w-8 md:h-8 mb-2 mr-2 text-primary animate-pulse" />
          My Projects
          <Sparkles className="inline w-6 h-6 md:w-8 md:h-8 mb-2 ml-2 text-accent animate-pulse" />
        </h2>

        <Card className={`p-6 md:p-8 backdrop-blur-sm bg-card/80 border-2 hover:shadow-2xl gradient-border-animated transition-all duration-700 hover-lift hover-bounce scroll-reveal-scale ${sectionRevealed ? 'revealed' : ''}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl hover-rotate pulse-ring">
              <Code2 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI-Green-Scan</h3>
          </div>

          <div className="space-y-6">
            <p className="text-muted-foreground text-lg leading-relaxed">
              An innovative AI-powered application that can scan and identify various types of trash, featuring face detection to prevent accidental human scanning.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Pros */}
              <div className="space-y-3">
                <h4 className="text-xl font-semibold flex items-center gap-2 text-primary">
                  <CheckCircle2 className="w-5 h-5" />
                  Pros
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-primary mt-1">•</span>
                    <span>Supported Android (APK)</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-primary mt-1">•</span>
                    <span>Web-based platform</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-primary mt-1">•</span>
                    <span>Great UI design</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-primary mt-1">•</span>
                    <span>Can scan lots of trash types</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-primary mt-1">•</span>
                    <span>Can detect human faces to avoid scanning</span>
                  </li>
                </ul>
              </div>

              {/* Cons */}
              <div className="space-y-3">
                <h4 className="text-xl font-semibold flex items-center gap-2 text-accent">
                  <XCircle className="w-5 h-5" />
                  Cons
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-accent mt-1">•</span>
                    <span>Can have some errors</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-accent mt-1">•</span>
                    <span>My skills in this website are not great yet</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 md:gap-4 pt-4">
              <Button
                asChild
                variant="default"
                className="group btn-glow hover-lift btn-press bg-gradient-to-r from-primary to-accent text-sm md:text-base"
              >
                <a
                  href="https://youtu.be/YUlYWOzb4t4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Youtube className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Demo Video</span>
                  <span className="sm:hidden">Demo</span>
                  <ExternalLink className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                className="group hover-lift gradient-border-animated hover:bg-primary/10 btn-press text-sm md:text-base"
              >
                <a
                  href="https://github.com/Nguyenidkskibidi/AI-Trash-Scan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Code2 className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">View on GitHub</span>
                  <span className="sm:hidden">GitHub</span>
                  <ExternalLink className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Projects;
