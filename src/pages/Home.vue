<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { onMounted, ref } from 'vue'
import OrbitalCanvas from '@/components/effects/OrbitalCanvas.vue'

const modulos = [
  { id: 'tablas', nombre: 'Tablas de Verdad', desc: 'Genera tablas, clasifica tautologías y contradicciones.', icon:'⊞', color:'from-indigo-500 to-violet-600', sub:'Motor AST' },
  { id: 'inferencias', nombre: 'Inferencias', desc: 'Valida reglas con trazabilidad y diagnóstico.', icon:'∴', color:'from-fuchsia-500 to-pink-600', sub:'Solver' },
  { id: 'cuantificadores', nombre: 'Cuantificadores', desc: 'Evalúa ∀ y ∃, De Morgan y predicados.', icon:'∀∃', color:'from-cyan-500 to-blue-600', sub:'Nuevo AST' },
  { id: 'conjuntos', nombre: 'Conjuntos', desc: 'Operaciones y diagramas de Venn interactivos.', icon:'∩∪', color:'from-emerald-500 to-teal-600', sub:'Venn' },
  { id: 'aprender', nombre: 'Aprender', desc: 'Recorrido guiado con verificación en vivo.', icon:'◐', color:'from-amber-500 to-orange-600', sub:'Guided' },
  { id: 'progreso', nombre: 'Progreso', desc: 'Sigue tu avance y temas recomendados.', icon:'◈', color:'from-slate-600 to-zinc-800', sub:'Stats' },
]

const equipos = [
  { nombre: 'Sinergia', sub: 'Alexa', miembros: 'Aldair, Smith, Miguel Velarde, Jesús Núñez', tema: 'Tablas de Verdad' },
  { nombre: 'Los Hijos de Linus', sub: 'Arom', miembros: 'Centurión, Morocho, Altamirano, Mio, Mauricio', tema: 'Inferencias' },
  { nombre: 'Modus Innova', sub: 'Cristian', miembros: 'Danuska, Marlon, Guillermo, Noemí, Julio', tema: 'Cuantificadores' },
  { nombre: 'Linus', sub: 'Jordy', miembros: 'Nio, Mike, Sergio, Fer, Alejandro', tema: 'Conjuntos' },
]

const heroRef = ref<HTMLElement|null>(null)
const statsRef = ref<HTMLElement|null>(null)
const cardsVisible = ref(false)

onMounted(()=>{
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting) cardsVisible.value = true })
  }, { threshold:0.15 })
  if(statsRef.value) io.observe(statsRef.value)
})
</script>

 <template>
  <div class="overflow-clip">
  <section class="bg-[#020617] text-white overflow-clip">
   <!-- HERO ORBITAL -->
  <div ref="heroRef" class="relative isolate overflow-hidden bg-[#020617]">
    <!-- gradient mesh -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-gradient-to-br from-[#0F2D8C] via-[#1e1b9e] to-[#020617]" />
      <div class="absolute inset-0 opacity-[0.55]" style="background: radial-gradient(700px 500px at var(--aura-x) var(--aura-y), rgba(99,102,241,0.45), transparent 60%), radial-gradient(600px 400px at 85% 15%, rgba(236,72,153,0.28), transparent 60%), radial-gradient(800px 600px at 15% 85%, rgba(14,165,233,0.22), transparent 60%); animation: aura-move 18s ease-in-out infinite;" />
      <div class="absolute inset-0 orbital-grid opacity-[0.08]" />
      <!-- blurred orbs -->
      <div class="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full blur-[90px] opacity-30" style="background: radial-gradient(circle, #6366f1 0%, transparent 70%)" />
      <div class="absolute top-1/2 -right-32 w-[480px] h-[480px] rounded-full blur-[80px] opacity-20" style="background: radial-gradient(circle, #ec4899 0%, transparent 70%)" />
    </div>

    <OrbitalCanvas />

    <!-- orbital rings -->
    <div class="pointer-events-none absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 -z-0 hidden lg:block">
      <div class="relative w-[760px] h-[760px]">
        <div class="absolute inset-0 rounded-full border border-white/[0.07]" style="transform: rotate(var(--orbit-rotation)); animation: orbit-slow 90s linear infinite" />
        <div class="absolute inset-[42px] rounded-full border border-dashed border-white/[0.09]" style="transform: rotate(var(--orbit-rotation)); animation: orbit-reverse 70s linear infinite" />
        <div class="absolute inset-[92px] rounded-full border border-white/[0.06]" />
        <!-- orbiting dots -->
        <div class="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.9)]" style="transform-origin: 0 380px; transform: rotate(var(--orbit-rotation)) translateX(-50%); animation: orbit-slow 28s linear infinite" />
        <div class="absolute left-1/2 top-0 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]" style="transform-origin: 0 340px; animation: orbit-reverse 36s linear infinite" />
      </div>
    </div>

    <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <div class="flex items-center gap-2 mb-6">
        <span class="inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/10 glass border border-white/15 text-xs font-semibold tracking-wider uppercase">
          <span class="w-6 h-6 rounded-full bg-white text-[#0F2D8C] grid place-items-center text-[10px]">◈</span>
          <span class="text-white/90">LogiLearn · Orbital Cuántico</span>
          <span class="ml-1 px-1.5 py-0.5 rounded-full bg-emerald-400 text-emerald-950 text-[10px] font-extrabold tracking-wide">LIVE</span>
        </span>
        <span class="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-white/60">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> experiment/visual-impact
        </span>
      </div>

      <div class="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
        <div>
          <h1 class="text-[40px] sm:text-[56px] font-black tracking-[-0.03em] leading-[0.95]">
            <span class="block text-white">Lógica Simbólica</span>
            <span class="block bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent" style="background-size:200% auto; animation: shimmer 3.2s linear infinite">en órbita</span>
          </h1>
          <p class="mt-5 text-[17px] leading-7 text-white/75 max-w-[52ch]">
            Plataforma colaborativa open-source. Motores reales, trazabilidad y animación cuántica.
            <span class="text-white font-medium">∀ ∃ ∴ —</span> domina proposiciones, predicados y conjuntos con feedback fluido a 60fps.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <RouterLink to="/aprender" class="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#0F2D8C] font-bold shadow-[0_8px_30px_rgba(255,255,255,0.2)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.28)] transition-all">
              Empezar a aprender
              <span class="w-7 h-7 rounded-lg bg-[#0F2D8C] text-white grid place-items-center text-sm group-hover:translate-x-0.5 transition-transform">→</span>
            </RouterLink>
            <RouterLink to="/tablas" class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 glass border border-white/15 text-white font-semibold hover:bg-white/15 hover:border-white/20 transition-colors">
              <span class="w-8 h-8 rounded-lg bg-white/15 grid place-items-center">⊞</span> Probar tablas
            </RouterLink>
            <RouterLink to="/cuantificadores" class="hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-transparent border border-white/10 text-white/80 hover:text-white hover:border-white/20 transition-colors text-sm">Ver cuantificadores ∀∃</RouterLink>
          </div>

          <div class="mt-6 flex flex-wrap gap-2 text-[11px] font-mono text-white/55">
            <span class="px-2.5 py-1 rounded-full bg-white/10 border border-white/10">p ∧ q → r</span>
            <span class="px-2.5 py-1 rounded-full bg-white/10 border border-white/10">¬(∀x P(x)) ≡ ∃x ¬P(x)</span>
            <span class="px-2.5 py-1 rounded-full bg-white/10 border border-white/10">A ↔ (B ∨ C)</span>
          </div>
        </div>

        <!-- mock terminal orbital card -->
        <div class="relative lg:pl-6">
          <div class="relative rounded-[20px] bg-white/[0.08] glass border border-white/15 overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <div class="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-full bg-red-400/90" /><span class="w-3 h-3 rounded-full bg-yellow-400/90" /><span class="w-3 h-3 rounded-full bg-green-400/90" />
              </div>
              <span class="text-[11px] font-mono text-white/60">engine.ts · cuantificadores</span>
              <span class="text-[10px] px-2 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/20">● live eval</span>
            </div>
            <div class="p-5 font-mono text-[12.5px] leading-6">
              <div class="text-white/50">// ∀x (x > 2 → x² > 4) en D = {1,2,3,4}</div>
              <div class="mt-2 flex flex-wrap gap-1.5">
                <span class="px-2 py-1 rounded-lg bg-white text-[#0F2D8C] font-bold">∀x</span>
                <span class="px-2 py-1 rounded-lg bg-indigo-500 text-white">x ∈ {1,2,3,4}</span>
                <span class="px-2 py-1 rounded-lg bg-white/10 border border-white/15 text-white">x &gt; 2 → x² &gt; 4</span>
              </div>
              <div class="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                <div class="rounded-xl bg-white/10 border border-white/10 p-2.5"><div class="text-white/50">x=1</div><div class="font-bold text-white">V <span class="text-emerald-300">✓</span></div></div>
                <div class="rounded-xl bg-white/10 border border-white/10 p-2.5"><div class="text-white/50">x=2</div><div class="font-bold text-white">V <span class="text-emerald-300">✓</span></div></div>
                <div class="rounded-xl bg-emerald-500 text-white p-2.5 shadow-lg"><div class="text-white/80">x=3</div><div class="font-bold">V ✓</div></div>
                <div class="rounded-xl bg-emerald-500 text-white p-2.5 shadow-lg"><div class="text-white/80">x=4</div><div class="font-bold">V ✓</div></div>
              </div>
              <div class="mt-4 flex items-center gap-2 text-xs">
                <span class="px-2.5 py-1 rounded-full bg-emerald-400 text-emerald-950 font-bold">VERDADERO</span>
                <span class="text-white/60">∀x P(x) ≡ <span class="text-white">¬∃x ¬P(x)</span></span>
              </div>
            </div>
            <div class="h-1 w-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400" />
          </div>
          <!-- floating chips -->
          <div class="absolute -right-2 -top-3 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-[#0F2D8C] text-xs font-bold shadow-xl" style="animation: float-y 3.4s ease-in-out infinite">⚡ 60fps AST</div>
          <div class="absolute -left-3 bottom-6 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F2D8C] text-white text-xs font-semibold border border-white/15 shadow-xl" style="animation: float-y2 3.8s ease-in-out infinite">↔ De Morgan vivo</div>
        </div>
      </div>

      <!-- stats glass -->
      <div ref="statsRef" class="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div v-for="(s,i) in [{k:'4',l:'Módulos'}, {k:'12',l:'Leyes'},{k:'30+',l:'Ejercicios'},{k:'100%',l:'Sílabo'}]" :key="s.l" class="rounded-2xl bg-white/[0.08] glass border border-white/10 p-4 text-center hover:bg-white/[0.12] hover:border-white/15 transition-colors" :style="`animation: card-enter 0.6s cubic-bezier(0.16,1,0.3,1) both; animation-delay: ${i*90}ms`">
          <div class="text-2xl font-black tracking-tight">{{ s.k }}</div>
          <div class="text-[11px] tracking-wide uppercase font-semibold text-white/60 mt-1">{{ s.l }}</div>
        </div>
      </div>
    </div>
  </div>

  </section>
  <!-- módulos orbital — superficie clara coherente con resto de la app -->
  <section class="bg-[#f8fafc] py-14">
   <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-end justify-between gap-4 mb-6">
      <div>
        <h2 class="text-[22px] font-extrabold tracking-tight text-[#0F2D8C]">Explora la plataforma</h2>
        <p class="text-sm text-neutral-500">Cada módulo es un motor real. Hover para órbita.</p>
      </div>
      <div class="hidden sm:flex items-center gap-2 text-xs text-neutral-500"><span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Motores en vivo</div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 [perspective:1200px]">
      <RouterLink
        v-for="(m,i) in modulos"
        :key="m.id"
        :to="`/${m.id}`"
        class="group relative block rounded-[18px] bg-white border border-neutral-200 p-[1px] hover:border-[#0F2D8C]/20 transition-all duration-300 hover:shadow-[0_16px_40px_rgba(15,45,140,0.15)] hover:-translate-y-1"
        :style="cardsVisible ? `animation: card-enter 0.6s cubic-bezier(0.16,1,0.3,1) both; animation-delay: ${i*70}ms` : 'opacity:0'"
      >
        <div class="rounded-[17px] bg-white p-6 h-full relative overflow-hidden flex flex-col">
          <div :class="['absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br', m.color]" style="opacity:0.06" />
          <div class="relative flex-1">
            <div class="flex items-start justify-between">
              <div :class="['w-11 h-11 rounded-xl grid place-items-center text-white font-black shadow-lg bg-gradient-to-br', m.color]">{{ m.icon }}</div>
              <span class="text-[10px] font-bold tracking-wide uppercase px-2 py-1 rounded-full bg-neutral-900 text-white">{{ m.sub }}</span>
            </div>
            <h3 class="mt-4 text-[16px] font-extrabold tracking-tight text-neutral-900 group-hover:text-[#0F2D8C] transition-colors">{{ m.nombre }}</h3>
            <p class="text-[13px] leading-5 text-neutral-500 mt-1.5">{{ m.desc }}</p>
          </div>
          <div class="relative mt-5">
            <span class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#0F2D8C] text-white text-xs font-bold shadow-[0_6px_16px_rgba(15,45,140,0.22)] group-hover:bg-[#0e2670] group-hover:shadow-[0_10px_24px_rgba(15,45,140,0.28)] group-hover:translate-y-[-1px] transition-all">Explorar <span class="group-hover:translate-x-0.5 transition-transform">→</span></span>
          </div>
          <!-- orbit line on hover -->
          <div class="pointer-events-none absolute -right-6 -bottom-6 w-28 h-28 rounded-full border border-[#0F2D8C]/10 group-hover:border-[#0F2D8C]/20 transition-colors" />
        </div>
      </RouterLink>
    </div>

    <!-- Sobre Nosotros glass -->
    <div class="mt-16 space-y-6">
      <div>
        <h2 class="text-[22px] font-extrabold tracking-tight text-[#0F2D8C]">Sobre Nosotros</h2>
        <p class="text-sm text-neutral-500">Proyecto construido colaborativamente por el aula, para el aula.</p>
      </div>
      <div class="rounded-[18px] bg-gradient-to-br from-[#0F2D8C] to-indigo-700 p-[1px]">
        <div class="rounded-[17px] bg-white p-6">
          <h3 class="text-xs font-black tracking-[0.14em] uppercase text-[#0F2D8C] mb-3">Marco académico</h3>
          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-neutral-700">
            <li><span class="font-semibold">Universidad:</span> Nacional Pedro Ruiz Gallo</li>
            <li><span class="font-semibold">Escuela:</span> Ingeniería de Sistemas</li>
            <li><span class="font-semibold">Curso:</span> Lógica Simbólica (MATG1001)</li>
            <li><span class="font-semibold">Semestre:</span> 2026 I · II Ciclo</li>
            <li><span class="font-semibold">Créditos:</span> 3</li>
            <li><span class="font-semibold">Docente:</span> Dr. Mardo Victor Gonzales Herrera</li>
          </ul>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="eq in equipos" :key="eq.nombre" class="group rounded-[16px] bg-white border border-neutral-200 p-5 hover:border-[#0F2D8C]/20 hover:shadow-[0_10px_30px_rgba(15,45,140,0.08)] hover:-translate-y-0.5 transition-all">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-extrabold text-neutral-900">{{ eq.nombre }}</h3>
            <span class="text-[10px] font-black bg-[#0F2D8C] text-white rounded-full px-2 py-1">{{ eq.sub }}</span>
          </div>
          <p class="text-xs text-neutral-500">Tema: {{ eq.tema }}</p>
          <p class="text-[13px] text-neutral-700 mt-2 leading-5">{{ eq.miembros }}</p>
        </div>
      </div>
      <div class="rounded-2xl bg-white border border-neutral-200 p-5 text-sm text-neutral-700 flex flex-wrap gap-3 items-center justify-between">
        <div><span class="font-bold">Líder:</span> Enrique (EnriDiazCayaca) · <span class="font-semibold">Docente:</span> Dr. Mardo Victor Gonzales Herrera — <span class="font-mono text-xs">mgonzalesh@unprg.edu.pe</span></div>
        <a href="https://github.com/EnriDiazCayaca/logica_simbolica_global" target="_blank" rel="noopener" class="px-3 py-1.5 rounded-full bg-[#0F2D8C] text-white text-xs font-bold hover:bg-[#0e2670] transition-colors">GitHub →</a>
      </div>
    </div>
  </div>
  </section>
  <footer class="border-t border-neutral-200 py-8 text-center text-sm text-neutral-400 bg-white">LogiLearn · <span class="font-mono text-xs">experiment/visual-impact</span> · Orbital Cuántico · 2026</footer>
 </div>
</template>
