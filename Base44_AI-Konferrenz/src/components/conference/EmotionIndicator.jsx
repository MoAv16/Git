import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "../../components/ui/badge.jsx";
import { TrendingUp, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EmotionIndicator = ({ emotion, confidence, stats, position = 'left' }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const emotionConfig = {
    positive: { 
      color: 'from-yellow-400 to-orange-500', 
      bgColor: 'bg-yellow-500/20',
      textColor: 'text-yellow-300',
      angle: 75 
    },
    neutral: { 
      color: 'from-blue-400 to-cyan-500', 
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-300',
      angle: 45 
    },
    negative: { 
      color: 'from-gray-400 to-gray-600', 
      bgColor: 'bg-gray-500/20',
      textColor: 'text-gray-300',
      angle: 15 
    },
    critical: { 
      color: 'from-red-400 to-red-600', 
      bgColor: 'bg-red-500/20',
      textColor: 'text-red-300',
      angle: 5 
    }
  };

  const config = emotionConfig[emotion] || emotionConfig.neutral;
  const circumference = 2 * Math.PI * 40;
  const strokeDasharray = `${(config.angle / 100) * circumference} ${circumference}`;

  return (
    <div className={`absolute top-4 ${position === 'left' ? 'left-4' : 'right-4'} z-10`}>
      <div
        className="relative"
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}
      >
        {/* Speedometer-style indicator */}
        <div className={`w-16 h-16 ${config.bgColor} backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105`}>
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="6"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={emotion === 'positive' ? '#FCD34D' : emotion === 'critical' ? '#F87171' : '#60A5FA'} />
                <stop offset="100%" stopColor={emotion === 'positive' ? '#F59E0B' : emotion === 'critical' ? '#DC2626' : '#3B82F6'} />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="text-center z-10">
            <div className={`text-sm font-bold ${config.textColor}`}>
              {Math.round(confidence)}%
            </div>
            <div className="text-xs text-gray-400 capitalize">
              {emotion}
            </div>
          </div>
        </div>

        {/* Detailed analytics popup */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className={`absolute top-20 ${position === 'left' ? 'left-0' : 'right-0'} w-56 z-20`}
            >
              <Card className="backdrop-blur-xl bg-black/60 border-white/10 shadow-2xl">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Emotion Analytics
                    </h4>
                    <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                      Live
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {Object.entries(stats || {}).map(([stat, value]) => (
                      <div key={stat} className="flex justify-between items-center">
                        <span className="text-xs text-gray-300 capitalize">
                          {stat.replace('_', ' ')}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full bg-gradient-to-r ${config.color} rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${value}%` }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                            />
                          </div>
                          <span className="text-xs text-white font-medium w-8 text-right">
                            {Math.round(value)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <div className="flex items-center text-xs text-gray-400">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Updated in real-time
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EmotionIndicator;