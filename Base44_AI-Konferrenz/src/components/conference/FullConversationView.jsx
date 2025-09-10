import React, { useRef, useEffect } from "react";
import { Card, CardHeader, CardContent } from "../../components/ui/card.jsx";
import { Badge } from "../../components/ui/badge.jsx";
import { Bot, User, Crown, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function FullConversationView({ messages }) {
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getMessageIcon = (speaker) => {
    switch (speaker) {
      case 'left_ai': return <Bot className="w-4 h-4 text-cyan-300" />;
      case 'right_ai': return <Bot className="w-4 h-4 text-purple-300" />;
      case 'moderator': return <Crown className="w-4 h-4 text-yellow-300" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getSpeakerName = (speaker) => {
    switch (speaker) {
      case 'left_ai': return 'Alice';
      case 'right_ai': return 'Bob';
      case 'moderator': return 'Moderator';
      default: return 'User';
    }
  };

  const getAlignment = (speaker) => {
    switch (speaker) {
      case 'left_ai': return 'justify-start';
      case 'right_ai': return 'justify-end';
      case 'moderator': return 'justify-center';
      default: return 'justify-center';
    }
  };
  
  const getBubbleColor = (speaker) => {
      switch (speaker) {
          case 'left_ai': return 'bg-cyan-500/10 border-cyan-500/20';
          case 'right_ai': return 'bg-purple-500/10 border-purple-500/20';
          case 'moderator': return 'bg-yellow-500/10 border-yellow-500/20 text-center';
          default: return 'bg-gray-500/10 border-gray-500/20';
      }
  }

  return (
    <Card className="h-full flex flex-col backdrop-blur-xl bg-black/20 border-white/10 overflow-hidden shadow-2xl">
      <CardHeader className="border-b border-white/10 py-3 bg-black/10">
        <div className="flex items-center space-x-3">
            <MessageSquare className="w-5 h-5 text-white" />
            <h3 className="text-md font-bold text-white">Full Conversation Transcript</h3>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 min-h-0">
        <div className="h-full overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`flex ${getAlignment(message.speaker)}`}
              >
                <div className={`max-w-[85%] ${message.speaker === 'moderator' ? 'w-full' : ''}`}>
                  <div className={`p-3 rounded-xl backdrop-blur-sm border shadow-lg ${getBubbleColor(message.speaker)}`}>
                    <div className="flex items-start space-x-3">
                      {message.speaker !== 'right_ai' && (
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                            {getMessageIcon(message.speaker)}
                        </div>
                      )}
                      <div className={`flex-1 ${message.speaker === 'right_ai' ? 'text-right' : ''}`}>
                        <div className={`flex items-center space-x-2 mb-1 ${message.speaker === 'right_ai' ? 'justify-end' : ''}`}>
                          {message.speaker === 'right_ai' && (
                             <span className="text-xs text-gray-400">
                                {format(new Date(message.timestamp), "HH:mm")}
                              </span>
                          )}
                          <span className="text-sm font-medium text-white/90">
                            {getSpeakerName(message.speaker)}
                          </span>
                           {message.speaker !== 'right_ai' && (
                             <span className="text-xs text-gray-400">
                                {format(new Date(message.timestamp), "HH:mm")}
                              </span>
                          )}
                        </div>
                        <p className="text-white/90 leading-relaxed text-sm">
                          {message.message}
                        </p>
                      </div>
                       {message.speaker === 'right_ai' && (
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                            {getMessageIcon(message.speaker)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-center">
              <p className="text-gray-400">Conversation transcript will appear here.</p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
    </Card>
  );
}