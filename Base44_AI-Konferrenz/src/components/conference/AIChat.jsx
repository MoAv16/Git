import React, { useRef, useEffect } from "react";
import { Card, CardHeader, CardContent } from "../../components/ui/card.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select.jsx";
import { Badge } from "../../components/ui/badge.jsx";
import { Bot, User, Crown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const AI_MODELS = [
  { value: "gpt-4", label: "GPT-4", color: "bg-green-500" },
  { value: "gpt-3.5", label: "GPT-3.5", color: "bg-blue-500" },
  { value: "claude", label: "Claude", color: "bg-purple-500" },
  { value: "palm", label: "PaLM", color: "bg-orange-500" }
];

export default function AIChat({ 
  title, 
  model, 
  onModelChange, 
  messages, 
  isActive,
  gradientFrom,
  gradientTo,
  accentColor,
  isSpeaking
}) {
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const speakerName = title.split(' ')[0];

  return (
    <Card className={`h-full flex flex-col backdrop-blur-xl bg-black/20 border-white/10 overflow-hidden shadow-2xl transition-all duration-500 ${isSpeaking ? `border-${accentColor}-400 shadow-${accentColor}-500/30` : 'border-white/10'}`}>
      <CardHeader className="border-b border-white/10 pb-4 bg-black/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-xl flex items-center justify-center shadow-lg relative`}>
              <Bot className="w-5 h-5 text-white" />
              {isSpeaking && (
                <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse"></div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs border-${accentColor}-500/30 text-${accentColor}-300 bg-${accentColor}-500/10`}
                >
                  {isActive ? (
                    <>
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                      Active
                    </>
                  ) : (
                    "Inactive"
                  )}
                </Badge>
              </div>
            </div>
          </div>
          
          <Select value={model} onValueChange={onModelChange}>
            <SelectTrigger className="w-32 bg-black/20 border-white/20 text-white backdrop-blur-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/20 backdrop-blur-xl">
              {AI_MODELS.map((aiModel) => (
                <SelectItem key={aiModel.value} value={aiModel.value} className="text-white hover:bg-white/10">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 ${aiModel.color} rounded-full`}></div>
                    <span>{aiModel.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 min-h-0">
        <div className="h-full overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex justify-start"
              >
                <div className="max-w-[85%]">
                  <div className="p-4 rounded-2xl backdrop-blur-sm bg-black/30 border border-white/10 shadow-lg">
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-white/90">
                            {speakerName}
                          </span>
                          <span className="text-xs text-gray-400">
                            {format(new Date(message.timestamp), "HH:mm")}
                          </span>
                          {message.model_used && (
                            <Badge variant="secondary" className="text-xs bg-white/10 text-white/70 border border-white/10">
                              {message.model_used}
                            </Badge>
                          )}
                        </div>
                        <p className="text-white/90 leading-relaxed text-sm">
                          {message.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-center">
              <div className="space-y-3">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto opacity-50" />
                <p className="text-gray-400">Waiting for conversation...</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
    </Card>
  );
}