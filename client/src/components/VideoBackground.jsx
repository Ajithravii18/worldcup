import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, Line } from '@react-three/drei';

function SoccerBall() {
  const ref = useRef();
  
  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Smooth, slow rotation
    ref.current.rotation.x -= delta / 5;
    ref.current.rotation.y -= delta / 6;

    // Subtle parallax based on mouse
    const targetX = (state.mouse.x * Math.PI) / 8;
    const targetY = (state.mouse.y * Math.PI) / 8;

    ref.current.rotation.y += 0.02 * (targetX - ref.current.rotation.y);
    ref.current.rotation.x += 0.02 * (targetY - ref.current.rotation.x);
  });

  return (
    <group ref={ref} position={[3, 0, 0]} scale={3}>
      <Icosahedron args={[1, 2]}>
        <meshBasicMaterial color="#4ade80" wireframe wireframeLinewidth={2} transparent opacity={0.3} />
      </Icosahedron>
      
      {/* Inner glowing core */}
      <Icosahedron args={[0.98, 1]}>
        <meshBasicMaterial color="#22c55e" transparent opacity={0.05} />
      </Icosahedron>
    </group>
  );
}

export default function VideoBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#030712] overflow-hidden pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <color attach="background" args={['#030712']} />
        <SoccerBall />
        
        {/* Accent lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#4ade80" />
      </Canvas>

      {/* Deep Frosted Glass Overlay for dark aesthetic */}
      <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[2px] pointer-events-none" />
      
      {/* Heavy Vignette for dramatic sports feel */}
      <div className="absolute inset-0 z-30 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none"></div>
    </div>
  );
}
