# 🎯 TAREA 04: Pruebas y Despliegue

**Objetivo:** Integración final, pruebas y deploy en GitHub Pages.
**Fecha límite:** Sábado 30/08 (FECHA LÍMITE ABSOLUTA)

---

## 📚 Recursos y Manuales

| Recurso | Link | Para qué sirve |
|---|---|---|
| GitHub Pages | https://docs.github.com/en/pages | Entender el deploy |
| Vite Build | https://vitejs.dev/guide/build.html | Configurar build para producción |
| Vitest | https://vitest.dev/guide/ | Escribir tests |
| Vue Test Utils | https://test-utils.vuejs.org/ | Tests de componentes |

---

## 📌 Responsabilidades

### Cada Equipo
- Verificar que su módulo funciona en la app completa
- Escribir al menos 1 test básico por función principal
- Documentar uso de su módulo en `TAREAS/04_Deploy/{equipo}/uso.md`

### Líder (Enri)
- Configurar `vite.config.ts` con `base`
- Crear `.github/workflows/deploy.yml`
- Merge final a `main`
- Verificar deploy en GitHub Pages

---

## 🛠️ Deploy — GitHub Pages

### Paso 1: vite.config.ts (Ya configurado ✅)
```ts
export default defineConfig({
  base: '/logica_simbolica_global/',
  // ...
})
```

### Paso 2: .github/workflows/deploy.yml (Ya creado ✅)
El workflow automáticamente:
1. Instala dependencias
2. Ejecuta `npm run build`
3. Sube a GitHub Pages

### Paso 3: Activar GitHub Pages
1. Ve a Settings → Pages
2. Source: **GitHub Actions**
3. El deploy ocurrirá automáticamente al hacer push a `main`

---

## 📋 Por Equipo — Qué Verificar

### Sinergia (Tablas)
- [ ] Genera tablas de verdad correctas
- [ ] Identifica tautologías/contradicciones
- [ ] Test: `evaluar()` con al menos 3 fórmulas

### Hijos de Linus (Inferencias)
- [ ] Demuestra conclusión con MPP
- [ ] Muestra pasos de trazabilidad
- [ ] Test: `demostrarConclusion()` con al menos 2 argumentos

### Modus Innova (Cuantificadores)
- [ ] Evalúa ∀ y ∃ en dominio finito
- [ ] Niega cuantificadores correctamente
- [ ] Test: `evaluarCuantificador()` con al menos 2 fórmulas

### Linus (Conjuntos)
- [ ] Realiza unión, intersección, diferencia
- [ ] Genera conjunto potencia
- [ ] Test: al menos 3 operaciones con resultados correctos

---

## 📝 Documento de Uso

Crear `TAREAS/04_Deploy/{equipo}/uso.md` con:

```markdown
# Uso del Módulo: [Nombre del Tema]

## Cómo funciona
[Descripción breve]

## Ejemplos
1. [Ejemplo 1 con entrada y salida esperada]
2. [Ejemplo 2]

## Limitaciones
- [Qué no hace tu módulo]
```

---

## ✅ Checklist Final

- [ ] `npm run build` produce `dist/` sin errores
- [ ] `npm run test` pasa
- [ ] App visible en GitHub Pages
- [ ] Todos los módulos navegables desde Home
- [ ] README actualizado con link al deploy
- [ ] Documento de uso creado
