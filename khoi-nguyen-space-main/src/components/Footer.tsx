import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 px-4 border-t bg-secondary/20">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Nguyễn Khôi Nguyên. Built with passion and code.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <a 
              href="mailto:khoinguyennguyen683@gmail.com" 
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              khoinguyennguyen683@gmail.com
            </a>
            <span>Made with React & TypeScript</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
