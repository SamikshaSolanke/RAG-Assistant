import { useState } from "react";
import { MessageCircle, X, Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatBotProps {
  currentLanguage: string;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function ChatBot({ currentLanguage }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const content = {
    en: {
      title: "Legal Assistant",
      subtitle: "Ask me about your documents",
      placeholder: "Type your question...",
      send: "Send",
      voice: "Voice",
      initialMessage: "Hi! I'm your Legal Assistant. I can help explain legal clauses, summarize documents, and answer questions about contracts and policies. How can I assist you today?"
    },
    hi: {
      title: "कानूनी सहायक",
      subtitle: "अपने दस्तावेजों के बारे में पूछें",
      placeholder: "अपना प्रश्न लिखें...",
      send: "भेजें",
      voice: "आवाज़",
      initialMessage: "नमस्ते! मैं आपका कानूनी सहायक हूं। मैं कानूनी खंडों की व्याख्या, दस्तावेजों का सारांश, और अनुबंध और नीतियों के बारे में प्रश्नों के उत्तर देने में मदद कर सकता हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?"
    }
  };

  const t = content[currentLanguage as keyof typeof content];

  // Initialize with welcome message
  useState(() => {
    if (messages.length === 0) {
      setMessages([{
        id: "welcome",
        text: t.initialMessage,
        sender: "bot",
        timestamp: new Date()
      }]);
    }
  });

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: currentLanguage === "hi" 
          ? "मैं आपके प्रश्न को समझ रहा हूं। कृपया एक क्षण प्रतीक्षा करें जबकि मैं आपके लिए सबसे अच्छा उत्तर तैयार करता हूं।"
          : "I understand your question. Please wait a moment while I prepare the best response for you.",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive);
    // Voice functionality will be implemented with backend
    setTimeout(() => setIsVoiceActive(false), 3000);
  };

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-xl z-50 animate-scale-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-lg">{t.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-64 px-4">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t border-border p-4 space-y-3">
          <div className="flex space-x-2">
            <Input
              placeholder={t.placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button size="sm" onClick={handleSendMessage}>
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleVoiceToggle}
            className={`w-full ${isVoiceActive ? "bg-destructive text-destructive-foreground" : ""}`}
          >
            <Mic className={`w-4 h-4 mr-2 ${isVoiceActive ? "animate-pulse" : ""}`} />
            {isVoiceActive ? "Recording..." : t.voice}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}