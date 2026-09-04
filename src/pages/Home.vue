<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { siteContent } from '@/content'

const c = siteContent.home
const modulos = c.modulos
const equipos = c.sobreNosotros.equipos
const hero = c.hero
const explora = c.explora
const sobre = c.sobreNosotros
</script>

<template>
  <section class="bg-neutral-50">
    <!-- Hero: 50% valor de la plataforma -->
    <div class="bg-gradient-to-r from-[#0F2D8C] to-blue-700 text-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <span class="inline-block px-3 py-1 bg-white/15 text-blue-100 text-xs font-semibold rounded-full uppercase tracking-wider mb-5">
          {{ hero.badge }}
        </span>
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight">
          {{ hero.titulo }}
        </h1>
        <p class="mt-5 text-lg text-blue-100 max-w-2xl leading-relaxed">
          {{ hero.descripcion }}
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <RouterLink :to="hero.ctaPrimario.to" class="px-5 py-2.5 bg-white text-[#0F2D8C] font-semibold rounded-xl hover:bg-blue-50 transition-colors">
            {{ hero.ctaPrimario.label }}
          </RouterLink>
          <RouterLink :to="hero.ctaSecundario.to" class="px-5 py-2.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors">
            {{ hero.ctaSecundario.label }}
          </RouterLink>
        </div>
        <div class="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div v-for="s in hero.stats" :key="s.label" class="bg-white/10 rounded-xl p-4">
            <p class="text-2xl font-bold">{{ s.valor }}</p>
            <p class="text-xs text-blue-100 mt-1">{{ s.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      <!-- Módulos -->
      <div>
        <h2 class="text-2xl font-bold text-neutral-900 mb-2">{{ explora.titulo }}</h2>
        <p class="text-neutral-500 mb-6">{{ explora.subtitulo }}</p>
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
              {{ explora.textoAbrir }} <span class="ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </RouterLink>
        </div>
      </div>

      <!-- Sobre Nosotros: 50% "nosotros" -->
      <div>
        <h2 class="text-2xl font-bold text-neutral-900 mb-2">{{ sobre.titulo }}</h2>
        <p class="text-neutral-500 mb-6">
          {{ sobre.subtitulo }}
        </p>

        <div class="bg-white border border-neutral-200 rounded-xl shadow-sm p-6 mb-6">
          <h3 class="text-sm font-bold uppercase tracking-wide text-blue-700 mb-3">{{ sobre.marcoTitulo }}</h3>
          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-neutral-700">
            <li><span class="font-semibold">Universidad:</span> {{ sobre.marco.universidad }}</li>
            <li><span class="font-semibold">Escuela:</span> {{ sobre.marco.escuela }}</li>
            <li><span class="font-semibold">Curso:</span> {{ sobre.marco.curso }}</li>
            <li><span class="font-semibold">Semestre:</span> {{ sobre.marco.semestre }}</li>
            <li><span class="font-semibold">Créditos:</span> {{ sobre.marco.creditos }}</li>
            <li><span class="font-semibold">Docente:</span> {{ sobre.marco.docente }}</li>
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
          <p><span class="font-semibold">{{ sobre.infoExtra.liderLabel }}</span> {{ sobre.infoExtra.liderValor }}</p>
          <p class="mt-1"><span class="font-semibold">{{ sobre.infoExtra.docenteLabel }}</span> {{ sobre.infoExtra.docenteValor }}</p>
          <p class="mt-1">
            {{ sobre.infoExtra.contribuidoresNota }} <code class="font-semibold">CONTRIBUTORS.md</code>.
            Repositorio del proyecto:
            <a
              :href="sobre.infoExtra.repoUrl"
              target="_blank"
              rel="noopener"
              class="underline font-semibold hover:text-blue-700"
            >{{ sobre.infoExtra.repoLabel }}</a>.
          </p>
        </div>
      </div>
    </div>

    <footer class="border-t border-neutral-200 py-8 text-center text-sm text-neutral-400">
      {{ c.footer }}
    </footer>
  </section>
</template>
