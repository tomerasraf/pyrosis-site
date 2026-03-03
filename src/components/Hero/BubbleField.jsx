import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function BubbleField({ count = 80 }) {
  const mesh = useRef()

  const { positions, speeds, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = []
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6
      speeds.push(0.003 + Math.random() * 0.006)
      sizes[i] = Math.random() * 18 + 6
    }
    return { positions, speeds, sizes }
  }, [count])

  useFrame(() => {
    if (!mesh.current) return
    const pos = mesh.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] += speeds[i]
      if (pos.array[i * 3 + 1] > 5.5) {
        pos.array[i * 3 + 1] = -5.5
      }
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#FF5C1A"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
