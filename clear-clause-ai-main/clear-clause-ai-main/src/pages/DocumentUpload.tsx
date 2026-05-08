import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { useUploadDocument } from '@/hooks/useApiMutations';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { 
  Upload, 
  FileText, 
  Image, 
  File, 
  CheckCircle, 
  X,
  AlertCircle
} from "lucide-react";

interface DocumentUploadProps {
  currentLanguage: string;
}

interface UploadedFile {
  file: File;
  id: string;
  status: "uploading" | "success" | "error";
  progress: number;
}

export default function DocumentUpload({ currentLanguage }: DocumentUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const content = {
    en: {
      title: "Upload Your Legal Document",
      subtitle: "Upload PDFs, images, or text files for AI analysis",
      dropzone: {
        title: "Drag & drop your files here",
        subtitle: "or click to browse files",
        supported: "Supported formats: PDF, PNG, JPG, JPEG, TXT, DOCX"
      },
      fileTypes: {
        title: "Supported File Types",
        types: [
          { type: "PDF", description: "Portable Document Format", icon: FileText },
          { type: "Images", description: "PNG, JPG, JPEG formats", icon: Image },
          { type: "Text", description: "TXT, DOCX documents", icon: File }
        ]
      },
      upload: {
        uploading: "Uploading...",
        processing: "Processing documents...",
        success: "Upload successful!",
        error: "Upload failed",
        analyze: "Analyze Documents",
        remove: "Remove file"
      },
      limits: {
        maxSize: "Maximum file size: 10MB",
        maxFiles: "Maximum 5 files at once"
      }
    },
    hi: {
      title: "अपना कानूनी दस्तावेज़ अपलोड करें",
      subtitle: "AI विश्लेषण के लिए PDF, छवियां या टेक्स्ट फ़ाइलें अपलोड करें",
      dropzone: {
        title: "अपनी फ़ाइलों को यहाँ खींचें और छोड़ें",
        subtitle: "या फ़ाइलें ब्राउज़ करने के लिए क्लिक करें",
        supported: "समर्थित प्रारूप: PDF, PNG, JPG, JPEG, TXT, DOCX"
      },
      fileTypes: {
        title: "समर्थित फ़ाइल प्रकार",
        types: [
          { type: "PDF", description: "पोर्टेबल डॉक्यूमेंट फॉर्मेट", icon: FileText },
          { type: "छवियां", description: "PNG, JPG, JPEG प्रारूप", icon: Image },
          { type: "टेक्स्ट", description: "TXT, DOCX दस्तावेज़", icon: File }
        ]
      },
      upload: {
        uploading: "अपलोड हो रहा है...",
        processing: "दस्तावेज़ों का प्रसंस्करण...",
        success: "अपलोड सफल!",
        error: "अपलोड असफल",
        analyze: "दस्तावेज़ों का विश्लेषण करें",
        remove: "फ़ाइल हटाएं"
      },
      limits: {
        maxSize: "अधिकतम फ़ाइल आकार: 10MB",
        maxFiles: "एक साथ अधिकतम 5 फ़ाइलें"
      }
    }
  };

  const t = content[currentLanguage as keyof typeof content];

  const uploadMutation = useUploadDocument();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Validate file count
    if (uploadedFiles.length + acceptedFiles.length > 5) {
      toast({
        title: "Error",
        description: "Maximum 5 files allowed",
        variant: "destructive",
      });
      return;
    }

    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      file,
      id: `${file.name}-${Date.now()}`,
      status: "uploading" as const,
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Upload files sequentially to create sessions per file
    for (const uploadFile of newFiles) {
      const controller = new AbortController();
      try {
        // update progress via callback
        await uploadMutation.mutateAsync(
          { file: uploadFile.file, onUploadProgress: (p) => {
            setUploadedFiles(prev => prev.map(f => f.id === uploadFile.id ? { ...f, progress: p } : f));
          }, signal: controller.signal }
        );

        setUploadedFiles(prev => prev.map(f => f.id === uploadFile.id ? { ...f, status: 'success', progress: 100 } : f));
      } catch (err) {
        setUploadedFiles(prev => prev.map(f => f.id === uploadFile.id ? { ...f, status: 'error' } : f));
      }
    }

    // After at least one successful upload, navigate to analysis
    if (uploadedFiles.concat(newFiles).some(f => f.status === 'success')) {
      setIsProcessing(true);
      // give a slight delay for UX
      setTimeout(() => navigate('/analysis'), 500);
    }
  }, [uploadedFiles.length, navigate, uploadMutation, t.upload.success]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleAnalyze = () => {
    if (uploadedFiles.some(f => f.status === "success")) {
      setIsProcessing(true);
      setTimeout(() => {
        navigate("/analysis", { state: { files: uploadedFiles } });
      }, 2000);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Upload className="w-5 h-5 text-muted-foreground animate-pulse" />;
    }
  };

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">{t.title}</h1>
          <p className="text-lg text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* Upload Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Dropzone */}
            <Card className="legal-card animate-slide-up">
              <CardContent className="p-8">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer ${
                    isDragActive 
                      ? "border-primary bg-primary/5" 
                      : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t.dropzone.title}</h3>
                  <p className="text-muted-foreground mb-4">{t.dropzone.subtitle}</p>
                  <p className="text-sm text-muted-foreground">{t.dropzone.supported}</p>
                </div>
              </CardContent>
            </Card>

            {/* File Limits */}
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t.limits.maxSize}</span>
              <span>{t.limits.maxFiles}</span>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <Card className="legal-card animate-fade-in">
                <CardHeader>
                  <CardTitle>Uploaded Files ({uploadedFiles.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {uploadedFiles.map((uploadFile) => (
                    <div key={uploadFile.id} className="flex items-center space-x-4 p-3 border border-border rounded-lg">
                      {getStatusIcon(uploadFile.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{uploadFile.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        {uploadFile.status === "uploading" && (
                          <Progress value={uploadFile.progress} className="mt-2" />
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadFile.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {uploadedFiles.some(f => f.status === "success") && (
                    <Button 
                      onClick={handleAnalyze}
                      className="w-full legal-button-primary"
                      disabled={isProcessing}
                    >
                      {isProcessing ? t.upload.processing : t.upload.analyze}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Supported File Types */}
          <div className="space-y-6">
            <Card className="legal-card animate-scale-in">
              <CardHeader>
                <CardTitle className="text-lg">{t.fileTypes.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {t.fileTypes.types.map((type, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <type.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{type.type}</p>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </div>
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