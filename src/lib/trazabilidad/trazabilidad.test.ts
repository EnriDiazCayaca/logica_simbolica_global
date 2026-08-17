import { describe, it, expect } from "vitest";
import {
  crearHistorial,
  registrarPaso,
  construirTrazabilidad,
  obtenerPaso,
  obtenerConclusiones,
} from "./historial";
import type {
  PasoDemostracion,
  NodoExpresion,
  ResultadoDemostracion,
} from "../solver/types";

function crearVariable(nombre: string): NodoExpresion {
  return { tipo: "variable", nombre };
}

function crearImplicacion(
  izq: NodoExpresion,
  der: NodoExpresion
): NodoExpresion {
  return {
    tipo: "operacion",
    operador: "ENTONCES",
    izquierdo: izq,
    derecho: der,
  };
}

describe("crearHistorial", () => {
  it("devuelve un array vacio al inicio", () => {
    const historial = crearHistorial();
    expect(historial).toEqual([]);
    expect(historial.length).toBe(0);
  });
});

describe("registrarPaso", () => {
  const P = crearVariable("P");
  const Q = crearVariable("Q");
  const premisas: NodoExpresion[] = [crearImplicacion(P, Q), P];

  it("registra un paso y lo retorna con datos completos", () => {
    const historial = crearHistorial();
    const paso: PasoDemostracion = {
      idPaso: "MODUS_PONENDO_PONENS",
      lineasInvolucradas: [1, 2],
      expresionResultante: Q,
      esConclusion: true,
    };

    const registrado = registrarPaso(historial, paso, premisas, []);

    expect(registrado.numeroPaso).toBe(1);
    expect(registrado.regla).toBe("MODUS_PONENDO_PONENS");
    expect(registrado.operacion).toBe("Modus Ponendo Ponens");
    expect(registrado.alias).toBe("MPP, Afirmando afirmo");
    expect(registrado.expresionSimbolica).toBe("Q");
    expect(registrado.lineasBase).toEqual([1, 2]);
    expect(registrado.esConclusion).toBe(true);
    expect(registrado.explicacion).toContain("Modus Ponendo Ponens");
    expect(registrado.explicacion).toContain("conclusi");
    expect(historial.length).toBe(1);
  });

  it("acumula multiples pasos en orden", () => {
    const historial = crearHistorial();
    const paso1: PasoDemostracion = {
      idPaso: "MODUS_PONENDO_PONENS",
      lineasInvolucradas: [1, 2],
      expresionResultante: Q,
      esConclusion: false,
    };
    const R = crearVariable("R");
    const paso2: PasoDemostracion = {
      idPaso: "MODUS_PONENDO_PONENS",
      lineasInvolucradas: [3, 1],
      expresionResultante: R,
      esConclusion: true,
    };

    registrarPaso(historial, paso1, premisas, []);
    registrarPaso(historial, paso2, premisas, [paso1]);

    expect(historial.length).toBe(2);
    expect(historial[0].numeroPaso).toBe(1);
    expect(historial[1].numeroPaso).toBe(2);
    expect(historial[1].lineasBase).toEqual([3, 1]);
  });

  it("genera estadoActual con todas las lineas disponibles", () => {
    const historial = crearHistorial();
    const paso: PasoDemostracion = {
      idPaso: "MODUS_PONENDO_PONENS",
      lineasInvolucradas: [1, 2],
      expresionResultante: Q,
      esConclusion: false,
    };

    const registrado = registrarPaso(historial, paso, premisas, []);

    expect(registrado.estadoActual).toContain("1:");
    expect(registrado.estadoActual).toContain("2:");
    expect(registrado.estadoActual).toContain("3:");
    expect(registrado.estadoActual).toContain("Q");
  });
});

describe("construirTrazabilidad", () => {
  const P = crearVariable("P");
  const Q = crearVariable("Q");
  const premisas: NodoExpresion[] = [crearImplicacion(P, Q), P];

  it("procesa un resultado valido con pasos", () => {
    const resultado: ResultadoDemostracion = {
      esValido: true,
      pasos: [
        {
          idPaso: "MODUS_PONENDO_PONENS",
          lineasInvolucradas: [1, 2],
          expresionResultante: Q,
          esConclusion: true,
        },
      ],
    };

    const trazabilidad = construirTrazabilidad(premisas, resultado);

    expect(trazabilidad.esValido).toBe(true);
    expect(trazabilidad.totalPasos).toBe(1);
    expect(trazabilidad.conclusion).toContain("demostrar");
    expect(trazabilidad.pasos.length).toBe(1);
    expect(trazabilidad.pasos[0].regla).toBe("MODUS_PONENDO_PONENS");
  });

  it("procesa un resultado invalido sin pasos", () => {
    const resultado: ResultadoDemostracion = {
      esValido: false,
      pasos: [],
    };

    const trazabilidad = construirTrazabilidad(premisas, resultado);

    expect(trazabilidad.esValido).toBe(false);
    expect(trazabilidad.totalPasos).toBe(0);
    expect(trazabilidad.conclusion).toContain("No se logro");
    expect(trazabilidad.pasos).toEqual([]);
  });
});

describe("obtenerPaso", () => {
  it("devuelve el paso correcto por numero", () => {
    const historial = crearHistorial();
    const P = crearVariable("P");
    const Q = crearVariable("Q");
    const premisas: NodoExpresion[] = [crearImplicacion(P, Q), P];

    registrarPaso(
      historial,
      {
        idPaso: "MODUS_PONENDO_PONENS",
        lineasInvolucradas: [1, 2],
        expresionResultante: Q,
        esConclusion: true,
      },
      premisas,
      []
    );

    const paso = obtenerPaso(historial, 1);
    expect(paso).toBeDefined();
    expect(paso?.numeroPaso).toBe(1);
  });

  it("devuelve undefined para un numero inexistente", () => {
    const historial = crearHistorial();
    expect(obtenerPaso(historial, 99)).toBeUndefined();
  });
});

describe("obtenerConclusiones", () => {
  it("filtra solo los pasos que son conclusion", () => {
    const historial = crearHistorial();
    const P = crearVariable("P");
    const Q = crearVariable("Q");
    const R = crearVariable("R");
    const premisas: NodoExpresion[] = [crearImplicacion(P, Q), P];

    registrarPaso(
      historial,
      {
        idPaso: "MODUS_PONENDO_PONENS",
        lineasInvolucradas: [1, 2],
        expresionResultante: Q,
        esConclusion: false,
      },
      premisas,
      []
    );
    registrarPaso(
      historial,
      {
        idPaso: "MODUS_PONENDO_PONENS",
        lineasInvolucradas: [3, 1],
        expresionResultante: R,
        esConclusion: true,
      },
      premisas,
      [
        {
          idPaso: "MODUS_PONENDO_PONENS",
          lineasInvolucradas: [1, 2],
          expresionResultante: Q,
          esConclusion: false,
        },
      ]
    );

    const conclusiones = obtenerConclusiones(historial);
    expect(conclusiones.length).toBe(1);
    expect(conclusiones[0].esConclusion).toBe(true);
    expect(conclusiones[0].numeroPaso).toBe(2);
  });
});
