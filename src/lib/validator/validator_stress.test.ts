import { describe, it, expect } from 'vitest';
import { sanitizarEntrada, validarExpresion, validarPremisasYConclusion } from './validator';
import { parsearExpresion } from '../solver/parser';

describe('Pruebas de Estrés, Seguridad y Casos Avanzados (Renato)', () => {

  describe('1. Pruebas de Estrés y Fórmulas Profundamente Anidadas', () => {
    it('debe sanitizar y parsear expresiones con múltiples niveles de anidación de paréntesis', () => {
      const entradaCompleja = '((((p -> q) && (r => s)) || (~t)) <=> w)';
      const sanitizado = sanitizarEntrada(entradaCompleja);
      
      expect(sanitizado).toBe('( ( ( ( P ENTONCES Q ) Y ( R ENTONCES S ) ) O ( NO T ) ) SI_Y_SOLO_SI W )');
      
      // Comprobar que el parser de Arom lo procesa sin problemas
      expect(() => parsearExpresion(sanitizado)).not.toThrow();
    });

    it('debe manejar expresiones con hasta 10 niveles de anidación', () => {
      const entrada10Niveles = '((((((((((p))))))))))';
      const sanitizado = sanitizarEntrada(entrada10Niveles);
      expect(sanitizado).toBe('( ( ( ( ( ( ( ( ( ( P ) ) ) ) ) ) ) ) ) )');
      expect(() => parsearExpresion(sanitizado)).not.toThrow();
    });

    it('debe manejar cadenas con muchos operadores combinados en línea', () => {
      const larga = 'p1 & p2 | p3 -> p4 <-> p5 ⊕ p6 ↓ p7 ↑ p8';
      const sanitizado = sanitizarEntrada(larga);
      expect(sanitizado).toBe('P1 Y P2 O P3 ENTONCES P4 SI_Y_SOLO_SI P5 O_EXCLUSIVA P6 NI P7 INCOMPATIBLE P8');
      expect(() => parsearExpresion(sanitizado)).not.toThrow();
    });
  });

  describe('2. Pruebas de Mezcla de Negaciones y Símbolos Alternativos', () => {
    it('debe admitir combinaciones mixtas de símbolos de negación (!~¬)', () => {
      const entrada = '!~¬P';
      const sanitizado = sanitizarEntrada(entrada);
      expect(sanitizado).toBe('NO NO NO P');
      expect(() => parsearExpresion(sanitizado)).not.toThrow();
    });

    it('debe sanitizar negaciones precediendo paréntesis: ~(p & q) y ¬(p -> q)', () => {
      expect(sanitizarEntrada('~(p & q)')).toBe('NO ( P Y Q )');
      expect(sanitizarEntrada('¬(p -> q)')).toBe('NO ( P ENTONCES Q )');
      expect(sanitizarEntrada('!(p || q)')).toBe('NO ( P O Q )');
    });

    it('debe rechazar negaciones sin operando al final de subexpresiones: (P Y NO)', () => {
      expect(() => sanitizarEntrada('(P Y NO)')).toThrowError(/sin operando derecho antes de '\)'/);
    });
  });

  describe('3. Pruebas de Resiliencia ante Espacios y Caracteres Invisibles', () => {
    it('debe limpiar tabuladores, retornos de carro y múltiples espacios entre operadores y variables', () => {
      const textoConTabs = "\t\t  p   \r\n\t  ->   \r\n  q  \t ";
      const sanitizado = sanitizarEntrada(textoConTabs);
      expect(sanitizado).toBe('P ENTONCES Q');
    });

    it('debe manejar variables con nombres descriptivos largos', () => {
      const entrada = 'llueve_hoy -> hace_frio_2026';
      const sanitizado = sanitizarEntrada(entrada);
      expect(sanitizado).toBe('LLUEVE_HOY ENTONCES HACE_FRIO_2026');
      expect(() => parsearExpresion(sanitizado)).not.toThrow();
    });
  });

  describe('4. Pruebas de Seguridad y Ataques / Entradas Maliciosas', () => {
    it('debe rechazar inyecciones SQL / Comandos', () => {
      expect(() => sanitizarEntrada("P; DROP TABLE premisas;")).toThrowError(/Caracteres inválidos detectados/);
    });

    it('debe rechazar caracteres de control y formatos JSON / JS', () => {
      expect(() => sanitizarEntrada("{ 'p': true }")).toThrowError(/Caracteres inválidos detectados/);
      expect(() => sanitizarEntrada("[p, q]")).toThrowError(/Token o carácter no reconocido/);
    });

    it('debe rechazar caracteres de interrogación y símbolos monetarios', () => {
      expect(() => sanitizarEntrada("¿P ENTONCES Q?")).toThrowError(/Token o carácter no reconocido|Caracteres inválidos/);
      expect(() => sanitizarEntrada("100$ Y 200€")).toThrowError(/Caracteres inválidos/);
    });

    it('debe rechazar caracteres con emojis variados', () => {
      expect(() => sanitizarEntrada("P 👍 Q")).toThrowError(/Token o carácter no reconocido/);
      expect(() => sanitizarEntrada("🔥 ENTONCES ❄️")).toThrowError(/Token o carácter no reconocido/);
    });
  });

  describe('5. Pruebas de Lotes y Deduplicación Insensible a Mayúsculas / Espacios', () => {
    it('debe deduplicar premisas escritas de formas diferentes pero equivalentes en formato', () => {
      const premisas = [
        'p -> q',
        'P -> Q',
        '  p   ->   q  ',
        'P ENTONCES Q',
        'p implies q',
        'p → q'
      ];
      
      const resultado = validarPremisasYConclusion(premisas, 'q');
      expect(resultado.esValido).toBe(true);
      // Todas las 6 variantes se deben normalizar a 'P ENTONCES Q' y quedar en 1 sola premisa
      expect(resultado.premisasSanitizadas).toEqual(['P ENTONCES Q']);
      expect(resultado.conclusionSanitizada).toBe('Q');
    });

    it('debe validar correctamente un lote de 15 premisas distintas sin degradación', () => {
      const premisas = Array.from({ length: 15 }, (_, i) => `p_${i} -> p_${i + 1}`);
      const resultado = validarPremisasYConclusion(premisas, 'p_15');
      
      expect(resultado.esValido).toBe(true);
      expect(resultado.premisasSanitizadas.length).toBe(15);
      expect(resultado.conclusionSanitizada).toBe('P_15');
    });
  });

  describe('6. Propiedad de Robustez (Fuzzing sobre entradas aleatorias)', () => {
    it('validarExpresion NUNCA debe arrojar excepciones no capturadas ante entradas corruptas', () => {
      const entradasCorruptas = [
        '',
        '     ',
        '???',
        '(((',
        ')))',
        '-> -> ->',
        'P -> -> Q',
        'NO NO NO',
        'P Y (Q O',
        'P Q R S T',
        '~',
        '!',
        '()()()',
        'null',
        'undefined',
        '<script></script>',
        'P -> (Q -> (R -> (S -> T)))'
      ];

      for (const entrada of entradasCorruptas) {
        expect(() => {
          const res = validarExpresion(entrada);
          expect(typeof res.esValida).toBe('boolean');
          expect(typeof res.textoSanitizado).toBe('string');
        }).not.toThrow();
      }
    });
  });

});
