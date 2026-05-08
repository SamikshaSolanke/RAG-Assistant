import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  Users,
  Building
} from "lucide-react";

interface ContactProps {
  currentLanguage: string;
}

export default function Contact({ currentLanguage }: ContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    type: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const content = {
    en: {
      title: "Contact Us",
      subtitle: "Get in touch with our team for support, partnerships, or general inquiries",
      form: {
        title: "Send us a Message",
        name: "Full Name",
        email: "Email Address",
        phone: "Phone Number",
        subject: "Subject",
        message: "Message",
        type: "Inquiry Type",
        types: {
          general: "General Inquiry",
          support: "Technical Support",
          partnership: "Partnership",
          feedback: "Feedback"
        },
        submit: "Send Message",
        submitting: "Sending...",
        success: "Message sent successfully!"
      },
      info: {
        title: "Contact Information",
        office: {
          title: "Head Office",
          address: "Vishwakarma Institute of Technology, Pune 411037",
          phone: "+91 98765 43210",
          email: "contact@legalai.in"
        },
        support: {
          title: "Support Center",
          hours: "Monday - Friday: 9:00 AM - 6:00 PM IST",
          weekend: "Weekend: 10:00 AM - 4:00 PM IST",
          emergency: "24/7 Emergency Support Available"
        },
        social: {
          title: "Follow Us",
          description: "Stay updated with our latest features and legal tech insights"
        }
      },
      departments: {
        title: "Contact by Department",
        list: [
          {
            title: "Technical Support",
            description: "Issues with uploads, analysis, or platform functionality",
            contact: "support@legalai.in",
            icon: MessageSquare
          },
          {
            title: "Business Partnerships",
            description: "Collaboration opportunities and enterprise solutions",
            contact: "partnerships@legalai.in", 
            icon: Building
          },
          {
            title: "Legal Consultancy",
            description: "Complex legal questions requiring human expert review",
            contact: "legal@legalai.in",
            icon: Users
          }
        ]
      }
    },
    hi: {
      title: "संपर्क करें",
      subtitle: "समर्थन, साझेदारी या सामान्य पूछताछ के लिए हमारी टीम से संपर्क करें",
      form: {
        title: "हमें संदेश भेजें",
        name: "पूरा नाम",
        email: "ईमेल पता",
        phone: "फोन नंबर",
        subject: "विषय",
        message: "संदेश",
        type: "पूछताछ का प्रकार",
        types: {
          general: "सामान्य पूछताछ",
          support: "तकनीकी सहायता",
          partnership: "साझेदारी",
          feedback: "प्रतिक्रिया"
        },
        submit: "संदेश भेजें",
        submitting: "भेजा जा रहा है...",
        success: "संदेश सफलतापूर्वक भेजा गया!"
      },
      info: {
        title: "संपर्क जानकारी",
        office: {
          title: "मुख्य कार्यालय",
          address: "टेक पार्क, सेक्टर 21, मुंबई, महाराष्ट्र 400001",
          phone: "+91 98765 43210",
          email: "contact@legalai.in"
        },
        support: {
          title: "समर्थन केंद्र",
          hours: "सोमवार - शुक्रवार: सुबह 9:00 - शाम 6:00 IST",
          weekend: "सप्ताहांत: सुबह 10:00 - शाम 4:00 IST",
          emergency: "24/7 आपातकालीन सहायता उपलब्ध"
        },
        social: {
          title: "हमें फॉलो करें",
          description: "हमारी नवीनतम सुविधाओं और कानूनी तकनीकी अंतर्दृष्टि के साथ अपडेट रहें"
        }
      },
      departments: {
        title: "विभाग द्वारा संपर्क",
        list: [
          {
            title: "तकनीकी सहायता",
            description: "अपलोड, विश्लेषण या प्लेटफॉर्म कार्यक्षमता के साथ समस्याएं",
            contact: "support@legalai.in",
            icon: MessageSquare
          },
          {
            title: "व्यावसायिक साझेदारी",
            description: "सहयोग के अवसर और एंटरप्राइज़ समाधान",
            contact: "partnerships@legalai.in",
            icon: Building
          },
          {
            title: "कानूनी परामर्श",
            description: "मानव विशेषज्ञ समीक्षा की आवश्यकता वाले जटिल कानूनी प्रश्न",
            contact: "legal@legalai.in",
            icon: Users
          }
        ]
      }
    }
  };

  const t = content[currentLanguage as keyof typeof content];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success",
        description: t.form.success,
      });
      setIsSubmitting(false);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        type: "general"
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{t.title}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="legal-card animate-slide-up">
              <CardHeader>
                <CardTitle className="text-2xl">{t.form.title}</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t.form.name} *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t.form.email} *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t.form.phone}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">{t.form.type}</Label>
                      <select
                        id="type"
                        value={formData.type}
                        onChange={(e) => handleInputChange("type", e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      >
                        {Object.entries(t.form.types).map(([key, value]) => (
                          <option key={key} value={key}>{value}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">{t.form.subject}</Label>
                    <Input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t.form.message} *</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Describe your inquiry in detail..."
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full legal-button-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Send className="w-4 h-4 mr-2 animate-pulse" />
                        {t.form.submitting}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {t.form.submit}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Office Info */}
            <Card className="legal-card animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-primary" />
                  <span>{t.info.office.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                  <p className="text-sm">{t.info.office.address}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm">{t.info.office.phone}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm">{t.info.office.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Support Hours */}
            <Card className="legal-card animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{t.info.support.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{t.info.support.hours}</p>
                <p className="text-sm text-muted-foreground">{t.info.support.weekend}</p>
                <p className="text-sm font-medium text-primary">{t.info.support.emergency}</p>
              </CardContent>
            </Card>

            {/* Departments */}
            <Card className="legal-card animate-scale-in">
              <CardHeader>
                <CardTitle>{t.departments.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {t.departments.list.map((dept, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <dept.icon className="w-4 h-4 text-primary" />
                      <h4 className="text-sm font-semibold">{dept.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{dept.description}</p>
                    <p className="text-xs font-medium text-primary">{dept.contact}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}