import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import SodaCan from './SodaCan'
import BubbleField from './BubbleField'

function Lights({ canColor }) {
  return (
    <>
      {/* Soft warm ambient — keeps shadows from going black */}
      <ambientLight intensity={0.55} color="#FFF7EE" />

      {/* Key light: bright white spot from upper-left — main specular highlight on can */}
      <spotLight
        position={[-3, 6, 5]}
        angle={0.38}
        penumbra={0.85}
        intensity={4.5}
        color="#ffffff"
        castShadow
      />

      {/* Rim light: color-matched from upper-right — wraps the can edge in flavor color */}
      <pointLight position={[4, 3, -3]} intensity={3.5} color={canColor} />

      {/* Fill: warm peach from below-left — lifts shadow side gently */}
      <pointLight position={[-3, -4, 4]} intensity={1.6} color="#FFCFA0" />

      {/* Bounce: subtle top backlight — separates can from bg */}
      <pointLight position={[0, 6, -4]} intensity={1.2} color="#ffffff" />
    </>
  )
}

export default function HeroScene({ canColor }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      shadows
      dpr={[1, 2]}
      gl={{ alpha: true }}
    >
      <Lights canColor={canColor} />
      <Suspense fallback={null}>
        <SodaCan color={canColor} />
        <BubbleField count={35} />
      </Suspense>
    </Canvas>
  )
}
