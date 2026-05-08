import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Shield, UserCheck, Phone, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentLanguage: string;
}

export function AuthModal({ isOpen, onClose, onSuccess, currentLanguage }: AuthModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    aadhaar: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const content = {
    en: {
      title: "Welcome to LegalAI",
      subtitle: "Please provide your details to continue",
      name: "Full Name",
      phone: "Phone Number",
      aadhaar: "Aadhaar Number",
      submit: "Get Started",
      loading: "Setting up your account...",
      success: "Account created successfully!",
      privacy: "Your information is secure and protected",
      features: [
        { icon: Shield, text: "Bank-level security" },
        { icon: UserCheck, text: "Verified access only" },
        { icon: Phone, text: "SMS notifications" },
        { icon: CreditCard, text: "Secure payments" }
      ]
    },
    hi: {
      title: "कानूनी सहायक में आपका स्वागत है",
      subtitle: "कृपया जारी रखने के लिए अपना विवरण प्रदान करें",
      name: "पूरा नाम",
      phone: "फोन नंबर",
      aadhaar: "आधार नंबर",
      submit: "शुरू करें",
      loading: "आपका खाता सेट कर रहे हैं...",
      success: "खाता सफलतापूर्वक बनाया गया!",
      privacy: "आपकी जानकारी सुरक्षित और संरक्षित है",
      features: [
        { icon: Shield, text: "बैंक-स्तरीय सुरक्षा" },
        { icon: UserCheck, text: "केवल सत्यापित पहुंच" },
        { icon: Phone, text: "SMS सूचनाएं" },
        { icon: CreditCard, text: "सुरक्षित भुगतान" }
      ]
    }
  };

  const t = content[currentLanguage as keyof typeof content];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.aadhaar) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate Aadhaar format (12 digits)
    if (!/^\d{12}$/.test(formData.aadhaar)) {
      toast({
        title: "Error",
        description: "Aadhaar number must be 12 digits",
        variant: "destructive",
      });
      return;
    }

    // Validate phone format
    if (!/^\d{10}$/.test(formData.phone)) {
      toast({
        title: "Error",
        description: "Phone number must be 10 digits",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem("legalai_user", JSON.stringify(formData));
      toast({
        title: "Success",
        description: t.success,
      });
      setIsLoading(false);
      onSuccess();
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">{/* No close button to force authentication */}
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-xl font-semibold">{t.title}</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">{t.subtitle}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t.name} *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t.phone} *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="10-digit phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value.replace(/\D/g, '').slice(0, 10))}
              maxLength={10}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aadhaar">{t.aadhaar} *</Label>
            <Input
              id="aadhaar"
              type="text"
              placeholder="12-digit Aadhaar number"
              value={formData.aadhaar}
              onChange={(e) => handleInputChange("aadhaar", e.target.value.replace(/\D/g, '').slice(0, 12))}
              maxLength={12}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? t.loading : t.submit}
          </Button>
        </form>

        {/* Security Features */}
        <Card className="p-4 mt-4 bg-muted/50">
          <div className="text-center mb-3">
            <p className="text-sm font-medium text-muted-foreground">{t.privacy}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {t.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <feature.icon className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">{feature.text}</span>
              </div>
            ))}
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
}