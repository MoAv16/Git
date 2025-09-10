
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Conversation } from "../entities/Conversation.js";
import { User } from "../entities/User.js";
import { InvokeLLM } from "../integrations/Core.js";
import AIChat from "../components/conference/AIChat";
import ControlHub from "../components/conference/ControlHub";
import ConversationStarter from "../components/conference/ConversationStarter";
import TopicSuggestions from "../components/conference/TopicSuggestions";
import ParticleBackground from "../components/conference/ParticleBackground";
import EmotionIndicator from "../components/conference/EmotionIndicator";
import ModeSelector from "../components/conference/ModeSelector";
import AudioControls from "../components/conference/AudioControls";
import FullConversationView from "../components/conference/FullConversationView";
import { useTextToSpeech } from "../components/hooks/useTextToSpeech"; // Updated path
import { AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConferenceRoom() {
  const [currentConversation, setCurrentConversation] = useState(null);
  const [leftAIModel, setLeftAIModel] = useState("gpt-4");
  const [rightAIModel, setRightAIModel] = useState("gpt-4");
  const [isConversationActive, setIsConversationActive] = useState(false);
  const [conversationTopic, setConversationTopic] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const conversationIntervalRef = useRef(null);

  const allMessagesRef = useRef([]);
  const activeConversationRef = useRef(null);
  const conversationActiveRef = useRef(false);

  const [conversationError, setConversationError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const [leftEmotion, setLeftEmotion] = useState('neutral');
  const [rightEmotion, setRightEmotion] = useState('neutral');
  const [leftEmotionStats, setLeftEmotionStats] = useState({});
  const [rightEmotionStats, setRightEmotionStats] = useState({});
  const [visualMode, setVisualMode] = useState('conference');
  const [timeOfDay, setTimeOfDay] = useState('night');
  const [isModeSelectorOpen, setIsModeSelectorOpen] = useState(false);
  const [isAudioMode, setIsAudioMode] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const [speakingSpeaker, setSpeakingSpeaker] = useState(null);
  const { speak, isSpeaking, getVoices, setVoiceForSpeaker, setRate, setPitch } = useTextToSpeech({
    onEnd: () => setSpeakingSpeaker(null)
  });

  const leftMessages = useMemo(() => allMessages.filter(m => m.speaker === 'left_ai' || m.speaker === 'moderator'), [allMessages]);
  const rightMessages = useMemo(() => allMessages.filter(m => m.speaker === 'right_ai' || m.speaker === 'moderator'), [allMessages]);

  useEffect(() => {
    loadUser();
    // Set voices for speakers
    const voices = getVoices();
    if (voices.length > 0) {
        // Attempt to find specific voices, with fallbacks
        const femaleVoice = voices.find(v => v.name.includes('Google US English') && v.gender === 'female') || voices.find(v => v.lang.startsWith('en') && v.gender === 'female');
        const maleVoice = voices.find(v => v.name.includes('Google US English') && v.gender === 'male') || voices.find(v => v.lang.startsWith('en') && v.gender === 'male');
        
        if (femaleVoice) setVoiceForSpeaker('left_ai', femaleVoice);
        if (maleVoice) setVoiceForSpeaker('right_ai', maleVoice);
    }
  }, [getVoices, setVoiceForSpeaker]);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.error("User not logged in");
    }
  };

  const modeConfigs = {
    conference: { interval: 4000, maxMessages: 20, promptStyle: "professional and engaging", systemPrompt: "You are participating in a professional AI conference discussion." },
    podcast: { interval: 8000, maxMessages: 15, promptStyle: "relaxed and conversational", systemPrompt: "You are having a casual, laid-back podcast conversation. Keep responses thoughtful but relaxed." },
    focus: { interval: 3000, maxMessages: 25, promptStyle: "focused and concise", systemPrompt: "You are in a focused discussion session. Be direct, concise, and highly analytical." },
    storytelling: { interval: 5000, maxMessages: 18, promptStyle: "narrative and immersive", systemPrompt: "You are crafting a collaborative story. Be descriptive and narrative in your responses." }
  };

  const analyzeEmotion = async (message, speaker) => {
    try {
      const response = await InvokeLLM({
        prompt: `Analyze the emotional tone of this message briefly: "${message}"\n\nProvide a JSON response with:\n- primary_emotion: one of "positive", "neutral", "negative", "critical"\n- confidence: percentage (0-100)\n- stats: object with percentages for positive, neutral, negative, critical, engagement, clarity`,
        response_json_schema: { type: "object", properties: { primary_emotion: { type: "string", enum: ["positive", "neutral", "negative", "critical"] }, confidence: { type: "number", minimum: 0, maximum: 100 }, stats: { type: "object", properties: { positive: { type: "number" }, neutral: { type: "number" }, negative: { type: "number" }, critical: { type: "number" }, engagement: { type: "number" }, clarity: { type: "number" } } } } }
      });
      if (speaker === 'left_ai') { setLeftEmotion(response.primary_emotion); setLeftEmotionStats(response.stats); } 
      else if (speaker === 'right_ai') { setRightEmotion(response.primary_emotion); setRightEmotionStats(response.stats); }
    } catch (error) {
      console.error("Emotion analysis failed:", error);
    }
  };

  const startConversation = async (topic) => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setConversationError(null);
    setConversationTopic(topic);
    setIsConversationActive(true);
    conversationActiveRef.current = true;
    setAllMessages([]);
    allMessagesRef.current = [];
    try {
      const conversation = await Conversation.create({ title: topic, left_ai_model: leftAIModel, right_ai_model: rightAIModel, status: "active", mode: isAudioMode ? "live_audio" : "text_chat", messages: [] });
      setCurrentConversation(conversation);
      activeConversationRef.current = conversation;
      await continueConversation(true);
      const config = modeConfigs[visualMode];
      conversationIntervalRef.current = setInterval(() => { continueConversation(); }, config.interval);
    } catch (error) {
      console.error("Error starting conversation:", error);
      setConversationError("Failed to start conversation. Please try again.");
    }
    setIsLoading(false);
  };

  const continueConversation = async (isFirstMessage = false) => {
    if (!conversationActiveRef.current) return;
    const currentMessages = allMessagesRef.current;
    const config = modeConfigs[visualMode];
    if (currentMessages.length >= config.maxMessages) { pauseConversation(); return; }

    try {
      setConversationError(null);
      const currentMessageCount = currentMessages.length;
      const speaker = currentMessageCount % 2 === 0 ? 'left_ai' : 'right_ai';
      const model = speaker === 'left_ai' ? leftAIModel : rightAIModel;
      
      let prompt;
      if (isFirstMessage) {
        const modeContext = getContextForMode(visualMode, timeOfDay);
        prompt = `${config.systemPrompt} You are discussing "${conversationTopic}". ${modeContext}\n\nStart the conversation with an engaging opening statement. Be ${config.promptStyle}. Keep your response to 2-3 sentences maximum.`;
      } else {
        const recentMessages = currentMessages.slice(-3).map(msg => `${msg.speaker === 'left_ai' ? 'Alice' : msg.speaker === 'right_ai' ? 'Bob' : 'Moderator'}: ${msg.message}`).join('\n\n');
        const modeContext = getContextForMode(visualMode, timeOfDay);
        prompt = `${config.systemPrompt} Continue this discussion about "${conversationTopic}". ${modeContext}\n\nRecent exchange:\n${recentMessages}\n\nYou are ${speaker === 'left_ai' ? 'Alice' : 'Bob'}. Respond thoughtfully, being ${config.promptStyle}. Keep to 2-3 sentences maximum.`;
      }

      const response = await InvokeLLM({ prompt: prompt });
      const newMessage = { speaker, message: response, timestamp: new Date().toISOString(), model_used: model };
      
      allMessagesRef.current = [...currentMessages, newMessage];
      setAllMessages(allMessagesRef.current);

      if (isAudioMode) {
        setSpeakingSpeaker(speaker);
        speak(response, speaker);
      }
      
      analyzeEmotion(response, speaker).catch(() => {});
      if (activeConversationRef.current) { await Conversation.update(activeConversationRef.current.id, { messages: allMessagesRef.current }); }
    } catch (error) {
      console.error("Error continuing conversation:", error);
      setConversationError("Connection issue. Retrying...");
      setTimeout(() => { if (conversationActiveRef.current) { continueConversation(isFirstMessage); } }, 2000);
    }
  };

  const getContextForMode = (mode, timeOfDay) => {
    switch (mode) {
      case 'podcast': return "This is a relaxed podcast setting. Be conversational and think out loud.";
      case 'focus': return "Focus on clarity and precision. Be analytical and direct.";
      case 'storytelling': return `It's ${timeOfDay} time. Use narrative elements and paint vivid pictures with your words.`;
      default: return "This is a professional conference discussion.";
    }
  };

  const pauseConversation = () => {
    setIsConversationActive(false);
    conversationActiveRef.current = false;
    if (conversationIntervalRef.current) { clearInterval(conversationIntervalRef.current); conversationIntervalRef.current = null; }
    if (activeConversationRef.current) { Conversation.update(activeConversationRef.current.id, { status: "paused" }); }
  };

  const resumeConversation = () => {
    if (!activeConversationRef.current) return;
    const config = modeConfigs[visualMode];
    if (allMessagesRef.current.length >= config.maxMessages) return;
    setIsConversationActive(true);
    conversationActiveRef.current = true;
    setConversationError(null);
    conversationIntervalRef.current = setInterval(() => { continueConversation(); }, config.interval);
    Conversation.update(activeConversationRef.current.id, { status: "active" });
  };

  const stopConversation = () => {
    pauseConversation();
    setConversationTopic("");
    setAllMessages([]);
    allMessagesRef.current = [];
    setLeftEmotion('neutral');
    setRightEmotion('neutral');
    setConversationError(null);
    if (activeConversationRef.current) {
      Conversation.update(activeConversationRef.current.id, { status: "completed" });
      setCurrentConversation(null);
      activeConversationRef.current = null;
    }
  };

  const retryConversation = () => {
    setIsRetrying(true);
    setConversationError(null);
    setTimeout(() => { continueConversation(); setIsRetrying(false); }, 1000);
  };

  const injectMessage = async (message) => {
    if (!message.trim() || !activeConversationRef.current) return;
    const moderatorMessage = { speaker: 'moderator', message: message, timestamp: new Date().toISOString(), model_used: 'human' };
    allMessagesRef.current = [...allMessagesRef.current, moderatorMessage];
    setAllMessages(allMessagesRef.current);
    await Conversation.update(activeConversationRef.current.id, { messages: allMessagesRef.current });
  };

  const changeTopic = (newTopic) => {
    stopConversation();
    setTimeout(() => startConversation(newTopic), 1000);
  };

  const handleModeChange = (newMode) => {
    setVisualMode(newMode);
    if (conversationActiveRef.current && conversationIntervalRef.current) {
      clearInterval(conversationIntervalRef.current);
      const config = modeConfigs[newMode];
      conversationIntervalRef.current = setInterval(() => { continueConversation(); }, config.interval);
    }
  };
  
  const handleAudioSettingsChange = (settings) => {
      if(settings.rate) setRate(settings.rate);
      if(settings.pitch) setPitch(settings.pitch);
  };

  useEffect(() => { return () => { if (conversationIntervalRef.current) { clearInterval(conversationIntervalRef.current); } }; }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-blue-900 relative overflow-hidden">
      <ParticleBackground leftEmotion={leftEmotion} rightEmotion={rightEmotion} mode={visualMode} timeOfDay={timeOfDay} reduceMotion={reduceMotion} />
      
      <div className="relative z-10 min-h-screen p-4 md:p-6">
        <div className="max-w-8xl mx-auto h-full">
          {!conversationTopic ? (
            <div className="text-center py-20 flex items-center justify-center h-full">
              <ConversationStarter onStart={startConversation} />
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-4 h-[calc(100vh-8rem)]">
              {conversationError && (
                <div className="lg:col-span-12 mb-4">
                  <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                      <span>{conversationError}</span>
                      <Button onClick={retryConversation} size="sm" variant="outline" disabled={isRetrying} className="ml-4 border-red-500/50 text-red-400 hover:bg-red-500/20">
                        {isRetrying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><RefreshCw className="w-4 h-4 mr-2" />Retry</>}
                      </Button>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Left AI Panel */}
              <div className="lg:col-span-3 relative h-full">
                <EmotionIndicator emotion={leftEmotion} confidence={leftEmotionStats.engagement || 50} stats={leftEmotionStats} position="left" />
                <AIChat title="Alice (AI-1)" model={leftAIModel} onModelChange={setLeftAIModel} messages={leftMessages.filter(m => m.speaker === 'left_ai')} isActive={isConversationActive} gradientFrom="from-cyan-500" gradientTo="to-blue-600" accentColor="cyan" isSpeaking={speakingSpeaker === 'left_ai'} />
              </div>

              {/* Central Control Hub & Full Conversation */}
              <div className="lg:col-span-6 flex flex-col gap-4 h-full">
                <ControlHub topic={conversationTopic} isActive={isConversationActive} onPause={pauseConversation} onResume={resumeConversation} onStop={stopConversation} onInjectMessage={injectMessage} messageCount={allMessagesRef.current.length} maxMessages={modeConfigs[visualMode].maxMessages} currentMode={visualMode} />
                <div className="flex-grow min-h-0">
                  <FullConversationView messages={allMessages} />
                </div>
                 <TopicSuggestions onTopicSelect={changeTopic} />
              </div>

              {/* Right AI Panel */}
              <div className="lg:col-span-3 relative h-full">
                <EmotionIndicator emotion={rightEmotion} confidence={rightEmotionStats.engagement || 50} stats={rightEmotionStats} position="right" />
                <AIChat title="Bob (AI-2)" model={rightAIModel} onModelChange={setRightAIModel} messages={rightMessages.filter(m => m.speaker === 'right_ai')} isActive={isConversationActive} gradientFrom="from-purple-500" gradientTo="to-pink-600" accentColor="purple" isSpeaking={speakingSpeaker === 'right_ai'} />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="fixed bottom-4 right-4 z-20">
        <AudioControls isAudioMode={isAudioMode} onToggleAudio={setIsAudioMode} onSettingsChange={handleAudioSettingsChange} onTranscript={injectMessage} />
      </div>

      <AnimatePresence>
        <ModeSelector currentMode={visualMode} onModeChange={handleModeChange} timeOfDay={timeOfDay} onTimeOfDayChange={setTimeOfDay} isCollapsed={!isModeSelectorOpen} onToggleCollapse={() => setIsModeSelectorOpen(!isModeSelectorOpen)} />
      </AnimatePresence>
    </div>
  );
}
