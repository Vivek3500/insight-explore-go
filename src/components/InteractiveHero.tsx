import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Compass } from 'lucide-react';
import * as THREE from 'three';

const InteractiveHero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const clearPointsRef = useRef<Array<{ x: number; y: number; time: number }>>([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: true,
      antialias: false 
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Shader for fog effect
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform vec2 uResolution;
      uniform float uTime;
      uniform vec2 uClearPoints[20];
      uniform float uClearTimes[20];
      uniform int uClearCount;
      
      varying vec2 vUv;
      
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      void main() {
        vec2 uv = vUv;
        float aspect = uResolution.x / uResolution.y;
        
        // Animated noise for organic fog movement
        float n = noise(uv * 10.0 + uTime * 0.1);
        n = n * 0.03;
        
        // Base fog density
        float fogDensity = 0.9;
        
        // Calculate clearing effect from all clear points
        for(int i = 0; i < 20; i++) {
          if(i >= uClearCount) break;
          
          vec2 clearPoint = uClearPoints[i];
          float clearTime = uClearTimes[i];
          
          // Calculate distance with aspect ratio correction
          vec2 diff = vec2((uv.x - clearPoint.x) * aspect, uv.y - clearPoint.y);
          float dist = length(diff);
          
          // Clear radius in UV space (150px converted to UV)
          float clearRadius = 0.15;
          
          // Calculate how long since this point was cleared
          float timeSinceClear = uTime - clearTime;
          
          // Fade back over 2.5 seconds
          float fadeBack = smoothstep(0.0, 2.5, timeSinceClear);
          
          // Smooth clearing with gradient
          float clearing = 1.0 - smoothstep(0.0, clearRadius, dist);
          clearing = clearing * (1.0 - fadeBack);
          
          fogDensity -= clearing * 0.9;
        }
        
        // Clamp fog density
        fogDensity = clamp(fogDensity + n, 0.0, 0.9);
        
        // Dark fog color with alpha
        gl_FragColor = vec4(0.0, 0.0, 0.0, fogDensity);
      }
    `;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uTime: { value: 0 },
        uClearPoints: { value: Array(20).fill(new THREE.Vector2(0.5, 0.5)) },
        uClearTimes: { value: Array(20).fill(-10) },
        uClearCount: { value: 0 }
      }
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      material.uniforms.uResolution.value.set(width, height);
    };
    handleResize();

    // Mouse/touch handlers
    const updateMousePosition = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX / rect.width;
      const y = 1.0 - (clientY / rect.height);
      
      mouseRef.current = { x, y };
      
      // Add clear point
      const now = performance.now() / 1000;
      clearPointsRef.current.push({ x, y, time: now });
      
      // Keep only last 20 points
      if (clearPointsRef.current.length > 20) {
        clearPointsRef.current.shift();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateMousePosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateMousePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateMousePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    // Animation loop
    let animationId: number;
    const animate = () => {
      const time = performance.now() / 1000;
      material.uniforms.uTime.value = time;
      
      // Update clear points and times
      const points = clearPointsRef.current.map(p => new THREE.Vector2(p.x, p.y));
      const times = clearPointsRef.current.map(p => p.time);
      
      material.uniforms.uClearPoints.value = [
        ...points,
        ...Array(20 - points.length).fill(new THREE.Vector2(0.5, 0.5))
      ];
      material.uniforms.uClearTimes.value = [
        ...times,
        ...Array(20 - times.length).fill(-10)
      ];
      material.uniforms.uClearCount.value = points.length;
      
      // Remove old clear points (older than 3 seconds)
      clearPointsRef.current = clearPointsRef.current.filter(p => time - p.time < 3);
      
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchstart', handleTouch);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouch);
      cancelAnimationFrame(animationId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[hsl(var(--hero-bg-light))] to-[hsl(var(--hero-bg-lighter))]">
      {/* WebGL Fog Canvas */}
      <canvas 
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-10"
        style={{ mixBlendMode: 'normal' }}
      />
      
      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-20 sm:py-32 flex items-center justify-center min-h-screen">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--accent-cyan))]/10 text-[hsl(var(--accent-cyan))] text-sm font-medium mb-6 transition-transform hover:scale-105">
            <Compass className="h-4 w-4" />
            Discover Your Future Career
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[hsl(var(--text-dark))] mb-6 leading-tight">
            Explore Careers That
            <br />
            <span className="text-[hsl(var(--accent-cyan))]">Match Your Goals</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-lg sm:text-xl text-[hsl(var(--text-gray))] mb-8 leading-relaxed max-w-2xl mx-auto">
            Get instant insights into job roles, required skills, salary ranges, and growth trends across diverse career fields. Start your journey in under 10 seconds.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto">
            <Button 
              asChild 
              size="lg" 
              className="text-base group bg-[hsl(var(--accent-cyan))] hover:bg-[hsl(var(--accent-cyan))]/90 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <Link to="/fields" className="flex items-center gap-2">
                Start Exploring
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="text-base bg-white/80 backdrop-blur-sm border-[hsl(var(--text-dark))]/20 text-[hsl(var(--text-dark))] hover:bg-white/90 transition-all"
            >
              <Link to="/fields">Browse All Fields</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Custom cursor hint - only visible on hover */}
      <style>{`
        @media (hover: hover) {
          section:hover {
            cursor: crosshair;
          }
        }
      `}</style>
    </section>
  );
};

export default InteractiveHero;
