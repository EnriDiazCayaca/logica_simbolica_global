<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let raf = 0
let particles: Array<{x:number,y:number,vx:number,vy:number,s:number,op:number,sym:string,rot:number,vr:number}> = []
const SYMS = ['∀','∃','∧','∨','¬','→','↔','∴','∈','∉','⊂','≡','⊕','⊥','⊤']

function resize(canvas: HTMLCanvasElement){
  const dpr = Math.min(window.devicePixelRatio, 2)
  canvas.width = canvas.clientWidth * dpr
  canvas.height = canvas.clientHeight * dpr
  const ctx = canvas.getContext('2d')!
  ctx.setTransform(dpr,0,0,dpr,0,0)
}

function init(canvas: HTMLCanvasElement){
  particles = []
  const count = Math.min(42, Math.floor(canvas.clientWidth/28))
  for(let i=0;i<count;i++){
    particles.push({
      x: Math.random()*canvas.clientWidth,
      y: Math.random()*canvas.clientHeight,
      vx: (Math.random()-0.5)*0.35,
      vy: (Math.random()-0.5)*0.35,
      s: 12 + Math.random()*18,
      op: 0.12 + Math.random()*0.22,
      sym: SYMS[Math.floor(Math.random()*SYMS.length)],
      rot: Math.random()*Math.PI*2,
      vr: (Math.random()-0.5)*0.008,
    })
  }
}

function draw(canvas: HTMLCanvasElement, t:number){
  const ctx = canvas.getContext('2d')!
  const w = canvas.clientWidth, h = canvas.clientHeight
  ctx.clearRect(0,0,w,h)

  // subtle vignette
  const grad = ctx.createRadialGradient(w*0.5, h*0.45, 0, w*0.5, h*0.45, Math.max(w,h)*0.9)
  grad.addColorStop(0,'rgba(99,102,241,0.04)')
  grad.addColorStop(1,'rgba(0,0,0,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0,0,w,h)

  // lines between close particles (constellation)
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const d = Math.hypot(dx,dy)
      if(d < 140){
        ctx.strokeStyle = `rgba(148,163,254,${0.18*(1-d/140)})`
        ctx.lineWidth = 0.7
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.stroke()
      }
    }
  }

  // symbols
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  particles.forEach(p=>{
    p.x += p.vx + Math.sin(t*0.0003 + p.rot)*0.15
    p.y += p.vy + Math.cos(t*0.0004 + p.rot)*0.15
    p.rot += p.vr
    // wrap
    if(p.x< -20) p.x = w+20
    if(p.x> w+20) p.x = -20
    if(p.y< -20) p.y = h+20
    if(p.y> h+20) p.y = -20

    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rot)
    ctx.globalAlpha = p.op * (0.85 + 0.15*Math.sin(t*0.001 + p.x))
    // glow
    ctx.shadowColor = 'rgba(99,102,241,0.9)'
    ctx.shadowBlur = 10
    ctx.font = `${p.s}px ui-monospace, SFMono-Regular, Menlo, monospace`
    ctx.fillStyle = '#c7d2fe'
    ctx.fillText(p.sym, 0, 0)
    ctx.restore()
  })
}

onMounted(()=>{
  const canvas = canvasRef.value
  if(!canvas) return
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    init(canvas); resize(canvas)
    draw(canvas,0)
    return
  }
  resize(canvas)
  init(canvas)
  const onResize = ()=> resize(canvas)
  window.addEventListener('resize', onResize)

  let start = performance.now()
  const loop = (now:number)=>{
    draw(canvas, now - start)
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)

  const ro = new ResizeObserver(()=> resize(canvas))
  ro.observe(canvas)

  onUnmounted(()=>{
    window.removeEventListener('resize', onResize)
    ro.disconnect()
    cancelAnimationFrame(raf)
  })
})

onUnmounted(()=> cancelAnimationFrame(raf))
</script>

<template>
  <canvas ref="canvasRef" class="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />
</template>
