import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SessionProvider } from "@/contexts/SessionContext";
import Home from "./pages/Home";
import DocumentUpload from "./pages/DocumentUpload";
import DocumentAnalysis from "./pages/DocumentAnalysis";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import News from "./components/news/News";
import Draft from "./pages/Draft";

import { useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const App = () => {
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === "en" ? "hi" : "en");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout 
              currentLanguage={currentLanguage}
              onLanguageToggle={handleLanguageToggle}
            >
              <Routes>
                <Route path="/" element={<Home currentLanguage={currentLanguage} />} />
                <Route path="/upload" element={<DocumentUpload currentLanguage={currentLanguage} />} />
                <Route path="/analysis" element={<DocumentAnalysis currentLanguage={currentLanguage} />} />
                <Route path="/profile" element={<Profile currentLanguage={currentLanguage} />} />
                <Route path="/about" element={<About currentLanguage={currentLanguage} />} />
                <Route path="/help" element={<Help currentLanguage={currentLanguage} />} />
                <Route path="/contact" element={<Contact currentLanguage={currentLanguage} />} />
                <Route path="/news" element={<News currentLanguage={currentLanguage} />} />
                <Route path="/draft" element={<Draft currentLanguage={currentLanguage} />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default App;
