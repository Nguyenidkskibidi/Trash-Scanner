import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Hobbies from "@/components/Hobbies";
import Footer from "@/components/Footer";
import FloatingCharacters from "@/components/FloatingCharacters";
import ThemeToggle from "@/components/ThemeToggle";
import MediaPlayer from "@/components/MediaPlayer";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <FloatingCharacters />
      <ThemeToggle />
      <MediaPlayer />
      <div className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Hobbies />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
