import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import VoiceAssistantTab from "@/components/VoiceAssistantTab";
import ClauseCard from '@/components/ClauseCard';
import { useSession } from '@/contexts/SessionContext';
import { useSummarizeDocument, useQueryDocument, useCompareClause, useAnalyzeRisks, useExtractClauses } from '@/hooks/useApiMutations';



import { 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Download,
  ArrowLeft,
  Mic,
  Volume2,
  Eye,
  MessageSquare
} from "lucide-react";

interface DocumentAnalysisProps {
  currentLanguage: string;
}

export default function DocumentAnalysis({ currentLanguage }: DocumentAnalysisProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("clauses");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const { sessionId, filename, chunkCount, isSessionActive } = useSession();

  const summarizeMutation = useSummarizeDocument();
  const queryMutation = useQueryDocument();
  const compareMutation = useCompareClause();
  const analyzeMutation = useAnalyzeRisks();
  const extractMutation = useExtractClauses();

  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [qaAnswer, setQaAnswer] = useState<string | null>(null);
  const [qaHistory, setQaHistory] = useState<Array<{ question: string; answer: string }>>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [selectedDocumentClause, setSelectedDocumentClause] = useState<string>("");
  const [standardClauseInput, setStandardClauseInput] = useState<string>("");
  // Store raw extracted output from API (may be array or JSON-string)
  const [extractedClausesRaw, setExtractedClausesRaw] = useState<any>(null);
  const [analysisMetrics, setAnalysisMetrics] = useState<any | null>(null);
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);

  useEffect(() => {
    if (!isSessionActive) {
      // no session - redirect to upload
      navigate('/upload');
    }
  }, [isSessionActive, navigate]);

  const content = {
    en: {
      title: "Document Analysis Results",
      subtitle: "AI-powered analysis of your legal document",
      tabs: {
        clauses: "Clause Extraction",
        summary: "Simplified Summary", 
        comparison: "Template Comparison",
        voice: "Voice Assistant",
      qa: "Ask Questions"
      },
      analysis: {
        riskLevel: "Risk Assessment",
        confidenceScore: "Confidence Score",
        downloadReport: "Download Report",
        backToUpload: "Upload Another Document"
      },
      clauses: {
        title: "Extracted Clauses",
        riskLevels: {
          safe: "Safe",
          moderate: "Moderate Risk",
          high: "High Risk"
        }
      },
      summary: {
        title: "Plain Language Summary",
        keyPoints: "Key Points"
      },
      comparison: {
        title: "Template Comparison",
        standard: "Standard Clause",
        document: "Your Document",
        deviations: "Deviations Found",
        selectDocumentClause: "Select a clause from document",
        enterStandardClause: "Enter standard clause text to compare",
        compareButton: "Compare Clauses",
        comparing: "Comparing...",
        noClausesExtracted: "No clauses available. Extract clauses first.",
        enterBothClauses: "Please enter both clauses to compare",
        comparisonResult: "Comparison Result"
      },
      voice: {
        title: "Voice Assistant",
        description: "Click the microphone to ask questions about your document",
        startRecording: "Start Recording",
        stopRecording: "Stop Recording",
        playback: "Play Summary"
      },
      qa: {
        title: "Ask Questions About the Document",
        placeholder: "Type your question about the document...",
        send: "Send",
        askAnother: "Ask Another Question"
      }
    },
    hi: {
      title: "दस्तावेज़ विश्लेषण परिणाम",
      subtitle: "आपके कानूनी दस्तावेज़ का AI-संचालित विश्लेषण",
      tabs: {
        clauses: "खंड निष्कर्षण",
        summary: "सरलीकृत सारांश",
        comparison: "टेम्प्लेट तुलना",
        voice: "आवाज़ सहायक",
      qa: "प्रश्न पूछें"
      },
      analysis: {
        riskLevel: "जोखिम मूल्यांकन",
        confidenceScore: "विश्वास स्कोर",
        downloadReport: "रिपोर्ट डाउनलोड करें",
        backToUpload: "अन्य दस्तावेज़ अपलोड करें"
      },
      clauses: {
        title: "निकाले गए खंड",
        riskLevels: {
          safe: "सुरक्षित",
          moderate: "मध्यम जोखिम",
          high: "उच्च जोखिम"
        }
      },
      summary: {
        title: "सादी भाषा में सारांश",
        keyPoints: "मुख्य बिंदु"
      },
      comparison: {
        title: "टेम्प्लेट तुलना",
        standard: "मानक खंड",
        document: "आपका दस्तावेज़",
        deviations: "पाए गए विचलन",
        selectDocumentClause: "दस्तावेज़ से एक खंड चुनें",
        enterStandardClause: "तुलना के लिए मानक खंड टेक्स्ट दर्ज करें",
        compareButton: "खंडों की तुलना करें",
        comparing: "तुलना जारी है...",
        noClausesExtracted: "कोई खंड उपलब्ध नहीं है। पहले खंड निकालें।",
        enterBothClauses: "तुलना के लिए दोनों खंड दर्ज करें",
        comparisonResult: "तुलना परिणाम"
      },
      voice: {
        title: "आवाज़ सहायक",
        description: "अपने दस्तावेज़ के बारे में प्रश्न पूछने के लिए माइक्रोफोन पर क्लिक करें",
        startRecording: "रिकॉर्डिंग शुरू करें",
        stopRecording: "रिकॉर्डिंग बंद करें",
        playback: "सारांश चलाएं"
      },
      qa: {
        title: "दस्तावेज़ के बारे में प्रश्न पूछें",
        placeholder: "दस्तावेज़ के बारे में अपना प्रश्न टाइप करें...",
        send: "भेजें",
        askAnother: "एक और प्रश्न पूछें"
      }
    }
  };

  const t = content[currentLanguage as keyof typeof content];

  // If session exists, we will lazy-load data per tab

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "safe":
        return "bg-success text-success-foreground";
      case "moderate":
        return "bg-warning text-warning-foreground";
      case "high":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // When switching tabs, trigger appropriate API calls
  useEffect(() => {
    if (!sessionId) return;

    if (activeTab === 'summary') {
      summarizeMutation.mutate(sessionId, {
        onSuccess: (data) => setSummaryText(data.summary),
      });
    }

    if (activeTab === 'clauses') {
      extractMutation.mutate({ sessionId }, {
        onSuccess: (data) => {
          // Save the original API JSON response so we can parse nested JSON inside it
          setExtractedClausesRaw(data);
        }
      });
    }

    if (activeTab === 'voice') {
      // no-op: VoiceAssistantTab handles voice
    }
  }, [activeTab, sessionId]);

  // Perform risk analysis lazily as needed
  const runRiskAnalysis = () => {
    if (!sessionId) return;
    analyzeMutation.mutate({ sessionId, analysisType: 'risk' }, {
      onSuccess: (data) => {
        // attempt to parse metrics from analysis text if structured; fallback to null
        setAnalysisMetrics({ raw: data.analysis, type: data.analysis_type });
      }
    });
  };

  // Query handler for Q&A
  const handleQuery = (question: string) => {
    if (!sessionId) return;
    queryMutation.mutate({ sessionId, query: question }, {
      onSuccess: (data) => {
        setQaAnswer(data.answer);
      },
    });
  };

  // Compare handler
  const handleCompare = (documentClause: string, standardClause: string) => {
    if (!sessionId || !documentClause.trim() || !standardClause.trim()) return;
    
    // Create a comparison prompt that includes both clauses
     const comparisonPrompt = `Compare these two clauses in exactly 3 lines:
  - Line 1: Key differences
  - Line 2: Missing provisions in document clause
  - Line 3: Risk level (safe/moderate/high) and recommendation

  DOCUMENT CLAUSE: ${documentClause}

  STANDARD CLAUSE: ${standardClause}`;

    compareMutation.mutate({ sessionId, clause: comparisonPrompt }, {
      onSuccess: (data) => setComparisonResult(data.comparison),
    });
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "safe":
        return <CheckCircle className="w-4 h-4" />;
      case "moderate":
        return <AlertTriangle className="w-4 h-4" />;
      case "high":
        return <Shield className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // Strict parseNestedClauses per spec: extract rawData.clauses?.[0]?.text,
  // strip fences with /```json|```/g, then JSON.parse and normalize.
  function parseNestedClauses(rawData: any) {
    if (!rawData) return [];

    // Helper to normalize a parsed clause array
    const normalize = (arr: any[]) => arr.map((item: any, idx: number) => ({
      id: idx,
      text: item.clause_text ?? item.text ?? '',
      type: item.clause_type_category ?? item.clause_type ?? item.type ?? 'Unspecified',
      risk: (item.risk_level ?? item.risk ?? 'moderate').toString().toLowerCase(),
      implications: item.brief_explanation_of_implications ?? item.implications ?? null,
    }));

    // 2. Extract candidate string
    const block = rawData?.clauses?.[0]?.text ?? rawData?.clauses?.[0]?.body ?? null;

    // 3. If block missing → attempt to find JSON elsewhere
    let candidate = typeof block === 'string' ? block : null;

    // If we have a candidate string, strip fences and try strict parse first
    if (candidate) {
      const cleaned = candidate.replace(/```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      try {
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed)) return normalize(parsed);
      } catch (err) {
        // continue to fallbacks
      }

      // Fallback 1: unquote wrapper
      try {
        const unquoted = cleaned.replace(/^\"|\"$/g, '');
        const parsed2 = JSON.parse(unquoted);
        if (Array.isArray(parsed2)) return normalize(parsed2);
      } catch (err) {
        // continue
      }

      // Fallback 1b: unescape typical escape sequences (\n, \") that LLMs sometimes produce
      try {
        const unescaped = cleaned.replace(/\\n/g, '').replace(/\\r/g, '').replace(/\\"/g, '"');
        const parsedU = JSON.parse(unescaped);
        if (Array.isArray(parsedU)) return normalize(parsedU);
      } catch (err) {
        // continue
      }

      // Fallback 2: extract first JSON array substring
      const firstBracket = cleaned.indexOf('[');
      const lastBracket = cleaned.lastIndexOf(']');
      if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
        const sub = cleaned.substring(firstBracket, lastBracket + 1);
        try {
          const parsed3 = JSON.parse(sub);
          if (Array.isArray(parsed3)) return normalize(parsed3);
        } catch (err) {
          // continue
        }
      }

      // Fallback 3: try to extract individual JSON objects when array markers are missing
      try {
        const objMatches = cleaned.match(/{[\s\S]*?}/g) || [];
        const objs: any[] = [];
        for (const m of objMatches) {
          try {
            const p = JSON.parse(m);
            objs.push(p);
          } catch (e) {
            // ignore parse errors per-object
          }
        }
        if (objs.length > 0) return normalize(objs);
      } catch (err) {
        // continue
      }
    }

    // If candidate not present or all fallbacks failed, try searching the entire rawData JSON string
    try {
      const asString = JSON.stringify(rawData);
      const fb = asString.indexOf('[');
      const lb = asString.lastIndexOf(']');
      if (fb !== -1 && lb !== -1 && lb > fb) {
        const sub = asString.substring(fb, lb + 1);
        try {
          const parsedFull = JSON.parse(sub);
          if (Array.isArray(parsedFull)) return normalize(parsedFull);
        } catch (err) {
          // ignore
        }
      }
    } catch (err) {
      // ignore
    }

    // As a last resort, if rawData.clauses is already an array of clause-like objects, normalize them
    if (Array.isArray(rawData?.clauses)) {
      const arr = rawData.clauses.map((it: any) => {
        // if item has text which itself is a JSON string, ignore here
        return {
          id: it.id ?? null,
          text: it.text ?? it.clause_text ?? '',
          type: it.type ?? it.clause_type ?? it.category ?? 'Unspecified',
          risk: (it.risk ?? it.risk_level ?? 'moderate').toString().toLowerCase(),
          implications: it.implications ?? null,
        };
      });
      return arr;
    }

    return [];
  }

  // generateSummary: if backend summary exists in rawData.summary use it; otherwise
  // create an auto-summary from parsed clauses (first 3-5 clauses)
  function generateSummary(rawData: any, parsedClauses: any[]) {
    // Prefer backend-provided summary if available
    const backendSummary = rawData?.summary;
    if (backendSummary && typeof backendSummary === 'string' && backendSummary.trim().length > 0) {
      return backendSummary;
    }

    if (!parsedClauses || parsedClauses.length === 0) return 'No summary available.';

    const take = parsedClauses.slice(0, 5);
    const categories = Array.from(new Set(take.map((c: any) => (c.type || '').trim()).filter(Boolean)));
    const implications = take.map((c: any) => c.implications).filter(Boolean).slice(0, 5);
    const risks = Array.from(new Set(take.map((c: any) => (c.risk || '').toString().toLowerCase()).filter(Boolean)));

    // Build concise summary following rules: combine categories and risks, describe purpose, highlight potential risks
    const catPart = categories.length > 0 ? `${categories.slice(0,4).join(', ')}` : 'general contractual terms';
    const riskPart = risks.length > 0 ? `Risks identified: ${risks.join(', ')}.` : '';
    const implicPart = implications.length > 0 ? `Notable implications include ${implications.join('; ')}.` : '';

    const summary = `This document contains clauses related to ${catPart}. ${implicPart} ${riskPart}`.replace(/\s+/g, ' ').trim();
    return summary;
  }

  // Compute parsed clauses and summary for rendering
  const parsedClauses = parseNestedClauses(extractedClausesRaw);
  const [showRawDebug, setShowRawDebug] = useState(false);
  // Helper: extract individual JSON objects from a text block when array markers are missing
  function extractObjectsFromText(text: string) {
    if (!text) return [];
    try {
      const matches = text.match(/{[\s\S]*?}/g) || [];
      const objs: any[] = [];
      for (const m of matches) {
        try {
          const p = JSON.parse(m);
          objs.push(p);
        } catch (e) {
          // ignore per-object parse errors
        }
      }
      return objs;
    } catch (err) {
      return [];
    }
  }

  // If strict parsedClauses is empty, try extracting objects from inner block
  const _innerBlockRaw: string | null = extractedClausesRaw?.clauses?.[0]?.text ?? null;
  const cleanedInnerBlock = _innerBlockRaw ? _innerBlockRaw.replace(/```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim() : null;
  const objectMatches = cleanedInnerBlock ? extractObjectsFromText(cleanedInnerBlock) : [];
  // Normalize objectMatches into clause shape
  const objectClauses = objectMatches.map((item: any, idx: number) => ({
    id: idx,
    text: item.clause_text ?? item.text ?? '',
    type: item.clause_type_category ?? item.clause_type ?? item.type ?? 'Unspecified',
    risk: (item.risk_level ?? item.risk ?? 'moderate').toString().toLowerCase(),
    implications: item.brief_explanation_of_implications ?? item.implications ?? null,
  }));

  const effectiveClauses = parsedClauses.length > 0 ? parsedClauses : objectClauses;
  // detect which parsing strategy produced results
  const parseMethod = parsedClauses.length > 0 ? 'array' : (objectClauses.length > 0 ? 'objects' : (cleanedInnerBlock ? 'raw-text' : 'none'));
  const finalSummary = generateSummary(extractedClausesRaw, effectiveClauses);

  return (
    <div className="min-h-screen py-8 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link to="/upload">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.analysis.backToUpload}
            </Button>
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-lg text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* Analysis Overview (uses available metrics or placeholders) */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="legal-card animate-scale-in">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">
                  {analysisMetrics?.riskLevel ?? '—'}%
                </div>
                <p className="text-sm text-muted-foreground">{t.analysis.riskLevel}</p>
                <Progress value={analysisMetrics?.riskLevel ?? 0} className="mt-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="legal-card animate-scale-in">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-2">
                  {analysisMetrics?.confidenceScore ?? '—'}%
                </div>
                <p className="text-sm text-muted-foreground">{t.analysis.confidenceScore}</p>
                <Progress value={analysisMetrics?.confidenceScore ?? 0} className="mt-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="legal-card animate-scale-in">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-2">
                  {analysisMetrics?.totalClauses ?? parsedClauses.length}
                </div>
                <p className="text-sm text-muted-foreground">Total Clauses</p>
                <div className="flex justify-center space-x-1 mt-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="legal-card animate-scale-in">
            <CardContent className="pt-6 text-center">
              <Button className="legal-button-primary" onClick={() => {
                // build a lightweight report payload
                const report = { summary: finalSummary, clauses: parsedClauses, analysis: analysisMetrics, comparison: comparisonResult };
                const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${filename ?? 'report'}-analysis.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}>
                <Download className="w-4 h-4 mr-2" />
                {t.analysis.downloadReport}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Tabs */}
        <Card className="legal-card animate-fade-in">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <CardHeader>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="clauses">{t.tabs.clauses}</TabsTrigger>
                <TabsTrigger value="summary">{t.tabs.summary}</TabsTrigger>
                <TabsTrigger value="comparison">{t.tabs.comparison}</TabsTrigger>
                <TabsTrigger value="qa">{t.tabs.qa}</TabsTrigger>
                <TabsTrigger value="voice">{t.tabs.voice}</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              <TabsContent value="clauses" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{t.clauses.title}</h3>
                  <div className="flex space-x-2">
                    {(() => {
                      const parsed = parsedClauses;
                      const safeCount = parsed.filter((c: any) => (c.risk ?? '') === 'safe').length;
                      const moderateCount = parsed.filter((c: any) => (c.risk ?? '') === 'moderate').length;
                      const highCount = parsed.filter((c: any) => (c.risk ?? '') === 'high').length;
                      return (
                        <>
                          <Badge className={getRiskColor('safe')}>{safeCount} Safe</Badge>
                          <Badge className={getRiskColor('moderate')}>{moderateCount} Moderate</Badge>
                          <Badge className={getRiskColor('high')}>{highCount} High Risk</Badge>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="space-y-4">
                  {extractMutation.isPending && <div className="text-sm text-muted-foreground">Processing clauses...</div>}

                  {/* Brief document summary (backend summary preferred, otherwise generated) */}
                  <Card className="mb-4">
                    <CardContent>
                      <h4 className="font-semibold">Brief Document Summary</h4>
                      <p className="text-sm text-muted-foreground">{finalSummary}</p>
                      <div className="mt-2 text-xs text-muted-foreground">Parsing method: <span className="font-medium">{parseMethod}</span></div>
                    </CardContent>
                  </Card>

                    {/* Debug toggle to inspect raw API payload when troubleshooting parsing */}
                    <div className="mb-2">
                      <Button variant="ghost" onClick={() => setShowRawDebug(v => !v)}>
                        {showRawDebug ? 'Hide raw API response (debug)' : 'Show raw API response (debug)'}
                      </Button>
                    </div>
                    {showRawDebug && (
                      <Card className="mb-4">
                        <CardContent>
                          <pre className="text-xs max-h-60 overflow-auto">{JSON.stringify(extractedClausesRaw, null, 2)}</pre>
                        </CardContent>
                      </Card>
                    )}

                  {/* Render clauses from the structured API response */}
                  {(() => {
                    const parsed = parsedClauses;

                    if (extractMutation.isPending) {
                      return null;
                    }

                    if (parsed.length === 0) {
                      return (
                        <div>
                          <div className="text-sm text-muted-foreground mb-2">No clauses extracted.</div>
                          {cleanedInnerBlock ? (
                            <Card className="mb-4">
                              <CardContent>
                                <h4 className="font-semibold mb-2">Raw inner clause block (cleaned)</h4>
                                <pre className="text-xs max-h-64 overflow-auto whitespace-pre-wrap">{cleanedInnerBlock}</pre>
                              </CardContent>
                            </Card>
                          ) : null}
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        {parsed.map((c: any, i: number) => (
                          <ClauseCard key={i} clause={c} />
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </TabsContent>

              <TabsContent value="summary" className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">{t.summary.title}</h3>
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    {summarizeMutation.isPending && <p className="text-sm text-muted-foreground">Generating summary...</p>}
                    {!summarizeMutation.isPending && !summaryText && (
                      <p className="text-sm text-muted-foreground">No summary available. Activate this tab to generate a summary.</p>
                    )}
                    {summaryText && (
                      <>
                        <p className="text-sm leading-relaxed mb-4">{summaryText}</p>
                        <h4 className="font-semibold mb-2">{t.summary.keyPoints}:</h4>
                        {/* Potentially parse key points from summary or show as bullet points */}
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comparison" className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">{t.comparison.title}</h3>
                
                {/* Clause Selection and Input */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Document Clause Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">{t.comparison.document}</CardTitle>
                      <CardDescription>{t.comparison.selectDocumentClause}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {extractMutation.isPending || !parsedClauses || parsedClauses.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                          {extractMutation.isPending ? "Extracting clauses..." : t.comparison.noClausesExtracted}
                        </div>
                      ) : (
                        <>
                          <select
                            value={selectedDocumentClause}
                            onChange={(e) => setSelectedDocumentClause(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">-- Select a clause --</option>
                            {parsedClauses.map((clause: any, idx: number) => (
                              <option key={idx} value={clause.text}>
                                {clause.type.substring(0, 50)}... ({clause.risk})
                              </option>
                            ))}
                          </select>
                          
                          {selectedDocumentClause && (
                            <div className="bg-muted/50 rounded-lg p-3 border">
                              <p className="text-xs font-semibold text-muted-foreground mb-2">Selected Clause:</p>
                              <p className="text-sm whitespace-pre-wrap">{selectedDocumentClause}</p>
                            </div>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Standard Clause Input */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">{t.comparison.standard}</CardTitle>
                      <CardDescription>{t.comparison.enterStandardClause}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <textarea
                        value={standardClauseInput}
                        onChange={(e) => setStandardClauseInput(e.target.value)}
                        placeholder={`Example: "The employee may be terminated at-will with 30 days notice..."`}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary h-40 resize-none"
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Compare Button */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleCompare(selectedDocumentClause, standardClauseInput)}
                    disabled={compareMutation.isPending || !selectedDocumentClause.trim() || !standardClauseInput.trim()}
                    className="legal-button-primary"
                  >
                    {compareMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        {t.comparison.comparing}
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {t.comparison.compareButton}
                      </>
                    )}
                  </Button>
                  
                  {!selectedDocumentClause.trim() || !standardClauseInput.trim() && !compareMutation.isPending && (
                    <p className="text-sm text-muted-foreground my-auto">{t.comparison.enterBothClauses}</p>
                  )}
                </div>

                {/* Comparison Result */}
                {comparisonResult && (
                  <Card className="border-primary/30 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="text-base text-primary">{t.comparison.comparisonResult}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{comparisonResult}</div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

          
              <TabsContent value="qa" className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">{t.qa.title}</h3>
                
                {/* Q&A History */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto bg-muted/30 rounded-lg p-4">
                  {qaHistory.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No questions asked yet. Ask a question to get started!</p>
                  ) : (
                    qaHistory.map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                          <p className="text-sm font-semibold text-primary">Q: {item.question}</p>
                        </div>
                        <div className="bg-secondary/10 rounded-lg p-3 border border-secondary/20 ml-4">
                          <p className="text-sm text-foreground whitespace-pre-wrap">A: {item.answer}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Q&A Input Form */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={currentQuestion}
                          onChange={(e) => setCurrentQuestion(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !queryMutation.isPending && currentQuestion.trim()) {
                              handleQuery(currentQuestion);
                            }
                          }}
                          placeholder={t.qa.placeholder}
                          className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          disabled={queryMutation.isPending}
                        />
                        <Button 
                          onClick={() => {
                            if (currentQuestion.trim()) {
                              handleQuery(currentQuestion);
                            }
                          }}
                          disabled={queryMutation.isPending || !currentQuestion.trim()}
                          className="legal-button-primary"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          {t.qa.send}
                        </Button>
                      </div>
                      
                      {queryMutation.isPending && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                          <span>Analyzing document...</span>
                        </div>
                      )}

                      {qaAnswer && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                          <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">Latest Answer:</p>
                          <p className="text-sm text-green-800 dark:text-green-200 whitespace-pre-wrap">{qaAnswer}</p>
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => {
                              if (qaAnswer && currentQuestion) {
                                setQaHistory([...qaHistory, { question: currentQuestion, answer: qaAnswer }]);
                                setCurrentQuestion("");
                                setQaAnswer(null);
                              }
                            }}
                            className="mt-2"
                          >
                            {t.qa.askAnother}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="voice">
                <VoiceAssistantTab t={t} currentLanguage={currentLanguage} />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}