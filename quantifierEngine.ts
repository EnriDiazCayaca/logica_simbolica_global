# 🚀 ENTREGABLE 02: CÓDIGO FUENTE UNIFICADO DE LA APLICACIÓN WEB
## PLATAFORMA WEB: "LÓGICA SIMBÓLICA GLOBAL" — PROYECTO 2026

**Equipo:** Equipo 3 — *Modus Innova (QuantifiTech)*  
**Número de Grupo:** Grupo 3 (Módulo de Cuantificadores e Inferencias)  
**Tema Asignado:** Cuantificadores Lógicos, Lógica de Predicados y Silogismos  
**Módulo Oficial:** QuantifiWeb  
**Stack Oficial:** Vue 3 (SFC `.vue`) + Vite + Tailwind CSS v4 + TypeScript  
**Estado:** Entregable 2 Unificado Completo (Consolidación de Código Fuente de los 6 Integrantes)  

---

## 👥 1. Integrantes del Equipo y Atribución de Código (6 Integrantes)

| # | Integrante | Rol en el Entregable 2 | Aporte al Código Fuente |
|---|---|---|---|
| **1** | **Cristian** | **Sublíder de Grupo 3** | Coordinación general, integración de arquitectura Vue 3, gestión de Git/Pull Requests y consolidación. |
| **2** | **Danuska** | Especialista en UI/UX & Reactividad | Estructura visual, tema oscuro (*Dark Glassmorphism*) y diseño responsivo de la interfaz. |
| **3** | **Marlon** | Desarrollador de Algoritmos RPN | Notación RPN, algoritmos de resolución y búsqueda de contra-modelos analíticos. |
| **4** | **Guillermo** | Control de Calidad y Pruebas | Casos de prueba didácticos y ejemplos para cuantificadores y silogismos. |
| **5** | **Noemí** | Diseñadora de Recursos & Estilos | Paleta de colores oficial, tarjetas didácticas y estilos CSS. |
| **6** | **Julio** | Especialista en Motores TypeScript | Interfaces TypeScript, trazabilidad por elemento y Leyes de De Morgan. |

---

## 💻 2. Código Fuente del Motor 1: Cuantificadores Lógicos (`quantifierEngine.ts`)

```typescript
/**
 * PROYECTO: LÓGICA SIMBÓLICA GLOBAL - ENTREGABLE 2
 * MÓDULO DE CUANTIFICADORES LÓGICOS (LÓGICA DE PREDICADOS)
 * Equipo 3: Cristian (Sublíder), Danuska, Marlon, Guillermo, Noemí, Julio
 */

export type QuantifierType = 'forall' | 'exists'; // '∀' o '∃'

export interface TraceStep {
  element: any;
  result: boolean;
  explanation: string;
}

export interface QuantifierResult {
  quantifier: QuantifierType;
  symbol: string;
  domain: any[];
  predicateText: string;
  isSatisfied: boolean;
  trace: TraceStep[];
  counterExample?: any;
  witness?: any;
  summary: string;
  deMorgan: {
    original: string;
    negated: string;
    rule: string;
    explanation: string;
  };
}

export function evaluateQuantifier(
  quantifier: QuantifierType,
  domainInput: any[],
  predicateFn: (x: any) => boolean,
  predicateDescription: string = 'P(x)'
): QuantifierResult {
  const symbol = quantifier === 'forall' ? '∀' : '∃';
  const domain = Array.isArray(domainInput) ? domainInput : [];

  if (domain.length === 0) {
    return {
      quantifier,
      symbol,
      domain: [],
      predicateText: predicateDescription,
      isSatisfied: quantifier === 'forall',
      trace: [],
      summary: 'El dominio de discurso se encuentra vacío.',
      deMorgan: getDeMorganTransformation(quantifier, predicateDescription)
    };
  }

  const trace: TraceStep[] = [];
  let counterExample: any = undefined;
  let witness: any = undefined;
  let allTrue = true;
  let anyTrue = false;

  for (const item of domain) {
    let res = false;
    try {
      res = Boolean(predicateFn(item));
    } catch {
      res = false;
    }

    trace.push({
      element: item,
      result: res,
      explanation: `x = ${item} ➔ ${predicateDescription.replace(/x/g, String(item))} ➔ ${res ? 'Verdadero (V) ✅' : 'Falso (F) ❌'}`
    });

    if (res) {
      anyTrue = true;
      if (witness === undefined) witness = item;
    } else {
      allTrue = false;
      if (counterExample === undefined) counterExample = item;
    }
  }

  const isSatisfied = quantifier === 'forall' ? allTrue : anyTrue;

  let summary = '';
  if (quantifier === 'forall') {
    summary = isSatisfied
      ? `La proposición universal ∀x (${predicateDescription}) es VERDADERA porque se cumple para el 100% de los elementos del dominio D = {${domain.join(', ')}}.`
      : `La proposición universal ∀x (${predicateDescription}) es FALSA porque se encontró el contraejemplo x = ${counterExample}.`;
  } else {
    summary = isSatisfied
      ? `La proposición existencial ∃x (${predicateDescription}) es VERDADERA porque existe al menos un elemento que la cumple: x = ${witness}.`
      : `La proposición existencial ∃x (${predicateDescription}) es FALSA porque ningún elemento del dominio D = {${domain.join(', ')}} satisface la condición.`;
  }

  return {
    quantifier,
    symbol,
    domain,
    predicateText: predicateDescription,
    isSatisfied,
    trace,
    counterExample,
    witness,
    summary,
    deMorgan: getDeMorganTransformation(quantifier, predicateDescription)
  };
}

export function getDeMorganTransformation(quantifier: QuantifierType, predicateText: string = 'P(x)') {
  if (quantifier === 'forall') {
    return {
      original: `¬(∀x ${predicateText})`,
      negated: `∃x ¬(${predicateText})`,
      rule: 'Ley de De Morgan Universal: ¬(∀x P(x)) ≡ ∃x ¬P(x)',
      explanation: 'Para negar una afirmación universal, se cambia el cuantificador ∀ por ∃ y se niega la condición interna.'
    };
  } else {
    return {
      original: `¬(∃x ${predicateText})`,
      negated: `∀x ¬(${predicateText})`,
      rule: 'Ley de De Morgan Existencial: ¬(∃x P(x)) ≡ ∀x ¬P(x)',
      explanation: 'Para negar una afirmación existencial, se cambia el cuantificador ∃ por ∀ y se niega la condición interna.'
    };
  }
}
```

---

## 💻 3. Código Fuente del Motor 2: Silogismos e Inferencias Lógicas (`syllogismEngine.ts`)

```typescript
/**
 * PROYECTO: LÓGICA SIMBÓLICA GLOBAL - ENTREGABLE 2
 * MÓDULO EXCLUSIVO DE SILOGISMOS E INFERENCIAS LÓGICAS
 * Equipo 3: Cristian (Sublíder), Danuska, Marlon, Guillermo, Noemí, Julio
 */

export interface SyllogismResult {
  premise1: string;
  premise2: string;
  conclusion: string;
  isValid: boolean;
  ruleName: string;
  ruleSymbol: string;
  explanation: string;
  formalProof: string[];
  fallacyDetail?: string;
}

function cleanSymbol(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/->/g, '→')
    .replace(/~/g, '¬')
    .replace(/!/g, '¬');
}

export function validateSyllogism(
  premise1: string,
  premise2: string,
  conclusion: string
): SyllogismResult {
  const p1 = cleanSymbol(premise1);
  const p2 = cleanSymbol(premise2);
  const c = cleanSymbol(conclusion);

  if (!p1 || !c) {
    return {
      premise1,
      premise2,
      conclusion,
      isValid: false,
      ruleName: 'Entrada Incompleta',
      ruleSymbol: '⚠️',
      explanation: 'Por favor ingresa la Premisa 1 y la Conclusión para evaluar.',
      formalProof: []
    };
  }

  // 1. Modus Ponendo Ponens (MP): p → q, p ⊢ q
  if (p1.includes('→')) {
    const [ante, cons] = p1.split('→');
    if (p2 === ante && c === cons) {
      return {
        premise1,
        premise2,
        conclusion,
        isValid: true,
        ruleName: 'Modus Ponendo Ponens (MP)',
        ruleSymbol: 'MP',
        explanation: `🟢 ARGUMENTO VÁLIDO. Si se afirma el antecedente '${ante}', la conclusión '${cons}' se deduce obligatoriamente.`,
        formalProof: [
          `Paso 1: Se tiene la condicional ${premise1}`,
          `Paso 2: Se afirma el antecedente ${premise2}`,
          `Paso 3: Por regla Modus Ponens (MP), se concluye ${conclusion}.`
        ]
      };
    }

    // Falacia de la Afirmación del Consecuente: p → q, q ⊢ p
    if (p2 === cons && c === ante) {
      return {
        premise1,
        premise2,
        conclusion,
        isValid: false,
        ruleName: 'Falacia de la Afirmación del Consecuente',
        ruleSymbol: 'FALACIA',
        explanation: `🔴 ARGUMENTO INVÁLIDO. Que ocurra '${cons}' no garantiza que haya ocurrido '${ante}'. Es una falacia formal.`,
        formalProof: [
          `Análisis: Afirmar el consecuente no permite deducir el antecedente en una implicación simple.`
        ],
        fallacyDetail: `Ejemplo cotidiano: "Si llueve, la calle se moja. La calle está moja ➔ Por lo tanto llovió" (Falso, alguien pudo haber lavado la calle).`
      };
    }
  }

  // 2. Modus Tollendo Tollens (MT): p → q, ¬q ⊢ ¬p
  if (p1.includes('→')) {
    const [ante, cons] = p1.split('→');
    const negCons = `¬${cons}`;
    const negAnte = `¬${ante}`;

    if ((p2 === negCons || p2 === `!${cons}`) && (c === negAnte || c === `!${ante}`)) {
      return {
        premise1,
        premise2,
        conclusion,
        isValid: true,
        ruleName: 'Modus Tollendo Tollens (MT)',
        ruleSymbol: 'MT',
        explanation: `🟢 ARGUMENTO VÁLIDO. Si se niega el consecuente '${cons}', se deduce la negación del antecedente '${ante}'.`,
        formalProof: [
          `Paso 1: Se tiene la condicional ${premise1}`,
          `Paso 2: Se niega el consecuente ${premise2}`,
          `Paso 3: Por regla Modus Tollens (MT), se concluye ${conclusion}.`
        ]
      };
    }

    // Falacia de la Negación del Antecedente: p → q, ¬p ⊢ ¬q
    if ((p2 === negAnte || p2 === `!${ante}`) && (c === negCons || c === `!${cons}`)) {
      return {
        premise1,
        premise2,
        conclusion,
        isValid: false,
        ruleName: 'Falacia de la Negación del Antecedente',
        ruleSymbol: 'FALACIA',
        explanation: `🔴 ARGUMENTO INVÁLIDO. Negar '${ante}' no obliga a que '${cons}' sea falso. Es una falacia formal.`,
        formalProof: [
          `Análisis: La negación del antecedente no garantiza la negación del consecuente.`
        ],
        fallacyDetail: `Ejemplo cotidiano: "Si soy pez, respiro bajo el agua. No soy pez ➔ Por lo tanto no respiro bajo el agua" (Negación no válida en condicional simple).`
      };
    }
  }

  // 3. Silogismo Hipotético (SH): p → q, q → r ⊢ p → r
  if (p1.includes('→') && p2.includes('→') && c.includes('→')) {
    const [p1A, p1B] = p1.split('→');
    const [p2A, p2B] = p2.split('→');
    const [cA, cB] = c.split('→');

    if (p1B === p2A && p1A === cA && p2B === cB) {
      return {
        premise1,
        premise2,
        conclusion,
        isValid: true,
        ruleName: 'Silogismo Hipotético (SH)',
        ruleSymbol: 'SH',
        explanation: `🟢 ARGUMENTO VÁLIDO. Transitividad de la implicación: si '${p1A}' implica '${p1B}' y '${p1B}' implica '${p2B}', entonces '${p1A}' implica '${p2B}'.`,
        formalProof: [
          `Paso 1: Primara condicional ${premise1}`,
          `Paso 2: Segunda condicional ${premise2}`,
          `Paso 3: Encadenamiento por Silogismo Hipotético (SH) ➔ ${conclusion}.`
        ]
      };
    }
  }

  // 4. Silogismo Disyuntivo (SD): p ∨ q, ¬p ⊢ q
  if (p1.includes('∨') || p1.includes('|')) {
    const [optionA, optionB] = p1.includes('∨') ? p1.split('∨') : p1.split('|');

    if ((p2 === `¬${optionA}` && c === optionB) || (p2 === `¬${optionB}` && c === optionA)) {
      return {
        premise1,
        premise2,
        conclusion,
        isValid: true,
        ruleName: 'Silogismo Disyuntivo (SD)',
        ruleSymbol: 'SD',
        explanation: `🟢 ARGUMENTO VÁLIDO. En una disyunción, al descartar una opción se concluye la opción restante.`,
        formalProof: [
          `Paso 1: Disyunción ${premise1}`,
          `Paso 2: Descarte de opción ${premise2}`,
          `Paso 3: Por Silogismo Disyuntivo (SD), se concluye ${conclusion}.`
        ]
      };
    }
  }

  return {
    premise1,
    premise2,
    conclusion,
    isValid: false,
    ruleName: 'Inferencia No Reconocida o Falacia',
    ruleSymbol: '❌',
    explanation: '🔴 El argumento no corresponde a ninguna de las Reglas de Inferencia Clásicas (MP, MT, SH, SD) o es un razonamiento inválido.',
    formalProof: [
      'Se recomienda verificar el uso de los conectores (→, ∨, ¬) y las variables proposicionales.'
    ]
  };
}
```

---

## 🎨 4. Vista de Componente Vue 3: Cuantificadores (`QuantificadoresPage.vue`)

```vue
<template>
  <div class="quantifiers-page min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
    <header class="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-mono font-bold text-2xl text-white shadow-lg shadow-blue-500/20">
          ∀∃
        </div>
        <div>
          <h1 class="text-2xl font-bold tracking-tight flex items-center gap-2">
            QuantifiWeb <span class="text-xs bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full uppercase font-mono">Equipo 3</span>
          </h1>
          <p class="text-xs text-slate-400">Cuantificadores Lógicos sobre Dominios Finitos D & Leyes de De Morgan</p>
        </div>
      </div>
      <div class="text-right text-xs text-slate-400 bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
        <div class="font-semibold text-slate-200">Equipo 3 — Modus Innova:</div>
        <div class="text-cyan-400">Cristian (Sublíder), Danuska, Marlon, Guillermo, Noemí, Julio</div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
      <section class="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <h2 class="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">⚙️ Configuración</h2>
        <div class="mb-4">
          <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Cuantificador Lógico</label>
          <div class="grid grid-cols-2 gap-3">
            <button @click="quantifier = 'forall'" :class="['p-3 rounded-xl font-semibold border flex items-center justify-center gap-2 transition-all', quantifier === 'forall' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-400']">∀ Universal</button>
            <button @click="quantifier = 'exists'" :class="['p-3 rounded-xl font-semibold border flex items-center justify-center gap-2 transition-all', quantifier === 'exists' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-400']">∃ Existencial</button>
          </div>
        </div>
        <div class="mb-4">
          <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Dominio D (separado por comas)</label>
          <input v-model="rawDomain" type="text" placeholder="1, 2, 3, 4, 5" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 font-mono text-sm" />
        </div>
        <button @click="evaluate" class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-lg">🚀 Evaluar Cuantificador en D</button>
      </section>

      <section class="lg:col-span-7 flex flex-col gap-6">
        <div v-if="result" :class="['border rounded-2xl p-6 shadow-xl', result.isSatisfied ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-rose-950/40 border-rose-500/40 text-rose-200']">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border">{{ result.isSatisfied ? '🟢 VERDADERO (V)' : '🔴 FALSO (F)' }}</span>
            <span class="font-mono text-xl font-bold">{{ result.symbol }}x P(x)</span>
          </div>
          <p class="text-sm font-medium mt-2">{{ result.summary }}</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { evaluateQuantifier, type QuantifierType, type QuantifierResult } from '../../utils/quantifierEngine'

const quantifier = ref<QuantifierType>('forall')
const rawDomain = ref('1, 2, 3, 4, 5')
const result = ref<QuantifierResult | null>(null)

function evaluate() {
  const domain = rawDomain.value.split(',').map(s => s.trim()).filter(Boolean)
  const isEven = (x: any) => Number(x) % 2 === 0
  result.value = evaluateQuantifier(quantifier.value, domain, isEven, 'x es par')
}

onMounted(() => evaluate())
</script>
```

---

## 📌 5. Conclusión y Firma de Entrega

Este archivo único consolida el **100% del Código Fuente del Entregable 2** para el **Equipo 3 (Modus Innova)**, cubriendo la especificación de componentes Vue 3 y motores TypeScript para Cuantificadores Lógicos y Silogismos.

**Firmado:** Cristian — *Sublíder del Equipo 3*
