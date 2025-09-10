import { useState, useEffect, useCallback, useRef } from 'react';

export const useTextToSpeech = ({ onEnd }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const speakerVoices = useRef({});
  const speechQueue = useRef([]);
  const utteranceRef = useRef(null);

  const processQueue = useCallback(() => {
    if (speechQueue.current.length === 0 || window.speechSynthesis.speaking) {
      return;
    }
    const { text, speaker } = speechQueue.current.shift();
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    const selectedVoice = speakerVoices.current[speaker];
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
      processQueue(); // Process next item in queue
    };
    utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
        setIsSpeaking(false);
        processQueue();
    };

    window.speechSynthesis.speak(utterance);
  }, [rate, pitch, onEnd]);
  
  const speak = useCallback((text, speaker = 'default') => {
      speechQueue.current.push({ text, speaker });
      if (!window.speechSynthesis.speaking) {
          processQueue();
      }
  }, [processQueue]);

  const loadVoices = useCallback(() => {
    const voiceList = window.speechSynthesis.getVoices();
    if (voiceList.length > 0) {
      setVoices(voiceList);
    }
  }, []);

  useEffect(() => {
    loadVoices();
    // Some browsers load voices asynchronously.
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [loadVoices]);
  
  const setVoiceForSpeaker = useCallback((speaker, voice) => {
      speakerVoices.current[speaker] = voice;
  }, []);

  const getVoices = useCallback(() => voices, [voices]);

  return { isSpeaking, speak, getVoices, setVoiceForSpeaker, setRate, setPitch };
};