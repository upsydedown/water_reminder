import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { WaterBottle } from './WaterBottle';

export function WaterScene({ percentage }: { percentage: number }) {
  return (
    <div className="h-[400px] w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={['#f8fafc']} />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-20, -10, -10]} intensity={0.5} />
        <WaterBottle fillPercentage={percentage} />
        <OrbitControls 
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}