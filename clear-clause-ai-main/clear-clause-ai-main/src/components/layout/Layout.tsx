import { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AuthModal } from "@/components/auth/AuthModal";
import { ChatBot } from "@/components/chat/ChatBot";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  currentLanguage?: string;
  onLanguageToggle?: () => void;
}

export function Layout({ children, currentLanguage = "en", onLanguageToggle }: LayoutProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check if user has already authenticated
    const isAuthenticated = localStorage.getItem("legalai_authenticated");
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  }, []);

  const handleAuthSuccess = () => {
    localStorage.setItem("legalai_authenticated", "true");
    setShowAuthModal(false);
  };

  const handleLanguageToggle = () => {
    if (onLanguageToggle) {
      onLanguageToggle();
    }
  };

  // Clone children and pass language prop if it's a React element
  const childrenWithProps = React.isValidElement(children) 
    ? React.cloneElement(children, { currentLanguage } as any)
    : children;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar 
        onLanguageToggle={handleLanguageToggle}
        currentLanguage={currentLanguage}
      />
      
      <main className="flex-1">
        {childrenWithProps}
      </main>
      
      <Footer currentLanguage={currentLanguage} />
      
      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => {}} // Prevent closing without authentication
        onSuccess={handleAuthSuccess}
        currentLanguage={currentLanguage}
      />
      
      {/* Floating ChatBot */}
      <ChatBot currentLanguage={currentLanguage} />
    </div>
  );
}