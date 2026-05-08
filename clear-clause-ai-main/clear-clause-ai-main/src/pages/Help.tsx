import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  FileText, 
  Upload, 
  Shield, 
  MessageSquare, 
  Globe,
  Settings,
  Phone,
  Mail
} from "lucide-react";

interface HelpProps {
  currentLanguage: string;
}

export default function Help({ currentLanguage }: HelpProps) {
  const [activeTab, setActiveTab] = useState("faq");

  const content = {
    en: {
      title: "Help & Support",
      subtitle: "Find answers to common questions and learn how to use our platform",
      tabs: {
        faq: "FAQ",
        guide: "User Guide",
        support: "Contact Support",
        privacy: "Privacy & Security"
      },
      faq: {
        title: "Frequently Asked Questions",
        categories: [
          {
            title: "Getting Started",
            icon: Upload,
            questions: [
              {
                q: "What types of documents can I upload?",
                a: "You can upload PDFs, images (PNG, JPG, JPEG), text files (TXT), and Word documents (DOCX). We support contracts, policies, agreements, and legal documents up to 10MB in size."
              },
              {
                q: "Do I need to create an account?",
                a: "Yes, we require basic information (name, phone, Aadhaar) for security and compliance purposes. Your information is encrypted and stored securely."
              },
              {
                q: "Is there a limit on document uploads?",
                a: "You can upload up to 5 documents at once, with each file being maximum 10MB in size. There's no daily limit on uploads."
              }
            ]
          },
          {
            title: "AI Analysis",
            icon: FileText,
            questions: [
              {
                q: "How accurate is the AI analysis?",
                a: "Our AI models achieve 95%+ accuracy in clause extraction and risk assessment. We use Legal-BERT and GPT-based models trained on thousands of legal documents."
              },
              {
                q: "What languages are supported?",
                a: "Currently we support English, Hindi, and Marathi. The voice assistant can explain documents in all three languages."
              },
              {
                q: "How long does analysis take?",
                a: "Most documents are analyzed within 30-60 seconds. Complex documents with many pages may take up to 2-3 minutes."
              }
            ]
          },
          {
            title: "Security & Privacy",
            icon: Shield,
            questions: [
              {
                q: "Is my data secure?",
                a: "Yes, we use bank-level encryption (AES-256) for all data. Documents are processed securely and can be deleted from our servers upon request."
              },
              {
                q: "Who can see my documents?",
                a: "Only you can access your uploaded documents. Our AI processes them automatically without human review. We never share your documents with third parties."
              },
              {
                q: "Can I delete my documents?",
                a: "Yes, you can delete your documents anytime from your dashboard. Deleted documents are permanently removed from our servers within 24 hours."
              }
            ]
          }
        ]
      },
      guide: {
        title: "Step-by-Step User Guide",
        steps: [
          {
            step: 1,
            title: "Registration",
            description: "Provide your name, phone number, and Aadhaar number for secure access",
            icon: Settings
          },
          {
            step: 2,
            title: "Document Upload",
            description: "Drag and drop your legal documents or click to browse files",
            icon: Upload
          },
          {
            step: 3,
            title: "AI Analysis",
            description: "Our AI extracts clauses, identifies risks, and generates summaries",
            icon: FileText
          },
          {
            step: 4,
            title: "Review Results",
            description: "Navigate through extracted clauses, summaries, and risk assessments",
            icon: HelpCircle
          },
          {
            step: 5,
            title: "Voice Assistant",
            description: "Ask questions about specific clauses and get audio explanations",
            icon: MessageSquare
          }
        ]
      },
      support: {
        title: "Contact Support",
        description: "Need additional help? Our support team is here for you",
        methods: [
          {
            title: "Phone Support",
            description: "Call us for immediate assistance",
            contact: "+91 98765 43210",
            hours: "Mon-Fri: 9 AM - 6 PM IST",
            icon: Phone
          },
          {
            title: "Email Support", 
            description: "Send us a detailed message",
            contact: "support@legalai.in",
            hours: "Response within 24 hours",
            icon: Mail
          },
          {
            title: "Live Chat",
            description: "Chat with our AI assistant anytime",
            contact: "Available 24/7",
            hours: "Instant responses",
            icon: MessageSquare
          }
        ]
      },
      privacy: {
        title: "Privacy & Security Information",
        policies: [
          {
            title: "Data Collection",
            content: "We collect only necessary information: name, phone, Aadhaar for identity verification, and uploaded documents for analysis."
          },
          {
            title: "Data Processing",
            content: "Documents are processed using AI models hosted on secure cloud infrastructure. No human review is involved in the automated analysis."
          },
          {
            title: "Data Storage",
            content: "All data is encrypted at rest and in transit. Documents are stored for 30 days unless deleted earlier by the user."
          },
          {
            title: "Data Sharing",
            content: "We never share your personal information or documents with third parties. Data is used solely for providing our services."
          },
          {
            title: "User Rights",
            content: "You have the right to access, modify, or delete your data anytime. Contact us for data export or complete account deletion."
          }
        ]
      }
    },
    hi: {
      title: "सहायता और समर्थन",
      subtitle: "सामान्य प्रश्नों के उत्तर खोजें और हमारे प्लेटफॉर्म का उपयोग करना सीखें",
      tabs: {
        faq: "FAQ",
        guide: "उपयोगकर्ता गाइड",
        support: "समर्थन संपर्क",
        privacy: "गोपनीयता और सुरक्षा"
      },
      faq: {
        title: "अक्सर पूछे जाने वाले प्रश्न",
        categories: [
          {
            title: "शुरुआत करना",
            icon: Upload,
            questions: [
              {
                q: "मैं किस प्रकार के दस्तावेज़ अपलोड कर सकता हूं?",
                a: "आप PDFs, छवियां (PNG, JPG, JPEG), टेक्स्ट फ़ाइलें (TXT), और Word दस्तावेज़ (DOCX) अपलोड कर सकते हैं। हम 10MB तक के अनुबंध, नीतियां, समझौते और कानूनी दस्तावेज़ों का समर्थन करते हैं।"
              },
              {
                q: "क्या मुझे खाता बनाने की आवश्यकता है?",
                a: "हां, हमें सुरक्षा और अनुपालन उद्देश्यों के लिए बुनियादी जानकारी (नाम, फोन, आधार) की आवश्यकता है। आपकी जानकारी एन्क्रिप्टेड और सुरक्षित रूप से संग्रहीत है।"
              },
              {
                q: "क्या दस्तावेज़ अपलोड की कोई सीमा है?",
                a: "आप एक साथ 5 दस्तावेज़ तक अपलोड कर सकते हैं, प्रत्येक फ़ाइल अधिकतम 10MB की। अपलोड की कोई दैनिक सीमा नहीं है।"
              }
            ]
          },
          {
            title: "AI विश्लेषण",
            icon: FileText,
            questions: [
              {
                q: "AI विश्लेषण कितना सटीक है?",
                a: "हमारे AI मॉडल क्लॉज़ निष्कर्षण और जोखिम मूल्यांकन में 95%+ सटीकता प्राप्त करते हैं। हम हजारों कानूनी दस्तावेजों पर प्रशिक्षित Legal-BERT और GPT-आधारित मॉडल का उपयोग करते हैं।"
              },
              {
                q: "कौन सी भाषाओं का समर्थन है?",
                a: "वर्तमान में हम अंग्रेजी, हिंदी और मराठी का समर्थन करते हैं। वॉइस असिस्टेंट तीनों भाषाओं में दस्तावेजों की व्याख्या कर सकता है।"
              },
              {
                q: "विश्लेषण में कितना समय लगता है?",
                a: "अधिकांश दस्तावेज़ों का विश्लेषण 30-60 सेकंड के भीतर हो जाता है। कई पृष्ठों वाले जटिल दस्तावेज़ों में 2-3 मिनट तक लग सकते हैं।"
              }
            ]
          },
          {
            title: "सुरक्षा और गोपनीयता",
            icon: Shield,
            questions: [
              {
                q: "क्या मेरा डेटा सुरक्षित है?",
                a: "हां, हम सभी डेटा के लिए बैंक-स्तरीय एन्क्रिप्शन (AES-256) का उपयोग करते हैं। दस्तावेज़ों को सुरक्षित रूप से प्रोसेस किया जाता है और अनुरोध पर हमारे सर्वर से हटाया जा सकता है।"
              },
              {
                q: "मेरे दस्तावेज़ कौन देख सकता है?",
                a: "केवल आप अपने अपलोड किए गए दस्तावेज़ों तक पहुंच सकते हैं। हमारा AI उन्हें मानव समीक्षा के बिना स्वचालित रूप से प्रोसेस करता है। हम कभी भी आपके दस्तावेज़ों को तीसरे पक्ष के साथ साझा नहीं करते।"
              },
              {
                q: "क्या मैं अपने दस्तावेज़ हटा सकता हूं?",
                a: "हां, आप अपने डैशबोर्ड से कभी भी अपने दस्तावेज़ हटा सकते हैं। हटाए गए दस्तावेज़ 24 घंटे के भीतर हमारे सर्वर से स्थायी रूप से हटा दिए जाते हैं।"
              }
            ]
          }
        ]
      },
      guide: {
        title: "चरणबद्ध उपयोगकर्ता गाइड",
        steps: [
          {
            step: 1,
            title: "पंजीकरण",
            description: "सुरक्षित पहुंच के लिए अपना नाम, फोन नंबर और आधार नंबर प्रदान करें",
            icon: Settings
          },
          {
            step: 2,
            title: "दस्तावेज़ अपलोड",
            description: "अपने कानूनी दस्तावेज़ों को खींचें और छोड़ें या फ़ाइलें ब्राउज़ करने के लिए क्लिक करें",
            icon: Upload
          },
          {
            step: 3,
            title: "AI विश्लेषण",
            description: "हमारा AI खंड निकालता है, जोखिमों की पहचान करता है और सारांश बनाता है",
            icon: FileText
          },
          {
            step: 4,
            title: "परिणाम समीक्षा",
            description: "निकाले गए खंडों, सारांशों और जोखिम मूल्यांकनों के माध्यम से नेविगेट करें",
            icon: HelpCircle
          },
          {
            step: 5,
            title: "वॉइस असिस्टेंट",
            description: "विशिष्ट खंडों के बारे में प्रश्न पूछें और ऑडियो स्पष्टीकरण प्राप्त करें",
            icon: MessageSquare
          }
        ]
      },
      support: {
        title: "समर्थन संपर्क",
        description: "अतिरिक्त सहायता चाहिए? हमारी समर्थन टीम आपके लिए यहाँ है",
        methods: [
          {
            title: "फोन समर्थन",
            description: "तत्काल सहायता के लिए हमें कॉल करें",
            contact: "+91 98765 43210",
            hours: "सोम-शुक्र: सुबह 9 - शाम 6 IST",
            icon: Phone
          },
          {
            title: "ईमेल समर्थन",
            description: "हमें विस्तृत संदेश भेजें",
            contact: "support@legalai.in",
            hours: "24 घंटे में प्रतिक्रिया",
            icon: Mail
          },
          {
            title: "लाइव चैट",
            description: "कभी भी हमारे AI सहायक से चैट करें",
            contact: "24/7 उपलब्ध",
            hours: "तत्काल प्रतिक्रिया",
            icon: MessageSquare
          }
        ]
      },
      privacy: {
        title: "गोपनीयता और सुरक्षा जानकारी",
        policies: [
          {
            title: "डेटा संग्रह",
            content: "हम केवल आवश्यक जानकारी एकत्र करते हैं: पहचान सत्यापन के लिए नाम, फोन, आधार, और विश्लेषण के लिए अपलोड किए गए दस्तावेज़।"
          },
          {
            title: "डेटा प्रोसेसिंग",
            content: "दस्तावेज़ों को सुरक्षित क्लाउड इंफ्रास्ट्रक्चर पर होस्ट किए गए AI मॉडल का उपयोग करके प्रोसेस किया जाता है। स्वचालित विश्लेषण में कोई मानव समीक्षा शामिल नहीं है।"
          },
          {
            title: "डेटा भंडारण",
            content: "सभी डेटा आराम और परिवहन में एन्क्रिप्टेड है। दस्तावेज़ 30 दिनों के लिए संग्रहीत किए जाते हैं जब तक कि उपयोगकर्ता द्वारा पहले हटा नहीं दिए जाते।"
          },
          {
            title: "डेटा साझाकरण",
            content: "हम कभी भी आपकी व्यक्तिगत जानकारी या दस्तावेज़ों को तीसरे पक्ष के साथ साझा नहीं करते। डेटा का उपयोग केवल हमारी सेवाएं प्रदान करने के लिए किया जाता है।"
          },
          {
            title: "उपयोगकर्ता अधिकार",
            content: "आपको कभी भी अपने डेटा तक पहुंचने, संशोधित करने या हटाने का अधिकार है। डेटा निर्यात या पूर्ण खाता हटाने के लिए हमसे संपर्क करें।"
          }
        ]
      }
    }
  };

  const t = content[currentLanguage as keyof typeof content];

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

        {/* Help Tabs */}
        <Card className="legal-card animate-slide-up">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <CardHeader>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="faq">{t.tabs.faq}</TabsTrigger>
                <TabsTrigger value="guide">{t.tabs.guide}</TabsTrigger>
                <TabsTrigger value="support">{t.tabs.support}</TabsTrigger>
                <TabsTrigger value="privacy">{t.tabs.privacy}</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              {/* FAQ Tab */}
              <TabsContent value="faq" className="space-y-6">
                <h3 className="text-2xl font-semibold mb-6">{t.faq.title}</h3>
                
                {t.faq.categories.map((category, categoryIndex) => (
                  <Card key={categoryIndex} className="border-l-4 border-l-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <category.icon className="w-4 h-4 text-primary" />
                        </div>
                        <span>{category.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible>
                        {category.questions.map((qa, qaIndex) => (
                          <AccordionItem key={qaIndex} value={`item-${categoryIndex}-${qaIndex}`}>
                            <AccordionTrigger className="text-left">
                              {qa.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              {qa.a}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* User Guide Tab */}
              <TabsContent value="guide" className="space-y-6">
                <h3 className="text-2xl font-semibold mb-6">{t.guide.title}</h3>
                
                <div className="space-y-6">
                  {t.guide.steps.map((step, index) => (
                    <Card key={index} className="border-l-4 border-l-primary/20">
                      <CardContent className="pt-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                              {step.step}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <step.icon className="w-5 h-5 text-primary" />
                              <h4 className="text-lg font-semibold">{step.title}</h4>
                            </div>
                            <p className="text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Support Tab */}
              <TabsContent value="support" className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold mb-2">{t.support.title}</h3>
                  <p className="text-muted-foreground">{t.support.description}</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {t.support.methods.map((method, index) => (
                    <Card key={index} className="legal-card text-center">
                      <CardHeader>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <method.icon className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{method.title}</CardTitle>
                        <CardDescription>{method.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Badge variant="outline" className="text-sm">
                            {method.contact}
                          </Badge>
                          <p className="text-xs text-muted-foreground">{method.hours}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Privacy Tab */}
              <TabsContent value="privacy" className="space-y-6">
                <h3 className="text-2xl font-semibold mb-6">{t.privacy.title}</h3>
                
                <div className="space-y-4">
                  {t.privacy.policies.map((policy, index) => (
                    <Card key={index} className="border-l-4 border-l-primary/20">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-3">
                          <Shield className="w-5 h-5 text-primary" />
                          <span>{policy.title}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{policy.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}