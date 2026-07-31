import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const teams = [
    { id: "fundamentos", name: "1. Fundamentos del Lenguaje", desc: "Enunciados vs Proposiciones, Valores de verdad." },
    { id: "tablas", name: "2. Conectivos y Tablas de Verdad", desc: "Funciones veritativas, tautología, contingencia." },
    { id: "condicionales", name: "3. Transformaciones Condicionales", desc: "Conversa, Inversa, Contrapositiva." },
    { id: "inferencias", name: "4. Inferencias Lógicas Básicas", desc: "Modus Ponens, Tollens, Silogismos." },
    { id: "derivaciones", name: "5. Validaciones y Derivaciones", desc: "Método abreviado, derivación formal." },
    { id: "conjuntos", name: "6. Teoría de Conjuntos", desc: "Diagramas de Venn, operaciones con conjuntos." },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="text-center space-y-4 pt-12">
          <h1 className="text-5xl font-extrabold tracking-tight text-blue-900">
            Lógica Simbólica Global
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Plataforma colaborativa desarrollada por el aula. Selecciona el módulo de tu equipo para comenzar a programar.
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Link key={team.id} href={`/${team.id}`} className="group block">
              <div className="h-full p-6 bg-white border border-neutral-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all space-y-4">
                <h2 className="text-xl font-bold text-neutral-800 group-hover:text-blue-700">
                  {team.name}
                </h2>
                <p className="text-neutral-500 text-sm">
                  {team.desc}
                </p>
                <Button variant="outline" className="w-full mt-4 group-hover:bg-blue-50">
                  Ir al módulo &rarr;
                </Button>
              </div>
            </Link>
          ))}
        </main>

        <footer className="text-center text-sm text-neutral-400 pt-12">
          Proyecto EO - Liderado por Enri - Fecha Límite: 21 de Agosto de 2026
        </footer>
      </div>
    </div>
  );
}
