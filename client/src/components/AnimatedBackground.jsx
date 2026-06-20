import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';

function SoccerGlobe() {
  const meshRef = useRef(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      {/* Outer wireframe */}
      <mesh ref={meshRef} scale={2.5}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial 
          color="#10b981" 
          wireframe 
          emissive="#10b981"
          emissiveIntensity={0.8}
          transparent
          opacity={0.4}
        />
      </mesh>
      
      {/* Inner dark core to prevent seeing completely through */}
      <mesh scale={2.45}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#050810" />
      </mesh>
    </Float>
  );
}

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        
        {/* Floating particles/stars in background */}
        <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1.5} />
        
        <SoccerGlobe />
      </Canvas>
      
      {/* Dark overlay gradient to blend with the rest of the site */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-[#050810]/50 pointer-events-none" />
    </div>
  );
}
