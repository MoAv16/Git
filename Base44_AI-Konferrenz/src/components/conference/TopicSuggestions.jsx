import React from "react";
import { Card, CardHeader, CardContent } from "../../components/ui/card.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Lightbulb, Rocket, Brain, Zap, Palette, Atom } from "lucide-react";
import { motion } from "framer-motion";

const QUICK_TOPICS = [
  { title: "Consciousness in AI", icon: Brain, color: "from-purple-500 to-indigo-600" },
  { title: "Mars Settlement Ethics", icon: Rocket, color: "from-red-500 to-orange-600" },
  { title: "Quantum Internet Future", icon: Zap, color: "from-blue-500 to-cyan-600" },
  { title: "Digital Art Evolution", icon: Palette, color: "from-pink-500 to-purple-600" },
];

export default function TopicSuggestions({ onTopicSelect }) {
  return (
    <Card className="glass-morphism border-white/20">
      <CardHeader className="border-b border-white/10 py-3">
        <div className="flex items-center space-x-3">
          <Lightbulb className="w-4 h-4 text-white" />
          <h3 className="text-sm font-bold text-white">Quick Topic Switch</h3>
        </div>
      </CardHeader>
      
      <CardContent className="p-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {QUICK_TOPICS.map((topic, index) => (
            <motion.div
              key={topic.title}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => onTopicSelect(topic.title)}
                variant="outline"
                className="w-full h-auto p-2 bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs"
              >
                <div className="flex items-center space-x-2">
                  <topic.icon className="w-3 h-3 text-white flex-shrink-0" />
                  <span className="leading-tight truncate">{topic.title}</span>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}