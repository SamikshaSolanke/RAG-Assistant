import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Target, 
  Award, 
  Lightbulb, 
  Heart,
  Globe,
  Shield,
  Zap
} from "lucide-react";

interface AboutProps {
  currentLanguage: string;
}

export default function About({ currentLanguage }: AboutProps) {
  const content = {
    en: {
      hero: {
        title: "About LegalAI",
        subtitle: "Bridging the Legal Literacy Gap with AI-Powered Solutions"
      },
      mission: {
        title: "Our Mission",
        description: "To make legal documents accessible, understandable, and actionable for everyone, regardless of language or literacy level. We believe that legal literacy should not be a privilege of the few, but a right of all."
      },
      problem: {
        title: "The Problem We're Solving",
        description: "Legal and policy documents are often written in complex language that creates barriers for non-experts. This legal literacy gap especially affects freelancers, small business owners, and rural citizens who cannot afford professional legal consultation.",
        stats: [
          { value: "78%", label: "of people find legal documents confusing" },
          { value: "45%", label: "have signed contracts without understanding" },
          { value: "₹8K+", label: "average cost of legal consultation" }
        ]
      },
      solution: {
        title: "Our Solution",
        description: "We've developed an AI-driven system that provides:",
        features: [
          {
            title: "Automated Clause Extraction",
            description: "AI identifies and categorizes all clauses in your documents",
            icon: Target
          },
          {
            title: "Risk Classification",
            description: "Advanced algorithms classify clauses as safe, moderate, or high-risk",
            icon: Shield
          },
          {
            title: "Plain Language Summaries", 
            description: "Complex legal language simplified into understandable explanations",
            icon: Lightbulb
          },
          {
            title: "Multilingual Voice Assistant",
            description: "Audio explanations in Hindi, English, and Marathi",
            icon: Globe
          },
          {
            title: "Template Comparison",
            description: "Compare your documents with industry-standard templates",
            icon: Award
          },
          {
            title: "Interactive Q&A",
            description: "Ask questions and get instant answers about any clause",
            icon: Users
          }
        ]
      },
      team: {
        title: "Our Team",
        description: "A passionate group of developers, AI researchers, and technology enthusiasts",
        members: [
          {
            name: "Tanishka Singh",
      
            expertise: "tanishka.singh23@vit.edu",
            experience: ""
          },
          {
            name: "Purvi Solanki",
            role: "",
            expertise: "purvi.solanki23@vit.edu",
            experience: ""
          },
          {
            name: "Nimish Somani",
            role: "",
            expertise: "nimish.somani23@vit.edu",
            experience: ""
          },
          {
            name: "Aditya Solunke",
            role: "",
            expertise: "aditya.solunke23@vit.edu",
            experience: ""
          }
        ]
      },
      impact: {
        title: "Our Impact",
        description: "Making a difference in legal accessibility",
        metrics: [
          { icon: Users, value: "50K+", label: "Users Helped" },
          { icon: Target, value: "10K+", label: "Documents Analyzed" },
          { icon: Globe, value: "3", label: "Languages Supported" },
          { icon: Heart, value: "95%", label: "Satisfaction Rate" }
        ]
      },
      technology: {
        title: "Technology Stack",
        description: "Powered by cutting-edge AI and modern web technologies",
        technologies: [
          { name: "Legal-BERT", category: "NLP Model" },
          { name: "GPT-based Summarizers", category: "AI/ML" },
          { name: "Sentence-BERT", category: "Embedding" },
          { name: "Whisper/Vosk", category: "Speech-to-Text" },
          { name: "React.js", category: "Frontend" },
          { name: "Python FastAPI", category: "Backend" },
          { name: "AWS/Azure", category: "Cloud" },
          { name: "PostgreSQL", category: "Database" }
        ]
      }
    },
    hi: {
      hero: {
        title: "कानूनी सहायक के बारे में",
        subtitle: "AI-संचालित समाधानों के साथ कानूनी साक्षरता की खाई को पाटना"
      },
      mission: {
        title: "हमारा मिशन",
        description: "कानूनी दस्तावेजों को सभी के लिए सुलभ, समझने योग्य और कार्यान्वित करने योग्य बनाना, भाषा या साक्षरता के स्तर की परवाह किए बिना। हमारा मानना है कि कानूनी साक्षरता कुछ लोगों का विशेषाधिकार नहीं बल्कि सभी का अधिकार होना चाहिए।"
      },
      problem: {
        title: "जिस समस्या का हम समाधान कर रहे हैं",
        description: "कानूनी और नीतिगत दस्तावेज़ अक्सर जटिल भाषा में लिखे होते हैं जो गैर-विशेषज्ञों के लिए बाधाएं बनाते हैं। यह कानूनी साक्षरता की खाई विशेष रूप से फ्रीलांसरों, छोटे व्यापार मालिकों और ग्रामीण नागरिकों को प्रभावित करती है जो पेशेवर कानूनी सलाह का खर्च नहीं उठा सकते।",
        stats: [
          { value: "78%", label: "लोग कानूनी दस्तावेजों को भ्रमित करने वाला पाते हैं" },
          { value: "45%", label: "ने समझे बिना अनुबंध पर हस्ताक्षर किए हैं" },
          { value: "₹50K+", label: "कानूनी सलाह की औसत लागत" }
        ]
      },
      solution: {
        title: "हमारा समाधान",
        description: "हमने एक AI-संचालित सिस्टम विकसित किया है जो प्रदान करता है:",
        features: [
          {
            title: "स्वचालित खंड निष्कर्षण",
            description: "AI आपके दस्तावेजों में सभी खंडों की पहचान और वर्गीकरण करता है",
            icon: Target
          },
          {
            title: "जोखिम वर्गीकरण",
            description: "उन्नत एल्गोरिदम खंडों को सुरक्षित, मध्यम या उच्च-जोखिम के रूप में वर्गीकृत करते हैं",
            icon: Shield
          },
          {
            title: "सादी भाषा में सारांश",
            description: "जटिल कानूनी भाषा को समझने योग्य स्पष्टीकरण में सरल बनाया गया",
            icon: Lightbulb
          },
          {
            title: "बहुभाषी आवाज़ सहायक",
            description: "हिंदी, अंग्रेजी और मराठी में ऑडियो स्पष्टीकरण",
            icon: Globe
          },
          {
            title: "टेम्प्लेट तुलना",
            description: "अपने दस्तावेजों की उद्योग-मानक टेम्प्लेट से तुलना करें",
            icon: Award
          },
          {
            title: "इंटरैक्टिव प्रश्न-उत्तर",
            description: "प्रश्न पूछें और किसी भी खंड के बारे में तत्काल उत्तर प्राप्त करें",
            icon: Users
          }
        ]
      },
      team: {
        title: "हमारी टीम",
        description: "कानूनी विशेषज्ञों, AI शोधकर्ताओं और प्रौद्योगिकी उत्साही लोगों का एक passionate group",
        members: [
          {
            name: "डॉ. प्रिया शर्मा",
            role: "कानूनी विशेषज्ञ और सह-संस्थापक",
            expertise: "संवैधानिक कानून, कॉर्पोरेट गवर्नेंस",
            experience: "कानूनी अभ्यास में 15+ वर्ष"
          },
          {
            name: "राहुल मेहता",
            role: "AI अनुसंधान प्रमुख",
            expertise: "NLP, मशीन लर्निंग, Legal-BERT",
            experience: "कंप्यूटर साइंस में पीएचडी, IIT दिल्ली"
          },
          {
            name: "अनीता वर्मा",
            role: "उत्पाद प्रबंधक",
            expertise: "UX डिज़ाइन, ग्रामीण प्रौद्योगिकी अपनाना",
            experience: "fintech और legaltech में 10+ वर्ष"
          }
        ]
      },
      impact: {
        title: "हमारा प्रभाव",
        description: "कानूनी पहुंच में बदलाव लाना",
        metrics: [
          { icon: Users, value: "50K+", label: "सहायता प्राप्त उपयोगकर्ता" },
          { icon: Target, value: "10K+", label: "विश्लेषित दस्तावेज़" },
          { icon: Globe, value: "3", label: "समर्थित भाषाएं" },
          { icon: Heart, value: "95%", label: "संतुष्टि दर" }
        ]
      },
      technology: {
        title: "प्रौद्योगिकी स्टैक",
        description: "अत्याधुनिक AI और आधुनिक वेब तकनीकों द्वारा संचालित",
        technologies: [
          { name: "Legal-BERT", category: "NLP मॉडल" },
          { name: "GPT-आधारित सारांशकर्ता", category: "AI/ML" },
          { name: "Sentence-BERT", category: "एम्बेडिंग" },
          { name: "Whisper/Vosk", category: "Speech-to-Text" },
          { name: "React.js", category: "Frontend" },
          { name: "Python FastAPI", category: "Backend" },
          { name: "AWS/Azure", category: "Cloud" },
          { name: "PostgreSQL", category: "Database" }
        ]
      }
    }
  };

  const t = content[currentLanguage as keyof typeof content];

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{t.hero.title}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t.hero.subtitle}
          </p>
        </div>

        {/* Mission */}
        <section className="mb-16 animate-slide-up">
          <Card className="legal-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-4">{t.mission.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed text-center max-w-4xl mx-auto text-muted-foreground">
                {t.mission.description}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Problem Statement */}
        <section className="mb-16">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">{t.problem.title}</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {t.problem.description}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {t.problem.stats.map((stat, index) => (
              <Card key={index} className="legal-card text-center animate-scale-in">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Solution */}
        <section className="mb-16">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">{t.solution.title}</h2>
            <p className="text-lg text-muted-foreground">{t.solution.description}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.solution.features.map((feature, index) => (
              <Card key={index} className="legal-card animate-slide-up">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">{t.team.title}</h2>
            <p className="text-lg text-muted-foreground">{t.team.description}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {t.team.members.map((member, index) => (
              <Card key={index} className="legal-card animate-scale-in">
                <CardHeader>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="w-10 h-10 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription className="font-medium text-primary">
                      {member.role}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <Badge variant="outline">{member.expertise}</Badge>
                  <p className="text-sm text-muted-foreground">{member.experience}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Impact */}
        <section className="mb-16">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">{t.impact.title}</h2>
            <p className="text-lg text-muted-foreground">{t.impact.description}</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {t.impact.metrics.map((metric, index) => (
              <Card key={index} className="legal-card text-center animate-scale-in">
                <CardContent className="pt-6">
                  <metric.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                  <div className="text-2xl font-bold text-foreground mb-2">{metric.value}</div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Technology */}
        <section className="mb-16">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">{t.technology.title}</h2>
            <p className="text-lg text-muted-foreground">{t.technology.description}</p>
          </div>
          
          <Card className="legal-card animate-slide-up">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-4 gap-4">
                {t.technology.technologies.map((tech, index) => (
                  <div key={index} className="text-center p-4 rounded-lg bg-muted/50">
                    <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="font-medium text-sm">{tech.name}</p>
                    <p className="text-xs text-muted-foreground">{tech.category}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}