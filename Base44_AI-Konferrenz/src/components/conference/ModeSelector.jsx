import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../../components/ui/button.jsx";
import { 
  MessageSquare, 
  Headphones, 
  BookOpen, 
  Focus,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Snowflake,
  Flower,
  Leaf,
  TreePine
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";

const ModeSelector = ({ 
  currentMode, 
  onModeChange, 
  timeOfDay, 
  onTimeOfDayChange,
  season,
  onSeasonChange,
  isCollapsed,
  onToggleCollapse 
}) => {
  const modes = [
    { 
      id: 'conference', 
      name: 'Conference', 
      icon: MessageSquare, 
      description: 'Full dynamic background',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'focus', 
      name: 'Focus', 
      icon: Focus, 
      description: 'Minimal distractions',
      color: 'from-gray-500 to-gray-600'
    },
    { 
      id: 'podcast', 
      name: 'Podcast', 
      icon: Headphones, 
      description: 'Relaxed atmosphere',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'storytelling', 
      name: 'Storytelling', 
      icon: BookOpen, 
      description: 'Immersive themes',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const timeOptions = [
    { id: 'dawn', name: 'Dawn', icon: Sunrise },
    { id: 'midday', name: 'Midday', icon: Sun },
    { id: 'sunset', name: 'Sunset', icon: Sunset },
    { id: 'night', name: 'Night', icon: Moon }
  ];

  const seasonOptions = [
    { id: 'winter', name: 'Winter', icon: Snowflake },
    { id: 'spring', name: 'Spring', icon: Flower },
    { id: 'summer', name: 'Summer', icon: Sun },
    { id: 'autumn', name: 'Autumn', icon: Leaf }
  ];

  if (isCollapsed) {
    return (
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 'auto' }}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 z-30"
      >
        <Button
          onClick={onToggleCollapse}
          className="bg-black/40 backdrop-blur-xl border border-white/10 text-white hover:bg-black/60 rounded-l-xl rounded-r-none h-32 w-6"
        >
          <div className="transform rotate-90 text-xs font-medium tracking-wider">
            MODES
          </div>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      className="fixed right-0 top-0 h-full w-80 backdrop-blur-xl bg-black/20 border-l border-white/10 z-30 overflow-y-auto"
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Experience Modes</h3>
          <Button
            onClick={onToggleCollapse}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            ×
          </Button>
        </div>

        {/* Mode Selection */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 space-y-3">
            <h4 className="text-sm font-semibold text-white">Visual Mode</h4>
            <div className="space-y-2">
              {modes.map((mode) => (
                <Button
                  key={mode.id}
                  onClick={() => onModeChange(mode.id)}
                  variant={currentMode === mode.id ? "default" : "outline"}
                  className={`w-full justify-start h-auto p-3 ${
                    currentMode === mode.id 
                      ? `bg-gradient-to-r ${mode.color} text-white border-transparent` 
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <mode.icon className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">{mode.name}</div>
                      <div className="text-xs opacity-70">{mode.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time of Day (only for storytelling mode) */}
        {currentMode === 'storytelling' && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 space-y-3">
              <h4 className="text-sm font-semibold text-white">Time of Day</h4>
              <div className="grid grid-cols-2 gap-2">
                {timeOptions.map((time) => (
                  <Button
                    key={time.id}
                    onClick={() => onTimeOfDayChange(time.id)}
                    variant={timeOfDay === time.id ? "default" : "outline"}
                    size="sm"
                    className={`${
                      timeOfDay === time.id 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    <time.icon className="w-4 h-4 mr-2" />
                    {time.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Podcast Topics */}
        {currentMode === 'podcast' && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 space-y-3">
              <h4 className="text-sm font-semibold text-white">Podcast Themes</h4>
              <div className="space-y-2">
                {[
                  "Conversations for Sleep",
                  "Tech Talk After Dark", 
                  "Meditative Dialogues",
                  "Philosophy & Coffee"
                ].map((theme) => (
                  <Button
                    key={theme}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start bg-white/5 border-white/10 text-white hover:bg-white/10"
                  >
                    {theme}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Accessibility Options */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 space-y-3">
            <h4 className="text-sm font-semibold text-white">Accessibility</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded bg-white/10 border-white/20" />
                <span className="text-sm text-white">Reduce motion</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded bg-white/10 border-white/20" />
                <span className="text-sm text-white">High contrast</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Current Mode</span>
              <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                {modes.find(m => m.id === currentMode)?.name}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ModeSelector;