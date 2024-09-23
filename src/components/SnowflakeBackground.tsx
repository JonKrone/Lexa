import { Snowflake } from 'lucide-react'
import { FC, useEffect, useRef, useState } from 'react'

export interface SnowflakeBackgroundProps {
  opacity?: number
  speed?: number
  density?: number
}

interface Snowflake {
  x: number
  y: number
  radius: number
  verticalSpeed: number
  horizontalSpeed: number
}

export const SnowflakeBackground: FC<SnowflakeBackgroundProps> = ({
  opacity = 1,
  speed = 1,
  density = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameIdRef = useRef<number | null>(null)
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  const snowflakesRef = useRef<Snowflake[]>([])
  const prevDimensionsRef = useRef<{ width: number; height: number }>({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const updateDimensions = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
      const prevWidth = prevDimensionsRef.current.width
      const prevHeight = prevDimensionsRef.current.height
      const scaleX = newWidth / prevWidth
      const scaleY = newHeight / prevHeight

      snowflakesRef.current.forEach((flake) => {
        flake.x *= scaleX
        flake.y *= scaleY
        flake.x = Math.max(0, Math.min(flake.x, newWidth))
        flake.y = Math.max(0, Math.min(flake.y, newHeight))
      })

      setDimensions({ width: newWidth, height: newHeight })
      prevDimensionsRef.current = { width: newWidth, height: newHeight }
    }

    window.addEventListener('resize', updateDimensions)

    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    if (snowflakesRef.current.length === 0) {
      const maxSnowflakes = Math.floor(100 * density)
      snowflakesRef.current = Array.from({ length: maxSnowflakes }, () =>
        createSnowflake(dimensions.width, dimensions.height, speed),
      )
    }

    function createSnowflake(
      width: number,
      height: number,
      speed: number,
    ): Snowflake {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 4 + 1,
        verticalSpeed: (Math.random() * 3 + 1) * speed,
        horizontalSpeed: (Math.random() * 2 - 1) * speed,
      }
    }

    function moveSnowflakes() {
      if (!canvas) return

      snowflakesRef.current.forEach((flake) => {
        flake.y += flake.verticalSpeed
        flake.x += flake.horizontalSpeed

        if (flake.y > canvas.height) {
          flake.y = 0
          flake.x = Math.random() * canvas.width
        }

        if (flake.x < 0) {
          flake.x = canvas.width
        } else if (flake.x > canvas.width) {
          flake.x = 0
        }
      })
    }

    function drawSnowflakes() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
      ctx.beginPath()
      snowflakesRef.current.forEach((flake) => {
        ctx.moveTo(flake.x, flake.y)
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2, true)
      })
      ctx.fill()
      moveSnowflakes()
      animationFrameIdRef.current = requestAnimationFrame(drawSnowflakes)
    }

    drawSnowflakes()

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
    }
  }, [dimensions.width, dimensions.height, opacity, speed, density])

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
    </div>
  )
}

export default SnowflakeBackground
