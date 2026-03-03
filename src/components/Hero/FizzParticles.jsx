import { useEffect, useRef } from 'react'

export default function FizzParticles({ color = '#FF5C1A' }) {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let W = canvas.offsetWidth
    let H = canvas.offsetHeight
    canvas.width  = W
    canvas.height = H

    const resize = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width  = W
      canvas.height = H
    }
    window.addEventListener('resize', resize)

    // Parse hex color to rgb for rgba usage
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)

    const COUNT = 55
    const particles = Array.from({ length: COUNT }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     1.2 + Math.random() * 3.2,
      vy:   -(0.35 + Math.random() * 0.9),
      vx:    (Math.random() - 0.5) * 0.25,
      alpha: 0.25 + Math.random() * 0.55,
      life:  Math.random(),        // 0–1 phase offset
    }))

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      for (const p of particles) {
        // Pulsing opacity
        const pulse = 0.6 + 0.4 * Math.sin(p.life * Math.PI * 2)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha * pulse})`
        ctx.fill()

        p.y  += p.vy
        p.x  += p.vx
        p.life += 0.012

        // Reset when out of bounds
        if (p.y < -10) {
          p.y = H + 5
          p.x = Math.random() * W
        }
        if (p.x < -10)  p.x = W + 5
        if (p.x > W + 10) p.x = -5
      }

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [color])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
}
