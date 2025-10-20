import { Card } from "@/components/ui/card";
import { Code2, Languages, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import javascriptLogo from "@/assets/javascript-logo.png";
import typescriptLogo from "@/assets/typescript-logo.png";

const Skills = () => {
  const { ref: sectionRef, isRevealed: sectionRevealed } = useScrollReveal();
  
  const languages = [
    { name: "Vietnamese", level: "Native", flag: "🇻🇳" },
    { name: "English", level: "Intermediate", flag: "🇬🇧" },
  ];

  const programming = [
    { name: "JavaScript", logo: javascriptLogo, description: "Nah I just can code a simple website, so don't tell me like that" },
    { name: "TypeScript", logo: typescriptLogo, description: "Nuh uh, I give this to you, JavaScript" },
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-20 px-4 bg-secondary/20">
      <div className="container max-w-6xl mx-auto">
        <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-16 bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent scroll-reveal text-gradient-animated ${sectionRevealed ? 'revealed' : ''}`}>
          <Sparkles className="inline w-6 h-6 md:w-8 md:h-8 mb-2 mr-2 text-primary animate-pulse" />
          Skills & Languages
          <Sparkles className="inline w-6 h-6 md:w-8 md:h-8 mb-2 ml-2 text-accent animate-pulse" />
        </h2>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Languages */}
          <Card className="p-6 md:p-8 backdrop-blur-sm bg-card/80 border-2 hover:shadow-2xl gradient-border-animated transition-all duration-500 hover-lift hover-bounce relative overflow-hidden group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'var(--gradient-card)' }} />
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl hover-rotate">
                <Languages className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold">Languages</h3>
            </div>
            <div className="space-y-4 relative z-10">
              {languages.map((lang, index) => (
                <div
                  key={lang.name}
                  className={`flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors scroll-reveal-left ${sectionRevealed ? 'revealed' : ''}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{lang.flag}</span>
                    <span className="font-semibold">{lang.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{lang.level}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Programming */}
          <Card className="p-6 md:p-8 backdrop-blur-sm bg-card/80 border-2 hover:shadow-2xl gradient-border-animated transition-all duration-500 hover-lift hover-bounce relative overflow-hidden group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'var(--gradient-card)' }} />
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-3 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl hover-rotate">
                <Code2 className="w-5 h-5 md:w-6 md:h-6 text-accent" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold">Programming</h3>
            </div>
            <div className="space-y-4 relative z-10">
              {programming.map((lang, index) => (
                <div
                  key={lang.name}
                  className={`group relative p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-all overflow-hidden scroll-reveal-right ${sectionRevealed ? 'revealed' : ''}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={lang.logo} 
                          alt={`${lang.name} logo`} 
                          className="w-8 h-8 object-contain transition-transform group-hover:scale-110 group-hover:rotate-6"
                        />
                        <span className="font-semibold">{lang.name}</span>
                      </div>
                      <span className="text-xs px-3 py-1 bg-card rounded-full">Learning</span>
                    </div>
                    <p className="text-sm text-muted-foreground italic pl-11">{lang.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Skills;
