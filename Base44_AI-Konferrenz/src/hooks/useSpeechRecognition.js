import { useState, useEffect, useRef, useCallback } from 'react';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  
  const hasRecognitionSupport = 'webkitSpeechRecognition' in window;

  const startListening = useCallback(() => {
    if (isListening || !hasRecognitionSupport) return;
    
    recognitionRef.current.start();
    setIsListening(true);
  }, [isListening, hasRecognitionSupport]);

  const stopListening = useCallback(() => {
    if (!isListening || !hasRecognitionSupport) return;
    
    recognitionRef.current.stop();
    setIsListening(false);
  }, [isListening, hasRecognitionSupport]);

  useEffect(() => {
    if (!hasRecognitionSupport) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
          // A command to stop listening
          if(finalTranscript.toLowerCase().includes('stop listening')) {
              stopListening();
          } else {
             setTranscript(finalTranscript);
          }
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    return () => {
      recognition.stop();
    };
  }, [hasRecognitionSupport, stopListening]);
  
  return { isListening, transcript, startListening, stopListening, hasRecognitionSupport };
};