import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Clock, User, Phone, CreditCard } from "lucide-react";

interface ProfileProps {
  currentLanguage?: string;
}

export default function Profile({ currentLanguage = "en" }: ProfileProps) {
  const t = {
    en: {
      title: "My Profile",
      personalInfo: "Personal Information",
      documentHistory: "Document History",
      name: "Name",
      phone: "Phone",
      aadhaar: "Aadhaar Number",
      noDocuments: "No documents uploaded yet",
      uploadFirst: "Upload Document",
      viewAnalysis: "View Analysis",
      uploaded: "Uploaded",
      processed: "Processed",
      riskLevel: "Risk Level"
    },
    hi: {
      title: "मेरी प्रोफ़ाइल",
      personalInfo: "व्यक्तिगत जानकारी",
      documentHistory: "दस्तावेज़ इतिहास",
      name: "नाम",
      phone: "फोन",
      aadhaar: "आधार नंबर",
      noDocuments: "अभी तक कोई दस्तावेज़ अपलोड नहीं किया गया",
      uploadFirst: "दस्तावेज़ अपलोड करें",
      viewAnalysis: "विश्लेषण देखें",
      uploaded: "अपलोड किया गया",
      processed: "प्रोसेसिंग पूर्ण",
      riskLevel: "जोखिम स्तर"
    }
  };

  const text = t[currentLanguage as keyof typeof t];

  // Mock user data (will be replaced with real data later)
  const userInfo = {
    name: "Tanishka Singh",
    phone: "+91 98765 43210",
    aadhaar: "XXXX XXXX 1234"
  };

  // Mock document history (will be replaced with real data later)
  const documentHistory = [
    {
      id: "1",
      name: "LEAVE AND LICENCSE AGREEMENT.pdf",
      type: "Rental Agreement",
      uploadDate: "2025-09-16",
      status: "processed",
      riskLevel: "low"
    },
    {
      id: "2", 
      name: "Rental_Agreement.pdf",
      type: "Rental Agreement",
      uploadDate: "2024-09-15",
      status: "processed",
      riskLevel: "medium"
    },
    {
      id: "3",
      name: "Business_Partnership_Agreement.pdf", 
      type: "Business Agreement",
      uploadDate: "2024-09-15",
      status: "processed",
      riskLevel: "high"
    }
  ];

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case "low": return "default";
      case "medium": return "secondary"; 
      case "high": return "destructive";
      default: return "default";
    }
  };

  const getRiskLabel = (level: string) => {
    const riskLabels = {
      en: { low: "Low Risk", medium: "Medium Risk", high: "High Risk" },
      hi: { low: "कम जोखिम", medium: "मध्यम जोखिम", high: "उच्च जोखिम" }
    };
    return riskLabels[currentLanguage as keyof typeof riskLabels][level as keyof typeof riskLabels.en];
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">{text.title}</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Personal Information Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                {text.personalInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{text.name}</p>
                  <p className="font-medium">{userInfo.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{text.phone}</p>
                  <p className="font-medium">{userInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{text.aadhaar}</p>
                  <p className="font-medium">{userInfo.aadhaar}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document History */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {text.documentHistory}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {documentHistory.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">{text.noDocuments}</p>
                  <Link to="/upload">
                    <Button>{text.uploadFirst}</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {documentHistory.map((doc) => (
                    <Card key={doc.id} className="border-l-4 border-l-primary/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">{doc.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{doc.type}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{text.uploaded}: {new Date(doc.uploadDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{text.processed}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm text-muted-foreground">{text.riskLevel}:</span>
                              <Badge variant={getRiskBadgeVariant(doc.riskLevel)}>
                                {getRiskLabel(doc.riskLevel)}
                              </Badge>
                            </div>
                          </div>
                          
                          <Link to={`/analysis?document=${doc.id}`}>
                            <Button variant="outline" size="sm">
                              {text.viewAnalysis}
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}