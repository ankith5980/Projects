import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const animationId = useRef(null);
  const particles = useRef([]);
  const mouse = useRef({ x: 0, y: 0 });

  // Particle configuration
  const config = {
    particleCount: 80,
    particleSize: 2,
    maxDistance: 120,
    mouseInfluence: 150,
    particleSpeed: 0.5,
  };

  // Create a single particle
  const createParticle = (width, height) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * config.particleSpeed,
    vy: (Math.random() - 0.5) * config.particleSpeed,
    size: config.particleSize,
  });

  // Update particle position
  const updateParticle = (particle, width, height) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    // Bounce off edges
    if (particle.x < 0 || particle.x > width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > height) particle.vy *= -1;

    // Keep within bounds
    particle.x = Math.max(0, Math.min(width, particle.x));
    particle.y = Math.max(0, Math.min(height, particle.y));
  };

  // Draw particles and connections
  const draw = (ctx, width, height) => {
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    ctx.fillStyle = 'rgba(99, 102, 241, 0.6)';
    particles.current.forEach(particle => {
      updateParticle(particle, width, height);
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw connections
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < particles.current.length; i++) {
      for (let j = i + 1; j < particles.current.length; j++) {
        const dx = particles.current[i].x - particles.current[j].x;
        const dy = particles.current[i].y - particles.current[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.maxDistance) {
          const opacity = 1 - distance / config.maxDistance;
          ctx.globalAlpha = opacity * 0.3;
          ctx.beginPath();
          ctx.moveTo(particles.current[i].x, particles.current[i].y);
          ctx.lineTo(particles.current[j].x, particles.current[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    draw(ctx, rect.width, rect.height);
    animationId.current = requestAnimationFrame(animate);
  };

  // Handle mouse movement
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouse.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Setup canvas and particles
  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Initialize particles
    particles.current = Array.from({ length: config.particleCount }, () => 
      createParticle(rect.width, rect.height)
    );

    // Start animation
    animate();
  };

  // Handle window resize
  const handleResize = () => {
    setupCanvas();
  };

  useEffect(() => {
    // Initial setup with a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setupCanvas();
    }, 100);

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
};

export default ParticleBackground;