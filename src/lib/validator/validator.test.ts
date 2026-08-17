import { describe, it, expect } from 'vitest';
import {
  sanitizarEntrada,
  validarExpresion,
  validarPremisasYConclusion,
} from './validator';

describe('Módulo de Sanitización y Validación (Renato)', () => {

  describe('CB-01 & CB-02: Manejo de Vacíos y Espacios en Blanco', () => {
    it('debe rechazar cadenas vacías', () => {
      expect(() => sanitizarEntrada('')).toThrowError(/no puede estar vacía/);
    });

    it('debe rechazar cadenas con solo espacios, tabuladores o saltos de línea', () => {
      expect(() => sanitizarEntrada('   \t\n  ')).toThrowError(/no puede estar vacía|solo espacios/);
    });

    it('debe normalizar espacios múltiples a un solo espacio', () => {
      const salida = sanitizarEntrada('  P   ENTONCES    Q  ');
      expect(salida).toBe('P ENTONCES Q');
    });
  });

  describe('CB-04: Normalización de Mayúsculas / Minúsculas', () => {
    it('debe convertir variables y operadores en minúsculas a mayúsculas', () => {
      expect(sanitizarEntrada('p entonces q')).toBe('P ENTONCES Q');
      expect(sanitizarEntrada('p y q o r')).toBe('P Y Q O R');
      expect(sanitizarEntrada('no p')).toBe('NO P');
    });
  });

  describe('CB-05 a CB-12: Normalización de Notaciones Simbólicas y Unicode', () => {
    it('CB-05: debe normalizar flechas de condicional (->, =>, →, ⇒, implies)', () => {
      expect(sanitizarEntrada('p -> q')).toBe('P ENTONCES Q');
      expect(sanitizarEntrada('p => q')).toBe('P ENTONCES Q');
      expect(sanitizarEntrada('p → q')).toBe('P ENTONCES Q');
      expect(sanitizarEntrada('p ⇒ q')).toBe('P ENTONCES Q');
      expect(sanitizarEntrada('p implies q')).toBe('P ENTONCES Q');
    });

    it('CB-06: debe normalizar bicondicionales (<->, <=>, ↔, ⇔, iff, si y solo si)', () => {
      expect(sanitizarEntrada('p <-> q')).toBe('P SI_Y_SOLO_SI Q');
      expect(sanitizarEntrada('p <=> q')).toBe('P SI_Y_SOLO_SI Q');
      expect(sanitizarEntrada('p ↔ q')).toBe('P SI_Y_SOLO_SI Q');
      expect(sanitizarEntrada('p ⇔ q')).toBe('P SI_Y_SOLO_SI Q');
      expect(sanitizarEntrada('p iff q')).toBe('P SI_Y_SOLO_SI Q');
      expect(sanitizarEntrada('p si y solo si q')).toBe('P SI_Y_SOLO_SI Q');
    });

    it('CB-07: debe normalizar conjunciones (^, &, &&, ∧, *, ·, and)', () => {
      expect(sanitizarEntrada('p ^ q')).toBe('P Y Q');
      expect(sanitizarEntrada('p & q')).toBe('P Y Q');
      expect(sanitizarEntrada('p && q')).toBe('P Y Q');
      expect(sanitizarEntrada('p ∧ q')).toBe('P Y Q');
      expect(sanitizarEntrada('p * q')).toBe('P Y Q');
      expect(sanitizarEntrada('p · q')).toBe('P Y Q');
      expect(sanitizarEntrada('p and q')).toBe('P Y Q');
    });

    it('CB-08: debe normalizar disyunciones (|, ||, ∨, +, v, or)', () => {
      expect(sanitizarEntrada('p | q')).toBe('P O Q');
      expect(sanitizarEntrada('p || q')).toBe('P O Q');
      expect(sanitizarEntrada('p ∨ q')).toBe('P O Q');
      expect(sanitizarEntrada('p + q')).toBe('P O Q');
      expect(sanitizarEntrada('p v q')).toBe('P O Q');
      expect(sanitizarEntrada('p or q')).toBe('P O Q');
    });

    it('CB-09: debe normalizar negaciones (~, !, ¬, not, no)', () => {
      expect(sanitizarEntrada('~p')).toBe('NO P');
      expect(sanitizarEntrada('!p')).toBe('NO P');
      expect(sanitizarEntrada('¬p')).toBe('NO P');
      expect(sanitizarEntrada('not p')).toBe('NO P');
      expect(sanitizarEntrada('no p')).toBe('NO P');
    });

    it('CB-10: debe normalizar disyunción exclusiva (⊕, ⊻, xor, o exclusiva)', () => {
      expect(sanitizarEntrada('p ⊕ q')).toBe('P O_EXCLUSIVA Q');
      expect(sanitizarEntrada('p ⊻ q')).toBe('P O_EXCLUSIVA Q');
      expect(sanitizarEntrada('p xor q')).toBe('P O_EXCLUSIVA Q');
      expect(sanitizarEntrada('p o exclusiva q')).toBe('P O_EXCLUSIVA Q');
    });

    it('CB-11: debe normalizar NOR / Barra de Nicod (↓, ⊽, nor, ni)', () => {
      expect(sanitizarEntrada('p ↓ q')).toBe('P NI Q');
      expect(sanitizarEntrada('p ⊽ q')).toBe('P NI Q');
      expect(sanitizarEntrada('p nor q')).toBe('P NI Q');
      expect(sanitizarEntrada('p ni q')).toBe('P NI Q');
    });

    it('CB-12: debe normalizar NAND / Barra de Sheffer (↑, ⊼, nand, incompatible)', () => {
      expect(sanitizarEntrada('p ↑ q')).toBe('P INCOMPATIBLE Q');
      expect(sanitizarEntrada('p ⊼ q')).toBe('P INCOMPATIBLE Q');
      expect(sanitizarEntrada('p nand q')).toBe('P INCOMPATIBLE Q');
      expect(sanitizarEntrada('p incompatible q')).toBe('P INCOMPATIBLE Q');
    });
  });

  describe('CB-13 a CB-16: Paréntesis y Anidación', () => {
    it('CB-13: debe aislar paréntesis pegados a variables u operadores', () => {
      expect(sanitizarEntrada('P ENTONCES(Q O R)')).toBe('P ENTONCES ( Q O R )');
      expect(sanitizarEntrada('(P Y Q)->R')).toBe('( P Y Q ) ENTONCES R');
    });

    it('CB-14: debe lanzar error si falta cerrar paréntesis', () => {
      expect(() => sanitizarEntrada('(P ENTONCES Q')).toThrowError(/falta cerrar '\)'/);
      expect(() => sanitizarEntrada('((P Y Q) O R')).toThrowError(/falta cerrar '\)'/);
    });

    it('CB-15: debe lanzar error si hay cierre de paréntesis sin apertura previa', () => {
      expect(() => sanitizarEntrada('P ENTONCES Q)')).toThrowError(/unexpected|'\)' inesperado/i);
    });

    it('CB-16: debe lanzar error si hay paréntesis vacíos ()', () => {
      expect(() => sanitizarEntrada('P ENTONCES ()')).toThrowError(/Expresión vacía dentro de paréntesis/);
    });
  });

  describe('CB-17 & CB-18: Caracteres Prohibidos e Inyección', () => {
    it('CB-17: debe rechazar caracteres especiales no reconocidos', () => {
      expect(() => sanitizarEntrada('P @ Q')).toThrowError(/Caracteres inválidos detectados/);
      expect(() => sanitizarEntrada('P $ Q')).toThrowError(/Caracteres inválidos detectados/);
      expect(() => sanitizarEntrada('P # Q')).toThrowError(/Caracteres inválidos detectados/);
    });

    it('CB-18: debe bloquear intentos de inyección HTML o scripts', () => {
      expect(() => sanitizarEntrada('<script>alert(1)</script>')).toThrowError(/Caracteres inválidos detectados/);
      expect(() => sanitizarEntrada('<div>P Y Q</div>')).toThrowError(/Caracteres inválidos detectados/);
    });
  });

  describe('CB-19: Variables con Subíndices e Índices', () => {
    it('debe aceptar variables compuestas con números o guion bajo (P1, Q_2, R_A)', () => {
      expect(sanitizarEntrada('p1 -> p2')).toBe('P1 ENTONCES P2');
      expect(sanitizarEntrada('p_1 y q_2')).toBe('P_1 Y Q_2');
    });
  });

  describe('CB-20 a CB-22: Errores Estructurales y Operadores Consecutivos', () => {
    it('CB-20: debe rechazar operadores binarios consecutivos sin variable', () => {
      expect(() => sanitizarEntrada('P Y Y Q')).toThrowError(/Operadores lógicos consecutivos/);
      expect(() => sanitizarEntrada('P ENTONCES O Q')).toThrowError(/Operadores lógicos consecutivos/);
    });

    it('CB-21: debe permitir negaciones múltiples anidadas', () => {
      expect(sanitizarEntrada('~~~P')).toBe('NO NO NO P');
      expect(sanitizarEntrada('!~!P')).toBe('NO NO NO P');
      expect(sanitizarEntrada('NO NO P')).toBe('NO NO P');
    });

    it('CB-22: debe rechazar expresiones que inician o terminan con operadores binarios', () => {
      expect(() => sanitizarEntrada('Y P')).toThrowError(/no puede iniciar con operador binario/);
      expect(() => sanitizarEntrada('P ENTONCES')).toThrowError(/no puede finalizar con operador/);
      expect(() => sanitizarEntrada('ENTONCES')).toThrowError(/no puede iniciar con operador binario/);
      expect(() => sanitizarEntrada('NO')).toThrowError(/no puede finalizar con operador/);
    });

    it('debe rechazar variables consecutivas sin operador intermedio', () => {
      expect(() => sanitizarEntrada('P Q')).toThrowError(/Falta operador entre las variables/);
    });
  });

  describe('CB-23 a CB-25: Funciones de Alto Nivel para UI y Conjuntos de Premisas', () => {
    it('validarExpresion debe retornar objeto seguro sin arrojar excepciones', () => {
      const resValido = validarExpresion('p -> q');
      expect(resValido.esValida).toBe(true);
      expect(resValido.textoSanitizado).toBe('P ENTONCES Q');
      expect(resValido.error).toBeUndefined();

      const resInvalido = validarExpresion('(p -> q');
      expect(resInvalido.esValida).toBe(false);
      expect(resInvalido.textoSanitizado).toBe('');
      expect(resInvalido.error).toContain('falta cerrar');
    });

    it('validarPremisasYConclusion debe procesar lote completo y eliminar duplicados', () => {
      const res = validarPremisasYConclusion(
        ['p -> q', 'p', 'p -> q', 'q -> r'],
        'r',
        { eliminarDuplicados: true }
      );

      expect(res.esValido).toBe(true);
      expect(res.premisasSanitizadas.length).toBe(3); // 'p -> q' duplicado eliminado
      expect(res.premisasSanitizadas).toEqual(['P ENTONCES Q', 'P', 'Q ENTONCES R']);
      expect(res.conclusionSanitizada).toBe('R');
      expect(res.errores.length).toBe(0);
    });

    it('validarPremisasYConclusion debe recopilar errores en premisas y conclusión', () => {
      const res = validarPremisasYConclusion(
        ['p -> (q', 'p @ r'],
        'r ->'
      );

      expect(res.esValido).toBe(false);
      expect(res.errores.length).toBe(3);
      expect(res.errores[0]).toContain('Premisa 1:');
      expect(res.errores[1]).toContain('Premisa 2:');
      expect(res.errores[2]).toContain('Conclusión:');
    });

    it('validarPremisasYConclusion debe requerir al menos una premisa', () => {
      const res = validarPremisasYConclusion([], 'P');
      expect(res.esValido).toBe(false);
      expect(res.errores[0]).toContain('Se requiere al menos una premisa');
    });
  });

});
