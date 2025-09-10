import React, { useRef, useEffect, useState } from 'react';

// Move constant objects outside component to avoid dependency issues
const emotionColors = {
  positive: { r: 255, g: 179, b: 71 },  // Warm gold
  neutral: { r: 59, g: 130, b: 246 },   // Cool blue  
  negative: { r: 156, g: 163, b: 175 }, // Muted gray
  critical: { r: 239, g: 68, b: 68 }    // Soft red
};

const modeConfigs = {
  conference: { particleCount: 150, speed: 0.5, size: 2 },
  podcast: { particleCount: 80, speed: 0.2, size: 1.5 },
  storytelling: { particleCount: 200, speed: 0.3, size: 1 },
  focus: { particleCount: 0, speed: 0, size: 0 }
};

const timeOfDayColors = {
  dawn: { r: 255, g: 194, b: 153 },
  midday: { r: 135, g: 206, b: 235 },
  sunset: { r: 255, g: 140, b: 105 },
  night: { r: 25, g: 25, b: 112 }
};

const ParticleBackground = ({ 
  leftEmotion = 'neutral', 
  rightEmotion = 'neutral', 
  mode = 'conference',
  reduceMotion = false,
  timeOfDay = 'night'
}) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas size
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const config = modeConfigs[mode];
    
    // Initialize particles
    particlesRef.current = [];
    for (let i = 0; i < config.particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        size: Math.random() * config.size + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        life: Math.random() * 1000
      });
    }

    const animate = () => {
      if (!isVisible || reduceMotion) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, rect.width, rect.height);

      // Get current emotion colors
      const leftColor = emotionColors[leftEmotion] || emotionColors.neutral;
      const rightColor = emotionColors[rightEmotion] || emotionColors.neutral;
      const baseColor = mode === 'storytelling' ? timeOfDayColors[timeOfDay] : { r: 30, g: 41, b: 59 };

      particlesRef.current.forEach((particle, index) => {
        // Update particle position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life += 1;

        // Wrap around edges
        if (particle.x < 0) particle.x = rect.width;
        if (particle.x > rect.width) particle.x = 0;
        if (particle.y < 0) particle.y = rect.height;
        if (particle.y > rect.height) particle.y = 0;

        // Determine color based on position (left or right half)
        const isLeftSide = particle.x < rect.width / 2;
        const emotionColor = isLeftSide ? leftColor : rightColor;
        
        // Blend with base color
        const blendFactor = 0.3;
        const finalColor = {
          r: Math.round(baseColor.r * (1 - blendFactor) + emotionColor.r * blendFactor),
          g: Math.round(baseColor.g * (1 - blendFactor) + emotionColor.g * blendFactor),
          b: Math.round(baseColor.b * (1 - blendFactor) + emotionColor.b * blendFactor)
        };

        // Animate opacity based on life cycle
        const lifeProgress = (particle.life % 300) / 300;
        const animatedOpacity = particle.opacity * (0.5 + 0.5 * Math.sin(lifeProgress * Math.PI * 2));

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${finalColor.r}, ${finalColor.g}, ${finalColor.b}, ${animatedOpacity})`;
        ctx.fill();

        // Add subtle glow effect
        ctx.shadowBlur = 4;
        ctx.shadowColor = `rgba(${finalColor.r}, ${finalColor.g}, ${finalColor.b}, 0.3)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [leftEmotion, rightEmotion, mode, reduceMotion, timeOfDay, isVisible]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ 
        opacity: mode === 'focus' ? 0.1 : 1,
        transition: 'opacity 1s ease-in-out'
      }}
    />
  );
};

export default ParticleBackground;