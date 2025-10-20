import { Card } from "@/components/ui/card";
import { Heart, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import doraemonImg from "@/assets/doraemon.jpg";
import mahiroImg from "@/assets/mahiro.jpg";

const Hobbies = () => {
  const { ref: sectionRef, isRevealed: sectionRevealed } = useScrollReveal();
  
  const hobbies = [
    {
      name: "Doraemon",
      description: "A beloved Japanese manga and anime series created by Fujiko F. Fujio. It follows the adventures of Doraemon, a robotic cat from the 22nd century, who travels back in time to help a young boy named Nobita Nobi. With his magical fourth-dimensional pocket filled with futuristic gadgets, Doraemon helps Nobita navigate everyday challenges, teaching valuable lessons about friendship, courage, and problem-solving. The series has been entertaining audiences worldwide for decades with its heartwarming stories and imaginative inventions.",
      image: doraemonImg,
      color: "from-cyan-400 to-blue-600",
    },
    {
      name: "Mahiro (Onimai)",
      description: "From the anime 'Onimai: I'm Now Your Sister!', Mahiro Oyama is the main character who experiences an unexpected transformation. The series explores themes of identity, family bonds, and adapting to new situations with humor and heart. Mahiro's journey is filled with comedic moments and touching scenes that showcase personal growth and the importance of accepting change. The anime combines slice-of-life elements with fantasy, creating a unique and entertaining story about discovering oneself and building meaningful relationships with those around you.",
      image: mahiroImg,
      color: "from-pink-400 to-purple-600",
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className={`text-center mb-12 md:mb-16 scroll-reveal ${sectionRevealed ? 'revealed' : ''}`}>
          <div className="inline-flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6 md:w-8 md:h-8 text-primary animate-pulse" fill="currentColor" />
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-accent animate-pulse" fill="currentColor" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent text-gradient-animated">
            My Interests
          </h2>
          <p className="text-muted-foreground mt-3 md:mt-4 text-base md:text-lg px-4">
            Anime series that inspire and bring me joy
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {hobbies.map((hobby, index) => (
            <Card
              key={hobby.name}
              className={`group relative overflow-hidden border-2 gradient-border-animated hover:shadow-2xl transition-all duration-700 hover-lift hover-bounce scroll-reveal-scale ${sectionRevealed ? 'revealed' : ''}`}
              style={{
                transitionDelay: `${index * 150}ms`,
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${hobby.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              <div className="relative">
                {/* Image Section */}
                <div className="relative h-48 md:h-64 overflow-hidden">
                  <img
                    src={hobby.image}
                    alt={hobby.name}
                    className="w-full h-full object-cover transform group-hover:scale-125 group-hover:rotate-2 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                </div>

                {/* Content Section */}
                <div className="p-5 md:p-8 space-y-3 md:space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold group-hover:text-primary transition-colors flex items-center gap-2">
                    {hobby.name}
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {hobby.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs md:text-sm text-primary font-medium pt-2">
                    <span>Learn more</span>
                    <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hobbies;
