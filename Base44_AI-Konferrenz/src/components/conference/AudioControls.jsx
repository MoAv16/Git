
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../../components/ui/button.jsx";
import { Slider } from "../../components/ui/slider.jsx";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition.js";
import { 
  Mic, MicOff, Volume2, Settings, Play, Pause, ChevronsUp, ChevronsDown
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from 'framer-motion';

const AudioControls = ({ isAudioMode, onToggleAudio, onSettingsChange, onTranscript }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [volume, setVolume] = useState(75);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  const { isListening, transcript, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      onTranscript?.(transcript);
    }
  }, [transcript, onTranscript]);

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleRateChange = (newRate) => {
    setRate(newRate[0]);
    onSettingsChange?.({ rate: newRate[0] });
  };
  
  const handlePitchChange = (newPitch) => {
    setPitch(newPitch[0]);
    onSettingsChange?.({ pitch: newPitch[0] });
  };

  if (!isAudioMode) {
    return (
      <Button
        onClick={() => onToggleAudio(true)}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
      >
        <Play className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <div className="w-80">
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl mb-4">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Audio Settings
                  </h3>
                   <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400" onClick={() => setIsPanelOpen(false)}>
                      <ChevronsDown className="w-4 h-4"/>
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-gray-300">Speech Rate</label>
                  <Slider value={[rate]} onValueChange={handleRateChange} max={2} step={0.1} />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-gray-300">Speech Pitch</label>
                  <Slider value={[pitch]} onValueChange={handlePitchChange} max={2} step={0.1} />
                </div>
                
                {isListening && (
                    <div className="text-xs text-center text-cyan-300 animate-pulse">
                        Listening... say "stop listening" to finish.
                    </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-16 bg-black/30 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-between px-4">
        <Button onClick={() => onToggleAudio(false)} variant="ghost" size="icon" className="text-red-400 hover:bg-red-500/20">
          <Pause className="w-5 h-5" />
        </Button>
        
        <Button 
          onClick={handleMicToggle} 
          size="icon" 
          className={`w-10 h-10 rounded-full text-white transition-colors duration-300 ${isListening ? 'bg-red-500' : 'bg-blue-500'}`}
          disabled={!hasRecognitionSupport}
        >
          {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </Button>
        
        <Button onClick={() => setIsPanelOpen(!isPanelOpen)} variant="ghost" size="icon" className="text-gray-300 hover:bg-white/10">
           {isPanelOpen ? <ChevronsDown className="w-5 h-5"/> : <ChevronsUp className="w-5 h-5"/>}
        </Button>
      </div>
    </div>
  );
};

export default AudioControls;
