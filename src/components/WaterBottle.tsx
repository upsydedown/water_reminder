import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export function WaterBottle({ fillPercentage }: { fillPercentage: number }) {
  const waterRef = useRef<THREE.Mesh>(null);
  const waveRef = useRef<THREE.ShaderMaterial>(null);
  
  const waveShader = {
    uniforms: {
      uTime: { value: 1 },
      uColor1: { value: new THREE.Color('#3b82f6') },
      uColor2: { value: new THREE.Color('#2563eb') },
      uWaveHeight: { value: 0.1 },
      uWaveFrequency: { value: 4.0 },
      uColorStart: { value: 0.2 },
      uColorEnd: { value: 0.8 },
    },
    vertexShader: `
      varying vec2 vUv;
      varying float vElevation;
      uniform float uTime;
      uniform float uWaveHeight;
      uniform float uWaveFrequency;
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        
        float elevation = sin(pos.x * uWaveFrequency + uTime) * uWaveHeight;
        elevation += sin((pos.z + pos.x) * uWaveFrequency * 0.8 + uTime * 1.4) * uWaveHeight;
        
        pos.y += elevation;
        vElevation = elevation;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying float vElevation;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform float uColorStart;
      uniform float uColorEnd;
      uniform float uWaveHeight;
      
      void main() {
        float mixStrength = (vElevation + uWaveHeight) / (10.0 * uWaveHeight);
        mixStrength = smoothstep(uColorStart, uColorEnd, mixStrength);
        
        vec3 color = mix(uColor1, uColor2, mixStrength);
        float alpha = 0.9;
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
  };

  useFrame((state) => {
    if (waveRef.current) {
      waveRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  const waterHeight = (fillPercentage / 100) * 2.8;

  const scaleMarks = Array.from({ length: 11 }, (_, i) => {
    const percentage = i * 10;
    const yPos = -1.4 + (percentage / 100) * 2.8;
    return (
      <group key={i} position={[0, yPos, 0]}>
        <Text
          position={[1.2, 0, 0]}
          fontSize={0.15}
          color="black"
          anchorX="left"
        >
          {`${percentage}%`}
        </Text>
        <mesh position={[1.05, 0, 0]}>
          <boxGeometry args={[0.1, 0.01, 0.01]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </group>
    );
  });

  return (
    <group rotation={[0, -Math.PI / 4, 0]}>
      {scaleMarks}
      
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 3, 32]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.1}
          roughness={0.1}
          transmission={0.95}
          thickness={0.1}
          ior={1.2}
          clearcoat={1}
        />
      </mesh>
      
      <mesh position={[0, -1.4 + waterHeight / 2, 0]}>
        <cylinderGeometry args={[0.95, 0.95, waterHeight, 32, 32]} />
        <shaderMaterial
          ref={waveRef}
          {...waveShader}
          transparent={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}