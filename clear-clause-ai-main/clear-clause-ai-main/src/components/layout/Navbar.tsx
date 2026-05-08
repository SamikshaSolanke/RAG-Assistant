import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onLanguageToggle: () => void;
  currentLanguage: string;
}

export function Navbar({ onLanguageToggle, currentLanguage }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: "/", label: "Home", labelHi: "होम" },
    { href: "/about", label: "About", labelHi: "हमारे बारे में" },
    { href: "/news", label: "News", labelHi: "समाचार" },
    { href: "/upload", label: "Upload", labelHi: "अपलोड" },
    { href: "/profile", label: "Profile", labelHi: "प्रोफ़ाइल" },
    { href: "/help", label: "Help", labelHi: "सहायता" },
    { href: "/contact", label: "Contact", labelHi: "संपर्क" },
    { href: "/draft", label: "Draft", labelHi: "ड्राफ़्ट" },

  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-semibold text-foreground">
              {currentLanguage === "hi" ? "कानूनी सहायक" : "LegalAI"}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.href) 
                    ? "text-primary border-b-2 border-primary pb-1" 
                    : "text-muted-foreground"
                }`}
              >
                {currentLanguage === "hi" ? link.labelHi : link.label}
              </Link>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={onLanguageToggle}
              className="flex items-center space-x-2"
            >
              <Globe className="w-4 h-4" />
              <span>{currentLanguage === "hi" ? "English" : "हिंदी"}</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-2 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {currentLanguage === "hi" ? link.labelHi : link.label}
                </Link>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onLanguageToggle();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-center mt-4"
              >
                <Globe className="w-4 h-4 mr-2" />
                {currentLanguage === "hi" ? "हिंदी" : "English"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}