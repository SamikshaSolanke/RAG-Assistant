import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Brain, 
  Globe, 
  Shield, 
  Upload, 
  CheckCircle, 
  MessageSquare,
  Scale,
  Users,
  Zap
} from "lucide-react";
import heroImage from "@/assets/hero-legal-tech.jpg";

interface HomeProps {
  currentLanguage: string;
}

export default function Home({ currentLanguage }: HomeProps) {
  const content = {
    en: {
      hero: {
        title: "Making Legal Documents Simple & Accessible",
        subtitle: "Upload contracts, policies, or scanned documents and get clause extraction, simplified summaries, and multilingual voice explanations.",
        cta: "Get Started",
        upload: "Upload Document"
      },
      about: {
        title: "Bridging the Legal Literacy Gap",
        description: "Legal and policy documents are often written in complex language that creates barriers for non-experts. Our AI-powered platform makes these documents accessible, understandable, and actionable for everyone.",
        stats: [
          { value: "10k+", label: "Documents Analyzed" },
          { value: "95%", label: "Accuracy Rate" },
          { value: "3", label: "Languages Supported" }
        ]
      },
      documents: {
        title: "Supported Document Types",
        description: "We support a wide range of legal and policy documents",
        types: [
          {
            title: "Contracts",
            description: "Employment contracts, service agreements, and business contracts",
            icon: FileText
          },
          {
            title: "Government Policies", 
            description: "Policy documents, regulations, and government schemes",
            icon: Scale
          },
          {
            title: "Business Agreements",
            description: "Partnership agreements, vendor contracts, and NDAs",
            icon: Users
          },
          {
            title: "Employment Offers",
            description: "Job offers, salary negotiations, and employment terms",
            icon: CheckCircle
          }
        ]
      },
      howItWorks: {
        title: "How It Works",
        description: "Simple steps to understand your legal documents",
        steps: [
          {
            step: "1",
            title: "Upload Document",
            description: "Upload PDF, image, or text files of your legal documents",
            icon: Upload
          },
          {
            step: "2", 
            title: "AI Analysis",
            description: "Our AI extracts clauses, identifies risks, and analyzes content",
            icon: Brain
          },
          {
            step: "3",
            title: "Get Summaries", 
            description: "Receive plain-language summaries and explanations",
            icon: FileText
          },
          
          {
            step: "4",
            title: "Compare Clauses",
            description: "Compare with standard templates to identify unusual terms",
            icon: CheckCircle
          },
          {
            step: "5",
            title: "Ask Questions",
            description: "Retrieve any doubt about the doc in seconds",
            icon: CheckCircle
          }
        ]
      },
      features: {
        title: "Powerful Features for Everyone",
        list: [
          {
            title: "Multilingual Support",
            description: "Available in Hindi, English, and Marathi",
            icon: Globe
          },
          {
            title: "AI-Powered Analysis", 
            description: "Advanced NLP models for accurate clause extraction",
            icon: Brain
          },
          {
            title: "Bank-Level Security",
            description: "Your documents are encrypted and secure",
            icon: Shield
          },
          {
            title: "Instant Processing",
            description: "Get results in seconds, not hours",
            icon: Zap
          }
        ]
      }
    },
    hi: {
      hero: {
        title: "कानूनी दस्तावेजों को सरल और सुलभ बनाना",
        subtitle: "अनुबंध, नीतियां, या स्कैन किए गए दस्तावेज़ अपलोड करें और क्लॉज़ निष्कर्षण, सरलीकृत सारांश, और बहुभाषी आवाज़ स्पष्टीकरण प्राप्त करें।",
        cta: "शुरू करें",
        upload: "दस्तावेज़ अपलोड करें"
      },
      about: {
        title: "कानूनी साक्षरता की खाई को पाटना",
        description: "कानूनी और नीतिगत दस्तावेज़ अक्सर जटिल भाषा में लिखे होते हैं जो गैर-विशेषज्ञों के लिए बाधाएं बनाते हैं। हमारा AI-संचालित प्लेटफॉर्म इन दस्तावेजों को सभी के लिए सुलभ, समझने योग्य और कार्यान्वित करने योग्य बनाता है।",
        stats: [
          { value: "10k+", label: "विश्लेषित दस्तावेज़" },
          { value: "95%", label: "सटीकता दर" },
          { value: "3", label: "समर्थित भाषाएं" }
        ]
      },
      documents: {
        title: "समर्थित दस्तावेज़ प्रकार",
        description: "हम कानूनी और नीतिगत दस्तावेजों की एक विस्तृत श्रृंखला का समर्थन करते हैं",
        types: [
          {
            title: "अनुबंध",
            description: "रोजगार अनुबंध, सेवा समझौते, और व्यावसायिक अनुबंध",
            icon: FileText
          },
          {
            title: "सरकारी नीतियां",
            description: "नीतिगत दस्तावेज़, विनियम, और सरकारी योजनाएं",
            icon: Scale
          },
          {
            title: "व्यावसायिक समझौते",
            description: "भागीदारी समझौते, विक्रेता अनुबंध, और गोपनीयता समझौते",
            icon: Users
          },
          {
            title: "रोजगार प्रस्ताव",
            description: "नौकरी के प्रस्ताव, वेतन बातचीत, और रोजगार शर्तें",
            icon: CheckCircle
          }
        ]
      },
      howItWorks: {
        title: "यह कैसे काम करता है",
        description: "अपने कानूनी दस्तावेजों को समझने के लिए सरल चरण",
        steps: [
          {
            step: "1",
            title: "दस्तावेज़ अपलोड करें",
            description: "अपने कानूनी दस्तावेजों की PDF, छवि, या टेक्स्ट फ़ाइलें अपलोड करें",
            icon: Upload
          },
          {
            step: "2",
            title: "AI विश्लेषण",
            description: "हमारा AI खंड निकालता है, जोखिमों की पहचान करता है, और सामग्री का विश्लेषण करता है",
            icon: Brain
          },
          {
            step: "3",
            title: "सारांश प्राप्त करें",
            description: "सादी भाषा में सारांश और स्पष्टीकरण प्राप्त करें",
            icon: FileText
          },
          {
            step: "4",
            title: "आवाज़ सहायक",
            description: "प्रश्न पूछें और अपनी भाषा में आवाज़ स्पष्टीकरण प्राप्त करें",
            icon: MessageSquare
          },
          {
            step: "5",
            title: "खंडों की तुलना करें",
            description: "असामान्य शर्तों की पहचान के लिए मानक टेम्प्लेट से तुलना करें",
            icon: CheckCircle
          }
        ]
      },
      features: {
        title: "सभी के लिए शक्तिशाली सुविधाएं",
        list: [
          {
            title: "बहुभाषी समर्थन",
            description: "हिंदी, अंग्रेजी और मराठी में उपलब्ध",
            icon: Globe
          },
          {
            title: "AI-संचालित विश्लेषण",
            description: "सटीक खंड निष्कर्षण के लिए उन्नत NLP मॉडल",
            icon: Brain
          },
          {
            title: "बैंक-स्तरीय सुरक्षा",
            description: "आपके दस्तावेज़ एन्क्रिप्टेड और सुरक्षित हैं",
            icon: Shield
          },
          {
            title: "तत्काल प्रसंस्करण",
            description: "घंटों नहीं, सेकंडों में परिणाम प्राप्त करें",
            icon: Zap
          }
        ]
      }
    }
  };

  const t = content[currentLanguage as keyof typeof content];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden legal-gradient-hero">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-light/80"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in">
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {t.hero.title}
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                {t.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/upload">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                    {t.hero.cta}
                  </Button>
                </Link>
                <Link to="/upload">
                  <Button 
                    size="lg" 
                    className="bg-white text-primary hover:bg-white/90"
                  >
                    {t.hero.upload}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="animate-slide-up">
              <img 
                src={heroImage} 
                alt="Legal Technology Platform"
                className="w-full h-auto rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">{t.about.title}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t.about.description}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {t.about.stats.map((stat, index) => (
              <Card key={index} className="text-center legal-card animate-scale-in">
                <CardContent className="pt-6">
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Documents */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">{t.documents.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.documents.description}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.documents.types.map((doc, index) => (
              <Link key={index} to={`/document-type/${doc.title.toLowerCase()}`}>
                <Card className="legal-card hover:shadow-[var(--shadow-hover)] transition-all animate-slide-up h-full">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <doc.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {doc.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">{t.howItWorks.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.howItWorks.description}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-5 gap-8">
            {t.howItWorks.steps.map((step, index) => (
              <div key={index} className="text-center animate-slide-up">
                <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                  {step.step}
                </div>
                <div className="mb-4 mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/upload">
              <Button size="lg" className="legal-button-primary">
                {t.hero.cta}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">{t.features.title}</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.features.list.map((feature, index) => (
              <Card key={index} className="legal-card animate-scale-in text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}