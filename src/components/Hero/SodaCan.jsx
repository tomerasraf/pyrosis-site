import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshWobbleMaterial } from '@react-three/drei'
import * as THREE from 'three'

function CanBody({ color = '#FF5C1A' }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    // Slow, graceful Y rotation
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
  })

  return (
    <group ref={meshRef}>
      {/* Main body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.72, 0.72, 2.3, 64]} />
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.08}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Slight waist taper top */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.62, 0.72, 0.22, 64]} />
        <meshStandardMaterial color={color} metalness={0.88} roughness={0.09} />
      </mesh>

      {/* Top silver cap */}
      <mesh position={[0, 1.24, 0]}>
        <cylinderGeometry args={[0.6, 0.62, 0.07, 64]} />
        <meshStandardMaterial color="#D0D0D0" metalness={0.97} roughness={0.04} />
      </mesh>

      {/* Top dome */}
      <mesh position={[0, 1.29, 0]}>
        <sphereGeometry args={[0.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.4]} />
        <meshStandardMaterial color="#C8C8C8" metalness={0.97} roughness={0.04} />
      </mesh>

      {/* Pull tab ring */}
      <mesh position={[0.18, 1.33, 0]} rotation={[0.2, 0, 0.4]}>
        <torusGeometry args={[0.11, 0.022, 8, 28, Math.PI * 1.6]} />
        <meshStandardMaterial color="#999" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Bottom taper */}
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[0.62, 0.72, 0.22, 64]} />
        <meshStandardMaterial color={color} metalness={0.88} roughness={0.09} />
      </mesh>

      {/* Bottom cap */}
      <mesh position={[0, -1.24, 0]}>
        <cylinderGeometry args={[0.6, 0.62, 0.07, 64]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.97} roughness={0.04} />
      </mesh>

      {/* Subtle white label stripe */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.725, 0.725, 1.5, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0}
          roughness={0.5}
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Specular highlight stripe */}
      <mesh position={[0.52, 0.3, 0.48]} rotation={[0, 0.4, 0]}>
        <planeGeometry args={[0.08, 1.4]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18} depthWrite={false} />
      </mesh>
    </group>
  )
}

function FloatingBubble({ position, size, speed, color, wobble }) {
  return (
    <Float speed={speed} rotationIntensity={0} floatIntensity={1.2} floatingRange={[-0.3, 0.3]}>
      <mesh position={position}>
        <sphereGeometry args={[size, 20, 20]} />
        <MeshWobbleMaterial
          color={color}
          factor={wobble}
          speed={1.5}
          metalness={0.1}
          roughness={0.15}
          transparent
          opacity={0.75}
        />
      </mesh>
    </Float>
  )
}

export default function SodaCan({ color }) {
  // Derive two complementary accent colors from the base flavor color
  const bubbles = useMemo(() => [
    { position: [-1.4,  0.8, -0.6], size: 0.22, speed: 1.2, wobble: 0.3 },
    { position: [ 1.5,  1.2,  0.3], size: 0.16, speed: 0.9, wobble: 0.4 },
    { position: [-1.1, -0.9,  0.5], size: 0.18, speed: 1.4, wobble: 0.25 },
    { position: [ 1.2, -0.5, -0.4], size: 0.12, speed: 1.7, wobble: 0.5 },
    { position: [ 0.0,  1.7,  0.8], size: 0.10, speed: 2.0, wobble: 0.35 },
  ], [])

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.6}>
      <group>
        <CanBody color={color} />
        {bubbles.map((b, i) => (
          <FloatingBubble key={i} {...b} color={color} />
        ))}
      </group>
    </Float>
  )
}
