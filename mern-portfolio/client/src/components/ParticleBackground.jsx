import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef([]);
  const isActiveRef = useRef(false); // Start as false until initialized
  const [isInitialized, setIsInitialized] = useState(false);

  // Configuration - optimized to prevent convergence
  const config = useMemo(() => ({
    particleCount: 85,
    particleSize: 2,
    maxDistance: 140,
    mouseInfluence: 120, // Further reduced mouse influence for less distraction
    mouseAttractForce: 0.0005, // Further reduced attraction force
    mouseRepelDistance: 60, // Increased repel distance
    mouseRepelForce: 0.0015, // Reduced repulsion for gentler interaction
    particleSpeed: 0.3, // Reduced base movement speed for less distraction
    minSpeed: 0.1, // Reduced minimum speed for gentler movement
    maxSpeed: 0.6, // Reduced maximum speed limit for calmer effect
    velocityDecay: 0.998, // Very minimal velocity decay
    boundaryForce: 0.08, // Slightly reduced boundary force for smoother movement
    centerRepulsion: 0.0003, // Slightly reduced center repulsion for gentler behavior
    connectionOpacity: 0.25,
    connectionWidthVariation: true,
    particleOpacity: 0.7,
    colors: {
      particles: 'rgba(99, 102, 241, 0.7)',
      connections: 'rgba(99, 102, 241, 0.25)',
      closeConnections: 'rgba(99, 102, 241, 0.4)',
    }
  }), []);

  // Particle creation with better velocity distribution
  const createParticle = useCallback((canvas) => {
    // Ensure minimum velocity to prevent convergence
    const angle = Math.random() * Math.PI * 2;
    const speed = config.minSpeed + Math.random() * (config.particleSpeed - config.minSpeed);
    
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: config.particleSize + Math.random() * 2,
      // Add unique ID for tracking
      id: Math.random(),
    };
  }, [config]);

  // Initialize particles
  const initParticles = useCallback((canvas) => {
    particlesRef.current = Array.from({ length: config.particleCount }, () => 
      createParticle(canvas)
    );
  }, [config.particleCount, createParticle]);

  // Update particle position - anti-convergence system
  const updateParticle = useCallback((particle, canvas, mouse) => {
    // Center repulsion to prevent convergence
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const centerDx = particle.x - centerX;
    const centerDy = particle.y - centerY;
    const centerDistance = Math.sqrt(centerDx * centerDx + centerDy * centerDy);
    
    // Apply center repulsion when particles get too close to center
    if (centerDistance < canvas.width * 0.3 && centerDistance > 0) {
      const repelStrength = config.centerRepulsion * (1 - centerDistance / (canvas.width * 0.3));
      particle.vx += (centerDx / centerDistance) * repelStrength;
      particle.vy += (centerDy / centerDistance) * repelStrength;
    }

    // Mouse interaction - more controlled
    const mouseDx = mouse.x - particle.x;
    const mouseDy = mouse.y - particle.y;
    const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

    if (mouseDistance < config.mouseInfluence && mouseDistance > 0) {
      const normalizedDx = mouseDx / mouseDistance;
      const normalizedDy = mouseDy / mouseDistance;
      
      if (mouseDistance < config.mouseRepelDistance) {
        // Strong repulsion when mouse is close
        const repelForce = (1 - mouseDistance / config.mouseRepelDistance) * config.mouseRepelForce;
        particle.vx -= normalizedDx * repelForce;
        particle.vy -= normalizedDy * repelForce;
      } else {
        // Gentle attraction when mouse is in range
        const attractForce = (1 - mouseDistance / config.mouseInfluence) * config.mouseAttractForce;
        particle.vx += normalizedDx * attractForce;
        particle.vy += normalizedDy * attractForce;
      }
    }

    // Boundary forces to keep particles away from edges
    const margin = 50;
    if (particle.x < margin) {
      particle.vx += config.boundaryForce * (margin - particle.x) / margin;
    } else if (particle.x > canvas.width - margin) {
      particle.vx -= config.boundaryForce * (particle.x - (canvas.width - margin)) / margin;
    }
    
    if (particle.y < margin) {
      particle.vy += config.boundaryForce * (margin - particle.y) / margin;
    } else if (particle.y > canvas.height - margin) {
      particle.vy -= config.boundaryForce * (particle.y - (canvas.height - margin)) / margin;
    }

    // Apply minimal velocity decay
    particle.vx *= config.velocityDecay;
    particle.vy *= config.velocityDecay;

    // Maintain minimum speed to prevent convergence
    const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
    if (currentSpeed < config.minSpeed) {
      const angle = Math.atan2(particle.vy, particle.vx) + (Math.random() - 0.5) * 0.1;
      particle.vx = Math.cos(angle) * config.minSpeed;
      particle.vy = Math.sin(angle) * config.minSpeed;
    }

    // Limit maximum speed
    if (currentSpeed > config.maxSpeed) {
      particle.vx = (particle.vx / currentSpeed) * config.maxSpeed;
      particle.vy = (particle.vy / currentSpeed) * config.maxSpeed;
    }

    // Update position
    particle.x += particle.vx;
    particle.y += particle.vy;

    // Boundary bouncing with randomization
    if (particle.x <= 0 || particle.x >= canvas.width) {
      particle.vx = -particle.vx * (0.8 + Math.random() * 0.2);
      particle.x = Math.max(1, Math.min(canvas.width - 1, particle.x));
      // Add random velocity component to prevent patterns
      particle.vy += (Math.random() - 0.5) * 0.1;
    }
    if (particle.y <= 0 || particle.y >= canvas.height) {
      particle.vy = -particle.vy * (0.8 + Math.random() * 0.2);
      particle.y = Math.max(1, Math.min(canvas.height - 1, particle.y));
      // Add random velocity component to prevent patterns
      particle.vx += (Math.random() - 0.5) * 0.1;
    }
  }, [config]);

  // Apply particle-to-particle interactions - repulsion only
  const applyParticleInteractions = useCallback((particles) => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only repulsion when particles are too close to prevent overlap
        if (distance < 25 && distance > 0) {
          const repelForce = 0.0002 * (1 - distance / 25); // Reduced repulsion force for gentler movement
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

  // Optimized drawing function with anti-convergence measures
  const draw = useCallback((ctx, canvas) => {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    // Periodic velocity refresh to prevent convergence (every 300 frames)
    if (animationRef.frameCount === undefined) animationRef.frameCount = 0;
    animationRef.frameCount = (animationRef.frameCount + 1) % 300;
    
    if (animationRef.frameCount === 0) {
      particles.forEach(particle => {
        // Check if particle has low velocity or is in convergence pattern
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed < config.minSpeed * 1.5) {
          // Refresh velocity with random direction
          const angle = Math.random() * Math.PI * 2;
          const newSpeed = config.minSpeed + Math.random() * (config.particleSpeed - config.minSpeed);
          particle.vx = Math.cos(angle) * newSpeed;
          particle.vy = Math.sin(angle) * newSpeed;
        }
      });
    }

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
    
    if (canvas && ctx && particlesRef.current.length > 0) {
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
    particlesRef.current = Array.from({ length: config.particleCount }, () => 
      createParticle(canvas)
    );
  }, [config.particleCount, createParticle]);

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
  }, []);

  // Initialize the particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let mounted = true;
    
    const initializeParticles = () => {
      if (!mounted) return;
      
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      // Wait for canvas to have proper dimensions
      if (rect.width === 0 || rect.height === 0) {
        setTimeout(() => initializeParticles(), 50);
        return;
      }

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      // Initialize particles
      particlesRef.current = Array.from({ length: config.particleCount }, () => 
        createParticle(canvas)
      );

      setIsInitialized(true);
      isActiveRef.current = true;
    };

    // Start initialization with a delay to ensure DOM is ready
    setTimeout(() => initializeParticles(), 100);

    return () => {
      mounted = false;
      isActiveRef.current = false;
    };
  }, []);

  // Handle animation loop
  useEffect(() => {
    if (!isInitialized) return;

    const animateLoop = () => {
      if (!isActiveRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      
      if (canvas && ctx && particlesRef.current.length > 0) {
        draw(ctx, canvas);
      }
      
      animationRef.current = requestAnimationFrame(animateLoop);
    };

    animationRef.current = requestAnimationFrame(animateLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInitialized, draw]);

  // Handle event listeners
  useEffect(() => {
    if (!isInitialized) return;

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', throttledResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', throttledResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isInitialized, handleMouseMove, throttledResize, handleVisibilityChange]);

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
        opacity: isInitialized ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out'
      }}
    />
  );
};

export default React.memo(ParticleBackground);