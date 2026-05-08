import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";

interface FooterProps {
  currentLanguage: string;
}

export function Footer({ currentLanguage }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: {
      title: currentLanguage === "hi" ? "कंपनी" : "Company",
      links: [
        { href: "/about", label: currentLanguage === "hi" ? "हमारे बारे में" : "About Us" },
        { href: "/help", label: currentLanguage === "hi" ? "सहायता" : "Help & FAQ" },
        { href: "/contact", label: currentLanguage === "hi" ? "संपर्क" : "Contact" },
      ]
    },
    services: {
      title: currentLanguage === "hi" ? "सेवाएं" : "Services",
      links: [
        { href: "/upload", label: currentLanguage === "hi" ? "दस्तावेज़ अपलोड" : "Document Upload" },
        { href: "/analysis", label: currentLanguage === "hi" ? "विश्लेषण" : "AI Analysis" },
        { href: "/voice", label: currentLanguage === "hi" ? "आवाज सहायक" : "Voice Assistant" },
      ]
    },
    legal: {
      title: currentLanguage === "hi" ? "कानूनी" : "Legal",
      links: [
        { href: "/privacy", label: currentLanguage === "hi" ? "गोपनीयता नीति" : "Privacy Policy" },
        { href: "/terms", label: currentLanguage === "hi" ? "उपयोग की शर्तें" : "Terms of Service" },
        { href: "/security", label: currentLanguage === "hi" ? "सुरक्षा" : "Security" },
      ]
    }
  };

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">L</span>
              </div>
              <span className="text-lg font-semibold">
                {currentLanguage === "hi" ? "कानूनी सहायक" : "LegalAI"}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {currentLanguage === "hi" 
                ? "कानूनी दस्तावेजों को सरल और समझने योग्य बनाना" 
                : "Making legal documents simple and accessible for everyone"
              }
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+91 8788671041</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>support@legalai.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Pune, India</span>
              </div>
            </div>
          </div>
          {/* Footer Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key} className="space-y-4">
              <h4 className="font-semibold text-foreground">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {currentLanguage === "hi" ? "कानूनी सहायक" : "LegalAI"}. 
              {currentLanguage === "hi" ? " सभी अधिकार सुरक्षित।" : " All rights reserved."}
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}