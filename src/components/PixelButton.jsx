import { useState, useEffect, useRef, memo } from 'react';

// Memoize component to prevent unnecessary re-renders
const PixelButton = memo(({ 
  children, 
  onClick, 
  className = '', 
  variant = 'normal', 
  pixelSize = 4,
  pixelDensity = 0.3,
  pixelColors = {
    normal: ['#10B981', '#059669', '#047857'],
    hard: ['#EF4444', '#DC2626', '#B91C1C']
  }
}) => {
  const buttonRef = useRef(null);
  const canvasRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [buttonSize, setButtonSize] = useState({ width: 0, height: 0 });
  const animationRef = useRef(null);
  const frameRef = useRef(0);
  
  // Colors based on variant
  const colors = pixelColors[variant] || pixelColors.normal;
  
  // Shadow classes based on variant
  const glowClass = variant === 'hard' ? 'shadow-pixel-glow-red' : 'shadow-pixel-glow-green';
  
  // Effect to measure button size
  useEffect(() => {
    const updateSize = () => {
      if (buttonRef.current) {
        const { width, height } = buttonRef.current.getBoundingClientRect();
        setButtonSize({ width, height });
      }
    };
    
    // Measure initial size
    updateSize();
    
    // Update size on window resize
    window.addEventListener('resize', updateSize);
    
    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Effect to draw pixels on hover
  useEffect(() => {
    if (!canvasRef.current || !isHovered || buttonSize.width === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    
    // Set up the canvas with the correct size
    canvas.width = buttonSize.width;
    canvas.height = buttonSize.height;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Number of pixels based on button size and density
    const pixelsX = Math.floor(buttonSize.width / pixelSize);
    const pixelsY = Math.floor(buttonSize.height / pixelSize);
    
    // Create pixel matrix to avoid recalculating each frame
    const pixels = [];
    for (let x = 0; x < pixelsX; x++) {
      for (let y = 0; y < pixelsY; y++) {
        if (Math.random() < pixelDensity) {
          pixels.push({
            x,
            y,
            color: colors[Math.floor(Math.random() * colors.length)],
            phase: Math.random() * Math.PI * 2, // Random phase for animation
            size: Math.random() * 2 + 1 // Random size for variety
          });
        }
      }
    }
    
    // Function to animate pixels
    const animatePixels = () => {
      frameRef.current++;
      
      // Clear canvas each frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw pixels
      pixels.forEach(pixel => {
        const { x, y, color, phase, size } = pixel;
        
        // Calculate position with small offset based on frame
        const offsetX = Math.sin((frameRef.current * 0.1) + phase) * 2;
        const offsetY = Math.cos((frameRef.current * 0.1) + phase) * 2;
        
        // Add pulse effect to size
        const pulseEffect = isPressed ? 0.8 : 1 + Math.sin(frameRef.current * 0.2 + phase) * 0.2;
        
        ctx.fillStyle = color;
        ctx.fillRect(
          x * pixelSize + offsetX, 
          y * pixelSize + offsetY, 
          pixelSize * size * pulseEffect, 
          pixelSize * size * pulseEffect
        );
      });
      
      // Continue animation if button is still hovered
      if (isHovered) {
        animationRef.current = requestAnimationFrame(animatePixels);
      }
    };
    
    // Start animation
    frameRef.current = 0;
    animatePixels();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered, isPressed, buttonSize, colors, pixelSize, pixelDensity]);
  
  return (
    <div 
      ref={buttonRef}
      className={`relative overflow-hidden transition-all duration-200 ${className} ${isHovered ? glowClass : ''} ${isHovered ? 'animate-pixel-dance' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={onClick}
    >
      {isHovered && (
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-0 opacity-70 gpu-accelerated"
          style={{ 
            mixBlendMode: 'screen', 
            willChange: 'transform',
            filter: `blur(${isPressed ? '1px' : '0.5px'})`
          }}
        />
      )}
      <div className={`relative z-10 transition-transform duration-200 ${isPressed ? 'scale-95' : ''}`}>
        {children}
      </div>
    </div>
  );
});

// Name for DevTools
PixelButton.displayName = 'PixelButton';

export default PixelButton;