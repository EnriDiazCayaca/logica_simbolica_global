<script setup lang="ts">
import { RouterLink } from 'vue-router'

const modulos = [
  { id: 'tablas', nombre: 'Tablas de Verdad', desc: 'Genera tablas de verdad, clasifica tautologías, contradicciones y contingencias.' },
  { id: 'inferencias', nombre: 'Inferencias', desc: 'Valida reglas de inferencia con trazabilidad y diagnóstico paso a paso.' },
  { id: 'cuantificadores', nombre: 'Cuantificadores', desc: 'Evalúa ∀ y ∃, aplica De Morgan y resuelve fórmulas de predicados.' },
  { id: 'conjuntos', nombre: 'Conjuntos', desc: 'Operaciones de teoría de conjuntos y diagramas de Venn interactivos.' },
  { id: 'aprender', nombre: 'Aprender', desc: 'Recorrido guiado por conceptos con verificación en vivo.' },
  { id: 'progreso', nombre: 'Progreso', desc: 'Sigue tu avance, precisión y temas recomendados.' },
]

const equipos = [
  { nombre: 'Sinergia', sub: 'Alexa', miembros: 'Aldair, Smith, Miguel Velarde, Jesús Núñez', tema: 'Tablas de Verdad' },
  { nombre: 'Los Hijos de Linus', sub: 'Arom', miembros: 'Centurión, Morocho, Altamirano, Mio, Mauricio', tema: 'Inferencias' },
  { nombre: 'Modus Innova', sub: 'Cristian', miembros: 'Danuska, Marlon, Guillermo, Noemí, Julio', tema: 'Cuantificadores' },
  { nombre: 'Linus', sub: 'Jordy', miembros: 'Nio, Mike, Sergio, Fer, Alejandro', tema: 'Conjuntos' },
]
</script>

<template>
  <section class="bg-neutral-50">
    <!-- Hero: 50% valor de la plataforma -->
    <div class="bg-gradient-to-r from-[#0F2D8C] to-blue-700 text-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <span class="inline-block px-3 py-1 bg-white/15 text-blue-100 text-xs font-semibold rounded-full uppercase tracking-wider mb-5">
          LogiLearn · Lógica Simbólica Global
        </span>
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Aprende Lógica Simbólica de forma visual e interactiva
        </h1>
        <p class="mt-5 text-lg text-blue-100 max-w-2xl leading-relaxed">
          Una plataforma colaborativa, gratuita y de código abierto donde cualquier persona
          construye, practica y domina la lógica proposicional, los cuantificadores y la teoría
          de conjuntos con motores reales, ejercicios y seguimiento de progreso.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <RouterLink to="/aprender" class="px-5 py-2.5 bg-white text-[#0F2D8C] font-semibold rounded-xl hover:bg-blue-50 transition-colors">
            Empezar a aprender
          </RouterLink>
          <RouterLink to="/tablas" class="px-5 py-2.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors">
            Probar tablas de verdad
          </RouterLink>
        </div>
        <div class="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div class="bg-white/10 rounded-xl p-4">
            <p class="text-2xl font-bold">4</p>
            <p class="text-xs text-blue-100 mt-1">Módulos interactivos</p>
          </div>
          <div class="bg-white/10 rounded-xl p-4">
            <p class="text-2xl font-bold">12</p>
            <p class="text-xs text-blue-100 mt-1">Leyes lógicas</p>
          </div>
          <div class="bg-white/10 rounded-xl p-4">
            <p class="text-2xl font-bold">30+</p>
            <p class="text-xs text-blue-100 mt-1">Ejercicios</p>
          </div>
          <div class="bg-white/10 rounded-xl p-4">
            <p class="text-2xl font-bold">100%</p>
            <p class="text-xs text-blue-100 mt-1">Sílabo cubierto</p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      <!-- Módulos -->
      <div>
        <h2 class="text-2xl font-bold text-neutral-900 mb-2">Explora la plataforma</h2>
        <p class="text-neutral-500 mb-6">Cada módulo es un motor real que evalúa tus fórmulas.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <RouterLink
            v-for="m in modulos"
            :key="m.id"
            :to="`/${m.id}`"
            class="group block h-full p-6 bg-white border border-neutral-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all"
          >
            <h3 class="text-lg font-bold text-neutral-800 group-hover:text-blue-700">{{ m.nombre }}</h3>
            <p class="text-neutral-500 text-sm mt-2 leading-relaxed">{{ m.desc }}</p>
            <span class="mt-4 inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-800">
              Abrir <span class="ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </RouterLink>
        </div>
      </div>

      <!-- Sobre Nosotros: 50% "nosotros" -->
      <div>
        <h2 class="text-2xl font-bold text-neutral-900 mb-2">Sobre Nosotros</h2>
        <p class="text-neutral-500 mb-6">
          Proyecto construido colaborativamente por el aula, para el aula.
        </p>

        <div class="bg-white border border-neutral-200 rounded-xl shadow-sm p-6 mb-6">
          <h3 class="text-sm font-bold uppercase tracking-wide text-blue-700 mb-3">Marco académico</h3>
          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-neutral-700">
            <li><span class="font-semibold">Universidad:</span> Nacional Pedro Ruiz Gallo</li>
            <li><span class="font-semibold">Escuela:</span> Ingeniería de Sistemas</li>
            <li><span class="font-semibold">Curso:</span> Lógica Simbólica (MATG1001)</li>
            <li><span class="font-semibold">Semestre:</span> 2026 I · II Ciclo</li>
            <li><span class="font-semibold">Créditos:</span> 3</li>
            <li><span class="font-semibold">Docente:</span> Dr. Mardo Victor Gonzales Herrera</li>
          </ul>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div v-for="eq in equipos" :key="eq.nombre" class="bg-white border border-neutral-200 rounded-xl shadow-sm p-5">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-bold text-neutral-800">{{ eq.nombre }}</h3>
              <span class="text-[10px] font-semibold bg-blue-100 text-blue-700 rounded px-2 py-0.5">Sublíder: {{ eq.sub }}</span>
            </div>
            <p class="text-xs text-neutral-500 mb-3">Tema: {{ eq.tema }}</p>
            <p class="text-sm text-neutral-700">{{ eq.miembros }}</p>
          </div>
        </div>

        <div class="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-900">
          <p><span class="font-semibold">Líder de proyecto:</span> Enrique (EnriDiazCayaca)</p>
          <p class="mt-1"><span class="font-semibold">Docente:</span> Dr. Mardo Victor Gonzales Herrera — mgonzalesh@unprg.edu.pe</p>
          <p class="mt-1">La lista completa de contribuidores está en <code class="font-semibold">CONTRIBUTORS.md</code>.</p>
        </div>
      </div>
    </div>

    <footer class="border-t border-neutral-200 py-8 text-center text-sm text-neutral-400">
      LogiLearn · Proyecto de Aula 2026 · Universidad Nacional Pedro Ruiz Gallo
    </footer>
  </section>
</template>
