import character1 from "@/assets/character-1.png";
import character2 from "@/assets/character-2.png";
import character3 from "@/assets/character-3.png";
import character4 from "@/assets/character-4.png";
import character5 from "@/assets/character-5.png";
import character6 from "@/assets/character-6.png";

const FloatingCharacters = () => {
  const characters = [
    { src: character1, delay: "0s", duration: "20s", position: "top-20 left-10" },
    { src: character2, delay: "3s", duration: "25s", position: "top-40 right-20" },
    { src: character3, delay: "6s", duration: "22s", position: "top-[60%] left-[15%]" },
    { src: character4, delay: "2s", duration: "28s", position: "top-[30%] right-[10%]" },
    { src: character5, delay: "5s", duration: "24s", position: "bottom-40 left-[20%]" },
    { src: character6, delay: "4s", duration: "26s", position: "bottom-60 right-[15%]" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {characters.map((char, index) => (
        <img
          key={index}
          src={char.src}
          alt=""
          className={`absolute w-20 md:w-32 opacity-20 animate-float ${char.position}`}
          style={{
            animationDelay: char.delay,
            animationDuration: char.duration,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingCharacters;
