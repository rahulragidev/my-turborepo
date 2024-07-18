"use client"

import { useEffect, useRef } from "react"

class Particle {
	x: number

	y: number

	size: number

	speedX: number

	speedY: number

	color: string

	constructor(x: number, y: number, hue: number) {
		this.x = x
		this.y = y
		this.size = Math.random() * 5 + 1
		this.speedX = Math.random() * 3 - 1.5
		this.speedY = Math.random() * 3 - 1.5
		this.color = `hsl(${hue}, 100%, 50%)`
	}

	update() {
		this.x += this.speedX
		this.y += this.speedY
		if (this.size > 0.2) this.size -= 0.01
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = this.color
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
		ctx.fill()
	}
}

const GaseousSplash = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const particles = useRef<Particle[]>([])
	const lastX = useRef(0)
	const lastY = useRef(0)
	const hue = useRef(0)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext("2d")
		if (!ctx) return

		canvas.width = window.innerWidth
		canvas.height = window.innerHeight

		const handleParticles = (e: MouseEvent) => {
			const x = e.clientX
			const y = e.clientY
			const distance = Math.sqrt(
				(x - lastX.current) ** 2 + (y - lastY.current) ** 2
			)
			const particleCount = Math.floor(distance / 5)
			console.log(
				"handleParticles",
				e.clientX,
				e.clientY,
				lastX.current,
				lastY.current
			)

			for (let i = 0; i < particleCount; i += 1) {
				particles.current.push(new Particle(x, y, hue.current))
			}

			lastX.current = x
			lastY.current = y
			hue.current += 5
		}

		const animate = () => {
			if (!ctx) return

			ctx.clearRect(0, 0, canvas.width, canvas.height)

			particles.current.forEach((particle, index) => {
				particle.update()
				particle.draw(ctx)

				if (particle.size <= 0.3) {
					particles.current.splice(index, 1)
				}
			})
			console.log("animate", particles.current.length)

			requestAnimationFrame(animate)
		}

		canvas.addEventListener("mousemove", handleParticles)
		animate()

		// eslint-disable-next-line consistent-return
		return () => {
			canvas.removeEventListener("mousemove", handleParticles)
		}
	}, [])

	return (
		<canvas
			ref={canvasRef}
			style={{
				height: "100vh",
				width: "100vw",
				position: "absolute",
				top: 0,
				left: 0,
				zIndex: -1,
			}}
		/>
	)
}

export default GaseousSplash
