import React, { useState } from "react";
import { Button } from "../../components/ui/button.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Sparkles, MessageSquare, Zap, Brain, Rocket, Globe } from "lucide-react";
import { motion } from "framer-motion";

const STARTER_TOPICS = [
  {
    title: "The Future of AI Ethics",
    description: "Discussing responsible AI development and moral frameworks",
    icon: Brain,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Climate Tech Innovation",
    description: "Revolutionary technologies for environmental sustainability",
    icon: Globe,
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Quantum Computing Breakthroughs",
    description: "The next frontier in computational power and possibilities",
    icon: Zap,
    color: "from-purple-500 to-indigo-500"
  },
  {
    title: "Space Colonization Strategies",
    description: "Planning humanity's expansion beyond Earth",
    icon: Rocket,
    color: "from-orange-500 to-red-500"
  }
];

export default function ConversationStarter({ onStart }) {
  const [customTopic, setCustomTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);


const handleStart = async (topic) => {
    setIsLoading(true);
    await onStart(topic);
    setIsLoading(false);
  };

  const handleCustomStart = () => {
    if (customTopic.trim()) {
      handleStart(customTopic);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl pulse-glow float-animation">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent text-glow leading-tight">
          AI Conference Room
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Witness cutting-edge AI conversations in real-time. Choose a topic and watch two AI minds explore ideas together.
        </p>
      </motion.div>

      {/* Custom Topic Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="glass-morphism rounded-3xl p-8 mb-8 neomorphic"
      >
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Enter your conversation topic..."
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCustomStart()}
              className="h-14 text-lg bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          <Button
            onClick={handleCustomStart}
            disabled={!customTopic.trim() || isLoading}
            className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold rounded-2xl magnetic-hover shadow-2xl"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <MessageSquare className="w-5 h-5 mr-2" />
                Start Discussion
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Preset Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          Or choose from popular topics
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {STARTER_TOPICS.map((topic, index) => (
            <motion.div
              key={topic.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-morphism rounded-2xl p-6 cursor-pointer magnetic-hover neomorphic"
              onClick={() => handleStart(topic.title)}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${topic.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <topic.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white mb-2">{topic.title}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{topic.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}