import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "../../components/ui/card.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Progress } from "../../components/ui/progress.jsx";
import { 
  Play, 
  Pause, 
  Square, 
  MessageCircle, 
  Send, 
  Zap,
  BarChart3,
  Volume2
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "../../components/ui/badge.jsx";

export default function ControlHub({
  topic,
  isActive,
  onPause,
  onResume,
  onStop,
  onInjectMessage,
  messageCount,
  maxMessages,
  currentMode = 'conference'
}) {
  const [injectionMessage, setInjectionMessage] = useState("");

  const handleInjectMessage = () => {
    if (injectionMessage.trim()) {
      onInjectMessage(injectionMessage);
      setInjectionMessage("");
    }
  };

  const progressPercentage = (messageCount / maxMessages) * 100;

  const modeLabels = {
    conference: 'Conference',
    podcast: 'Podcast',
    focus: 'Focus',
    storytelling: 'Storytelling'
  };

  return (
    <div className="space-y-6">
      {/* Main Control Panel */}
      <Card className="backdrop-blur-xl bg-black/20 border-white/10 overflow-hidden shadow-2xl">
        <CardHeader className="text-center border-b border-white/10 pb-6 bg-black/10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl mx-auto">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Conference Control</h2>
              <p className="text-gray-300 text-sm">Moderate the AI discussion</p>
              <Badge variant="outline" className="mt-2 text-xs border-cyan-500/30 text-cyan-300 bg-cyan-500/10">
                {modeLabels[currentMode]} Mode
              </Badge>
            </div>
          </motion.div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Topic Display */}
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold text-white">Current Topic</h3>
            <div className="backdrop-blur-sm bg-black/20 rounded-xl p-4 border border-white/10">
              <p className="text-cyan-200 font-medium">{topic}</p>
            </div>
          </div>

          {/* Conversation Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Conversation Progress</span>
              <Badge variant="outline" className="text-xs border-white/20 text-white bg-black/20">
                {messageCount} / {maxMessages} messages
              </Badge>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2 bg-white/10"
            />
            {progressPercentage > 90 && (
              <p className="text-xs text-orange-300">Conversation will auto-complete soon</p>
            )}
          </div>

          {/* Control Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {!isActive ? (
              <Button
                onClick={onResume}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold col-span-2 h-12 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Play className="w-4 h-4 mr-2" />
                Resume Discussion
              </Button>
            ) : (
              <Button
                onClick={onPause}
                className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white font-semibold col-span-2 h-12 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause Discussion
              </Button>
            )}
            
            <Button
              onClick={onStop}
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-500 h-12 backdrop-blur-sm bg-black/10 hover:scale-105 transition-all duration-300"
            >
              <Square className="w-4 h-4 mr-1" />
              Stop
            </Button>
          </div>

          {/* Message Injection */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              Inject Message
            </h4>
            <div className="flex space-x-2">
              <Input
                placeholder="Type your message to inject into conversation..."
                value={injectionMessage}
                onChange={(e) => setInjectionMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleInjectMessage()}
                className="bg-black/20 border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent backdrop-blur-sm"
              />
              <Button
                onClick={handleInjectMessage}
                disabled={!injectionMessage.trim()}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-400">
              💡 Your message will appear to both AI participants instantly
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="backdrop-blur-xl bg-black/20 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <span className="text-sm text-white font-medium">Analytics</span>
              </div>
              <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-300 bg-cyan-500/10">
                Live
              </Badge>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Response Time</span>
                <span className="text-white">
                  {currentMode === 'focus' ? '~3s' : currentMode === 'podcast' ? '~8s' : '~4s'}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Engagement</span>
                <span className="text-green-400">
                  {progressPercentage > 50 ? 'High' : 'Growing'}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Quality</span>
                <span className="text-cyan-400">Excellent</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-black/20 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-white font-medium">Experience</span>
              </div>
              <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300 bg-purple-500/10">
                Enhanced
              </Badge>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Visual Mode</span>
                <span className="text-white capitalize">{currentMode}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Emotions</span>
                <span className="text-green-400">Tracking</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Messages</span>
                <span className="text-white">{messageCount}/{maxMessages}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}