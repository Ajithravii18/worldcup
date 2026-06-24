import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

function ParticleCloud() {
  const ref = useRef();
  
  // Generate random points in a sphere
  const sphere = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Random radius between 2 and 15
      const radius = 2 + Math.random() * 13;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Slow continuous rotation
    ref.current.rotation.x -= delta / 15;
    ref.current.rotation.y -= delta / 20;

    // Mouse parallax effect
    const targetX = (state.mouse.x * Math.PI) / 10;
    const targetY = (state.mouse.y * Math.PI) / 10;

    ref.current.rotation.y += 0.05 * (targetX - ref.current.rotation.y);
    ref.current.rotation.x += 0.05 * (targetY - ref.current.rotation.x);
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#4ade80" // Neon green
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

export default function VideoBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#030712] overflow-hidden pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <color attach="background" args={['#030712']} />
        <ParticleCloud />
      </Canvas>

      {/* Deep Frosted Glass Overlay for dark aesthetic */}
      <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[2px] pointer-events-none" />
      
      {/* Heavy Vignette for dramatic sports feel */}
      <div className="absolute inset-0 z-30 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none"></div>
    </div>
  );
}
