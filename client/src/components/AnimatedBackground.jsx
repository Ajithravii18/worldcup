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
          color="#4ade80" 
          wireframe 
          emissive="#4ade80"
          emissiveIntensity={0.8}
          transparent
          opacity={0.4}
        />
      </mesh>
      
      {/* Inner dark core to prevent seeing completely through */}
      <mesh scale={2.45}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#ffffff" />
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
        
        
        <SoccerGlobe />
      </Canvas>
      
      {/* Light overlay gradient to blend with the rest of the site */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#f9fbfc] via-transparent to-[#f9fbfc]/50 pointer-events-none" />
    </div>
  );
}
