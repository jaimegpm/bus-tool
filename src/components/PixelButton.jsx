import { useState, useEffect, useRef, memo } from 'react';

// Memoizamos el componente para evitar renderizados innecesarios
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
  
  // Colores basados en la variante
  const colors = pixelColors[variant] || pixelColors.normal;
  
  // Clases de sombra basadas en la variante
  const glowClass = variant === 'hard' ? 'shadow-pixel-glow-red' : 'shadow-pixel-glow-green';
  
  // Efecto para medir el tamaño del botón
  useEffect(() => {
    const updateSize = () => {
      if (buttonRef.current) {
        const { width, height } = buttonRef.current.getBoundingClientRect();
        setButtonSize({ width, height });
      }
    };
    
    // Medir el tamaño inicial
    updateSize();
    
    // Actualizar el tamaño si cambia la ventana
    window.addEventListener('resize', updateSize);
    
    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Efecto para dibujar los píxeles cuando se hace hover
  useEffect(() => {
    if (!canvasRef.current || !isHovered || buttonSize.width === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    
    // Set up the canvas with the correct size
    canvas.width = buttonSize.width;
    canvas.height = buttonSize.height;
    
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Número de píxeles basado en el tamaño del botón y la densidad
    const pixelsX = Math.floor(buttonSize.width / pixelSize);
    const pixelsY = Math.floor(buttonSize.height / pixelSize);
    
    // Crear una matriz de píxeles para evitar recalcular en cada frame
    const pixels = [];
    for (let x = 0; x < pixelsX; x++) {
      for (let y = 0; y < pixelsY; y++) {
        if (Math.random() < pixelDensity) {
          pixels.push({
            x,
            y,
            color: colors[Math.floor(Math.random() * colors.length)],
            phase: Math.random() * Math.PI * 2, // Fase aleatoria para animación
            size: Math.random() * 2 + 1 // Tamaño aleatorio para variedad
          });
        }
      }
    }
    
    // Función para animar los píxeles
    const animatePixels = () => {
      frameRef.current++;
      
      // Limpiar el canvas en cada frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dibujar píxeles
      pixels.forEach(pixel => {
        const { x, y, color, phase, size } = pixel;
        
        // Calcular la posición con un pequeño desplazamiento basado en el frame
        const offsetX = Math.sin((frameRef.current * 0.1) + phase) * 2;
        const offsetY = Math.cos((frameRef.current * 0.1) + phase) * 2;
        
        // Añadir un efecto de pulsación al tamaño
        const pulseEffect = isPressed ? 0.8 : 1 + Math.sin(frameRef.current * 0.2 + phase) * 0.2;
        
        ctx.fillStyle = color;
        ctx.fillRect(
          x * pixelSize + offsetX, 
          y * pixelSize + offsetY, 
          pixelSize * size * pulseEffect, 
          pixelSize * size * pulseEffect
        );
      });
      
      // Continuar la animación si el botón sigue en hover
      if (isHovered) {
        animationRef.current = requestAnimationFrame(animatePixels);
      }
    };
    
    // Iniciar la animación
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

// Nombre para DevTools
PixelButton.displayName = 'PixelButton';

export default PixelButton; 