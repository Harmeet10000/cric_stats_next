import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function CommentarySection({ commentary, setCommentary }) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const { toast } = useToast();

  // Throttle function to delay adding text
  const throttledAddComment = useCallback(
    (text: string) => {
      setTimeout(() => {
        setCommentary((prev) => [text, ...prev]);
      }, 400);
    },
    [setCommentary]
  );

  const startVoiceRecognition = () => {
    // Check browser support
    if (!("webkitSpeechRecognition" in window)) {
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser does not support speech recognition.",
        variant: "destructive",
      });
      return;
    }

    // Create speech recognition instance
    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();

    // Configuration
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = "en-US";

    // Event handlers
    recognitionInstance.onstart = () => {
      setIsListening(true);
      toast({
        title: "Listening",
        description: "Speak your commentary",
      });
    };

    recognitionInstance.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();

      if (transcript) {
        throttledAddComment(transcript);

        toast({
          title: "Commentary Added",
          description: transcript,
        });
      }
    };

    recognitionInstance.onerror = (event: any) => {
      toast({
        title: "Voice Recognition Error",
        description: event.error,
        variant: "destructive",
      });
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    // Start recognition
    recognitionInstance.start();
    setRecognition(recognitionInstance);
  };

  const stopVoiceRecognition = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <Card className="md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ball-by-Ball Commentary</CardTitle>
        <div>
          {isListening ? (
            <Button
              variant="destructive"
              size="icon"
              onClick={stopVoiceRecognition}
            >
              <MicOff className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onClick={startVoiceRecognition}
            >
              <Mic className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {commentary.map((comment, index) => (
            <div
              key={index}
              className="bg-gray-100 p-2 rounded animate-fade-in"
            >
              {comment}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
