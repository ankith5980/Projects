import React, { useEffect, useRef, useCallback, useMemo } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef([]);
  const isActiveRef = useRef(true);

  // Configuration - optimized for performance and visual appeal
  const config = useMemo(() => ({
    particleCount: 85, // Slightly increased for better connectivity
    particleSize: 2,
    maxDistance: 140, // Increased connection distance for more lines
    mouseInfluence: 180, // Larger mouse influence radius
    mouseAttractForce: 0.0012, // Stronger attraction force
    mouseRepelDistance: 50, // Distance at which particles start to repel
    mouseRepelForce: 0.0015, // Repulsion force when too close
    particleSpeed: 0.4, // Slightly faster base movement
    damping: 0.985, // Reduced damping for smoother movement
    returnToOriginal: 0.008, // Slower return to original velocity
    connectionOpacity: 0.25, // Increased line opacity
    connectionWidthVariation: true, // Dynamic line width based on distance
    particleOpacity: 0.7, // Increased particle opacity
    colors: {
      particles: 'rgba(99, 102, 241, 0.7)', // Primary color
      connections: 'rgba(99, 102, 241, 0.25)', // Connection lines
      closeConnections: 'rgba(99, 102, 241, 0.4)', // Stronger lines for close particles
    }
  }), []);

  // Particle class for better performance
  const createParticle = useCallback((canvas) => {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * config.particleSpeed,
      vy: (Math.random() - 0.5) * config.particleSpeed,
      originalVx: (Math.random() - 0.5) * config.particleSpeed,
      originalVy: (Math.random() - 0.5) * config.particleSpeed,
      size: config.particleSize + Math.random() * 2,
    };
  }, [config]);

  // Initialize particles
  const initParticles = useCallback((canvas) => {
    particlesRef.current = Array.from({ length: config.particleCount }, () => 
      createParticle(canvas)
    );
  }, [config.particleCount, createParticle]);

  // Update particle position with enhanced mouse interaction
  const updateParticle = useCallback((particle, canvas, mouse) => {
    // Calculate distance to mouse
    const dx = mouse.x - particle.x;
    const dy = mouse.y - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Apply mouse influence with attraction/repulsion
    if (distance < config.mouseInfluence && distance > 0) {
      const normalizedDx = dx / distance;
      const normalizedDy = dy / distance;
      
      if (distance < config.mouseRepelDistance) {
        // Repel when too close
        const repelForce = (1 - distance / config.mouseRepelDistance) * config.mouseRepelForce;
        particle.vx -= normalizedDx * repelForce;
        particle.vy -= normalizedDy * repelForce;
      } else {
        // Attract when in influence range
        const attractForce = (1 - distance / config.mouseInfluence) * config.mouseAttractForce;
        particle.vx += normalizedDx * attractForce;
        particle.vy += normalizedDy * attractForce;
      }
    }

    // Apply damping and gradual return to original velocity
    particle.vx = particle.vx * config.damping + particle.originalVx * config.returnToOriginal;
    particle.vy = particle.vy * config.damping + particle.originalVy * config.returnToOriginal;

    // Update position
    particle.x += particle.vx;
    particle.y += particle.vy;

    // Enhanced boundary handling with softer bounce
    if (particle.x < 0 || particle.x > canvas.width) {
      particle.vx *= -0.7;
      particle.x = Math.max(0, Math.min(canvas.width, particle.x));
      // Add some randomness to avoid stuck particles
      particle.originalVx += (Math.random() - 0.5) * 0.1;
    }
    if (particle.y < 0 || particle.y > canvas.height) {
      particle.vy *= -0.7;
      particle.y = Math.max(0, Math.min(canvas.height, particle.y));
      // Add some randomness to avoid stuck particles
      particle.originalVy += (Math.random() - 0.5) * 0.1;
    }
  }, [config]);

  // Apply particle-to-particle interactions
  const applyParticleInteractions = useCallback((particles) => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Very slight attraction between connected particles
        if (distance < config.maxDistance && distance > 20) {
          const force = 0.00008; // Very subtle force
          const normalizedDx = dx / distance;
          const normalizedDy = dy / distance;
          
          particles[i].vx -= normalizedDx * force;
          particles[i].vy -= normalizedDy * force;
          particles[j].vx += normalizedDx * force;
          particles[j].vy += normalizedDy * force;
        }
        
        // Slight repulsion when too close to prevent overlap
        if (distance < 15 && distance > 0) {
          const repelForce = 0.0002;
          const normalizedDx = dx / distance;
          const normalizedDy = dy / distance;
          
          particles[i].vx += normalizedDx * repelForce;
          particles[i].vy += normalizedDy * repelForce;
          particles[j].vx -= normalizedDx * repelForce;
          particles[j].vy -= normalizedDy * repelForce;
        }
      }
    }
  }, [config]);

  // Optimized drawing function
  const draw = useCallback((ctx, canvas) => {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    // Apply particle interactions first
    applyParticleInteractions(particles);

    // Update and draw particles
    ctx.fillStyle = config.colors.particles;
    particles.forEach(particle => {
      updateParticle(particle, canvas, mouse);
      
      // Draw particle with slight glow effect
      ctx.globalAlpha = config.particleOpacity;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add subtle glow for particles near mouse
      const mouseDistance = Math.sqrt(
        (mouse.x - particle.x) ** 2 + (mouse.y - particle.y) ** 2
      );
      if (mouseDistance < config.mouseInfluence) {
        const glowIntensity = (1 - mouseDistance / config.mouseInfluence) * 0.3;
        ctx.globalAlpha = glowIntensity;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size + 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    ctx.globalAlpha = 1;

    // Draw enhanced connections with dynamic properties
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.maxDistance) {
          // Calculate dynamic properties based on distance
          const distanceRatio = distance / config.maxDistance;
          let opacity = (1 - distanceRatio) * config.connectionOpacity;
          
          // Check if connection is near mouse for enhancement
          const midX = (particles[i].x + particles[j].x) / 2;
          const midY = (particles[i].y + particles[j].y) / 2;
          const mouseDistanceToLine = Math.sqrt(
            (mouse.x - midX) ** 2 + (mouse.y - midY) ** 2
          );
          
          // Enhance connections near mouse
          let lineWidth = 1;
          let strokeColor = config.colors.connections;
          
          if (mouseDistanceToLine < config.mouseInfluence / 2) {
            const enhancementFactor = 1 - (mouseDistanceToLine / (config.mouseInfluence / 2));
            opacity *= (1 + enhancementFactor * 0.8); // Increase opacity
            lineWidth = 1 + enhancementFactor * 0.8; // Increase width
            
            // Use stronger color for enhanced connections
            if (enhancementFactor > 0.5) {
              strokeColor = config.colors.closeConnections;
            }
          }
          
          // Dynamic line width for close particles
          if (config.connectionWidthVariation && distance < config.maxDistance * 0.6) {
            lineWidth = Math.max(lineWidth, 1.3);
          }
          
          // Use different colors for very close connections
          if (distance < config.maxDistance * 0.4) {
            strokeColor = config.colors.closeConnections;
          }
          
          // Set line properties
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = lineWidth;
          ctx.globalAlpha = Math.min(opacity, 0.8); // Cap opacity to prevent overwhelming
          
          // Draw the connection
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    
    ctx.globalAlpha = 1;
  }, [config, updateParticle]);

  // Animation loop with performance optimization
  const animate = useCallback(() => {
    if (!isActiveRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (canvas && ctx) {
      draw(ctx, canvas);
    }
    
    animationRef.current = requestAnimationFrame(animate);
  }, [draw]);

  // Handle mouse movement with throttling
  const handleMouseMove = useCallback((event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  }, []);

  // Handle resize with debouncing
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Reinitialize particles for new canvas size
    initParticles(canvas);
  }, [initParticles]);

  // Throttled resize handler
  const throttledResize = useMemo(() => {
    let timeoutId;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 250);
    };
  }, [handleResize]);

  // Performance optimization: pause animation when tab is hidden
  const handleVisibilityChange = useCallback(() => {
    isActiveRef.current = !document.hidden;
    if (isActiveRef.current) {
      animate();
    }
  }, [animate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initial setup
    handleResize();
    animate();

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', throttledResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      isActiveRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', throttledResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleMouseMove, throttledResize, handleVisibilityChange, animate, handleResize]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default React.memo(ParticleBackground);