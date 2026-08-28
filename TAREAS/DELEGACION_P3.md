# Delegación P3 — Depurar Repositorio

**Delegado:** Alex
**Líder que convoca:** Enrique (líder del proyecto)
**Estado:** Por ejecutar

---

## 1. Propósito (visión compartida)
Dejar el repositorio limpio, organizado y listo para publicación: README finalizado,
sin archivosLegacy de migración, con ramas ordenadas.

## 2. Qué se espera (resultado, no proceso)
- `README.md` actualizado al estado **"finalizado"** (proyecto completado al 100% del sílabo).
- Eliminar carpetas/archivos **innecesarios**: `.next/`, `next-env.d.ts`, `dist/`, `skills-lock.json`
  (son legacy de la migración Next.js → Vue).
- Limpiar **ramas locales obsoletas**: `pr/12`, `pr/12-temp`, `pr/14`, `pr/15`, `test-linus-prs`.
- `.gitignore` actualizado para ignorar los legacy.

> **Nota:** Enrique retiene la parte de **cerrar los PRs #8, #14 y #15** (no es tarea de Alex).

## 3. Criterios de aceptación (medibles)
- [ ] `README.md` refleja estado final, equipos, cómo correr y deploy.
- [ ] Sin `.next/`, `next-env.d.ts`, `dist/`, `skills-lock.json` en el árbol de trabajo.
- [ ] Ramas locales obsoletas eliminadas.
- [ ] `.gitignore` incluye los patrones legacy.
- [ ] `npm run build` pasa; **175 tests** siguen pasando.
- [ ] Aprobación de Enrique.

## 4. Restricciones
- No borrar `src/`, `docs/`, `TAREAS/`, `public/`, ni configuraciones de deploy (Netlify/GitHub Pages).
- No tocar el trabajo ya integrado en `feat/integrate-sinergia-modus`.
- Mantener `.agents/` (config de herramienta) salvo indicación contraria de Enrique.

## 5. Entregables (archivos)
- `README.md` (reescritura a estado final)
- Eliminación de: `.next/`, `next-env.d.ts`, `dist/`, `skills-lock.json`
- Limpieza de ramas locales: `pr/12`, `pr/12-temp`, `pr/14`, `pr/15`, `test-linus-prs`
- `.gitignore` (actualización)

## 6. Recursos que Enrique dejó listos
- Confirmación de qué PRs cerrar (Enrique cierra #8, #14, #15; se mantiene #16).
- Lista de carpetas legacy a borrar (arriba).
- Rama de trabajo: `feat/integrate-sinergia-modus`.
