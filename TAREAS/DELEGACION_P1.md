# Delegación P1 — Landing Page (Home + Navbar + Contributors)

**Delegado:** Morocho
**Líder que convoca:** Enrique (líder del proyecto)
**Estado:** Por ejecutar

---

## 1. Propósito (visión compartida)
Dar a conocer el valor de la plataforma para poder publicarla: una landing que comunique
**50% el valor de la plataforma** (qué es, por qué importa, para quién) y **50% "nosotros"**
(los equipos, las personas, el docente y la universidad), todo coherente con el branding LogiLearn.

## 2. Qué se espera (resultado, no proceso)
- Una `Home.vue` que funcione como landing profesional y publicable.
- Agregar el link **"Inicio"** al navbar (`AppNavBar.vue`) apuntando a `/`.
- Crear **`CONTRIBUTORS.md`** en la raíz con la lista completa de participantes.

## 3. Criterios de aceptación (medibles)
- [ ] `Home.vue` navegable, legible y alineado al branding.
- [ ] Secciones presentes: hero de valor + "Sobre Nosotros" (universidad, curso, docente, equipos, participantes).
- [ ] Navbar incluye "Inicio".
- [ ] `CONTRIBUTORS.md` existe y lista a los 4 equipos (incl. Mauricio en Hijos de Linus y Julio en Modus Innova).
- [ ] `npm run build` pasa sin errores.
- [ ] Aprobación visual de Enrique.

## 4. Restricciones
- Branding LogiLearn: navy `#0F2D8D` (navbar), azul-600 `#2563EB` (acciones),
  tarjetas blancas `border-neutral-200` `rounded-xl` `shadow-sm`.
- No romper el build ni los **175 tests** existentes.
- No usar "Iniciar sesión" / "Cerrar sesión" en el navbar.

## 5. Entregables (archivos)
- `src/pages/Home.vue` (reescritura)
- `src/components/layout/AppNavBar.vue` (agregar "Inicio")
- `CONTRIBUTORS.md` (nuevo)

## 6. Recursos que Enrique dejó listos
- **Branding kit:** navy `#0F2D8D`, azul-600, estilo rounded-xl/shadow-sm.
- **Datos del sílabo:** Universidad Nacional Pedro Ruiz Gallo · Escuela Prof. de Ingeniería de Sistemas ·
  Curso **Lógica Simbólica** (código **MATG1001**, Semestre **2026 I**, II Ciclo) ·
  Docente **Dr. Mardo Victor Gonzales Herrera** (mgonzalesh@unprg.edu.pe).
- **Lista de participantes** (ver abajo).
- Rama de trabajo: `feat/integrate-sinergia-modus` (PR #16).

### Lista oficial de participantes
- **Líder de proyecto:** Enrique (EnriDiazCayaca)
- **Equipo Sinergia** (sublíder Alexa): Aldair, Smith, Miguel Velarde, Jesús Núñez
- **Equipo Los Hijos de Linus** (sublíder Arom): Centurión, Morocho, Altamirano, Mio, **Mauricio**
- **Equipo Modus Innova** (sublíder Cristian): Danuska, Marlon, Guillermo, Noemí, **Julio**
- **Equipo Linus** (sublíder Jordy): Nio, Mike, Sergio, Fer, Alejandro
- **Docente:** Dr. Mardo Victor Gonzales Herrera
