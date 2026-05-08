import React, { useEffect, useRef, useState } from "react";
import { useSession } from '@/contexts/SessionContext';
import { useQueryDocument } from '@/hooks/useApiMutations';

// if you rely on shadcn/ui components in your project, keep those imports
import { Button } from "@/components/ui/button"; // adjust path as needed
import { Card, CardContent } from "@/components/ui/card"; // adjust path as needed
import { Mic, Volume2, MessageSquare } from "lucide-react"; // or your icon set

type Props = {
  t: any; // your translation object
  currentLanguage: string;
};

export default function VoiceAssistantTab({ t, currentLanguage }: Props) {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [assistantText, setAssistantText] = useState<string | null>(null);
  const [assistantAudioDataUrl, setAssistantAudioDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Only declare sessionId once at the top
  const { sessionId } = useSession();

  // Text-based Q&A using document context
  const queryMutation = useQueryDocument();
  const [textQuestion, setTextQuestion] = useState('');

  useEffect(() => {
    return () => {
      // Clean up object URLs if any
      if (assistantAudioDataUrl) URL.revokeObjectURL(assistantAudioDataUrl);
    };
  }, [assistantAudioDataUrl]);

  const startRecording = async () => {
    try {
      setTranscript(null);
      setAssistantText(null);
      setAssistantAudioDataUrl(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options: MediaRecorderOptions = { mimeType: "audio/webm;codecs=opus" };
      const mr = new MediaRecorder(stream, options);
      audioChunksRef.current = [];

      mr.addEventListener("dataavailable", (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      });

      mr.addEventListener("stop", async () => {
        setRecording(false);
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await uploadAudio(blob);
        // stop all tracks
        stream.getTracks().forEach((t) => t.stop());
        mediaRecorderRef.current = null;
      });

      mediaRecorderRef.current = mr;
      mr.start();
      setRecording(true);
    } catch (err) {
      console.error("microphone permission denied or error", err);
      alert("Microphone access is needed for voice assistant.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const toggleRecording = async () => {
    if (isVoiceActive) {
      // turning off voice assistant (stop if currently recording)
      setIsVoiceActive(false);
      if (recording) stopRecording();
    } else {
      setIsVoiceActive(true);
      await startRecording();
    }
  };

  const uploadAudio = async (blob: Blob) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", blob, "recording.webm");
      fd.append("language", currentLanguage === "hi" ? "hi" : "en");
      // include session id for document-aware responses (if available)
      if (sessionId) fd.append('session_id', sessionId);

      const res = await fetch("/api/voice", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`server error: ${text}`);
      }

      const json = await res.json();
      // expected response: { transcript, assistantText, audioBase64 }
      setTranscript(json.transcript ?? null);
      setAssistantText(json.assistantText ?? null);

      if (json.audioBase64) {
        // make data url
        const mime = json.audioContentType || "audio/mpeg";
        const dataUrl = `data:${mime};base64,${json.audioBase64}`;
        setAssistantAudioDataUrl(dataUrl);

        // autoplay the assistant answer once received
        if (audioRef.current) {
          audioRef.current.src = dataUrl;
          await audioRef.current.play().catch(() => {});
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to process voice. Check console for details.");
    } finally {
      setLoading(false);
      setIsVoiceActive(false);
    }
  };

  const handleTextQuery = () => {
    if (!sessionId) {
      alert('No active document session. Please upload a document first.');
      return;
    }
    if (!textQuestion.trim()) return;
    queryMutation.mutate({ sessionId, query: textQuestion }, {
      onSuccess: (data) => {
        setAssistantText(data.answer);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">{t.voice.title}</h3>
          <p className="text-muted-foreground">{t.voice.description}</p>
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            variant={isVoiceActive ? "destructive" : "default"}
            size="lg"
            onClick={toggleRecording}
            className="flex items-center space-x-2"
            aria-pressed={isVoiceActive}
          >
            <Mic className={`w-5 h-5 ${isVoiceActive ? "animate-pulse" : ""}`} />
            <span>{isVoiceActive ? t.voice.stopRecording : t.voice.startRecording}</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={async () => {
              if (assistantAudioDataUrl && audioRef.current) {
                audioRef.current.src = assistantAudioDataUrl;
                await audioRef.current.play().catch(() => {});
              } else {
                alert("No assistant audio available yet — ask a question using the mic first.");
              }
            }}
          >
            <Volume2 className="w-5 h-5 mr-2" />
            {t.voice.playback}
          </Button>
        </div>

        <Card className="text-left bg-muted/50">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2 mb-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Voice Assistant</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {currentLanguage === "hi"
                ? "आप अपने दस्तावेज़ के बारे में प्रश्न पूछ सकते हैं। मैं खंडों की व्याख्या करने और जोखिमों को समझाने में मदद करूंगा।"
                : "You can ask questions about your document. I'll help explain clauses and clarify any risks or concerns you may have."
              }
            </p>

            <div className="mt-4">
              <div className="text-xs text-muted-foreground">{loading ? "Processing..." : ""}</div>
              {transcript && (
                <div className="mt-2 p-2 bg-white/5 rounded">
                  <div className="text-xs text-muted-foreground">{currentLanguage === "hi" ? "पुनर्लेखन:" : "Transcript:"}</div>
                  <div className="text-sm">{transcript}</div>
                </div>
              )}

              {assistantText && (
                <div className="mt-2 p-2 bg-white/5 rounded">
                  <div className="text-xs text-muted-foreground">{currentLanguage === "hi" ? "सहायक:" : "Assistant:"}</div>
                  <div className="text-sm">{assistantText}</div>
                </div>
              )}

            </div>

            <audio ref={audioRef} hidden />

          </CardContent>
        </Card>
      </div>
    </div>
  );
}