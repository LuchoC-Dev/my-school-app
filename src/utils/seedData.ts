import { useCourseStore } from "@/stores/courseStore";
import { useActivityStore } from "@/stores/activityStore";
import { useProjectStore } from "@/stores/projectStore";
import { useTaskStore } from "@/stores/taskStore";

/**
 * Popula los stores con datos de prueba realistas.
 * Se puede llamar desde el botón en Settings > Datos.
 */
export async function seedData() {
  const addCourse = useCourseStore.getState().add;
  const addActivity = useActivityStore.getState().add;
  const addProject = useProjectStore.getState().add;
  const addTask = useTaskStore.getState().add;

  // ── Materias ────────────────────────────────────────────────
  const matematica = await addCourse({
    name: "Matemática II",
    emoji: "📐",
    professor: "Prof. García",
    description: "Cálculo diferencial e integral. Ecuaciones diferenciales.",
    color: "blue",
    schedules: [
      { day: "Lu", from: "08:00", to: "10:00" },
      { day: "Mi", from: "08:00", to: "10:00" },
    ],
  });

  const programacion = await addCourse({
    name: "Programación III",
    emoji: "💻",
    professor: "Prof. López",
    description: "Estructuras de datos, algoritmos y complejidad.",
    color: "violet",
    schedules: [
      { day: "Ma", from: "10:00", to: "12:00" },
      { day: "Ju", from: "10:00", to: "12:00" },
    ],
  });

  const fisica = await addCourse({
    name: "Física",
    emoji: "⚛️",
    professor: "Prof. Ramírez",
    description: "Mecánica clásica y termodinámica.",
    color: "orange",
    schedules: [
      { day: "Vi", from: "14:00", to: "17:00" },
    ],
  });

  const ingles = await addCourse({
    name: "Inglés Técnico",
    emoji: "🌐",
    professor: "Prof. Smith",
    color: "green",
    schedules: [
      { day: "Mi", from: "16:00", to: "18:00" },
    ],
  });

  // ── Actividades sueltas ────────────────────────────────────
  const parcialMat = await addActivity({
    courseId: matematica.id,
    name: "Parcial 1 — Derivadas",
    type: "exam",
    status: "pending",
    dueDate: offsetDate(10),
    progress: 0,
  });

  const tpFisica = await addActivity({
    courseId: fisica.id,
    name: "TP: Movimiento armónico",
    type: "assignment",
    status: "in_progress",
    dueDate: offsetDate(5),
    progress: 0,
  });

  const lecturaIngles = await addActivity({
    courseId: ingles.id,
    name: "Reading: Technical Documentation",
    type: "reading",
    status: "pending",
    dueDate: offsetDate(3),
    progress: 0,
  });

  const examenFisica = await addActivity({
    courseId: fisica.id,
    name: "Final — Termodinámica",
    type: "exam",
    status: "pending",
    dueDate: offsetDate(20),
    progress: 0,
  });

  const tpCompletado = await addActivity({
    courseId: matematica.id,
    name: "Guía de ejercicios — Integrales",
    type: "assignment",
    status: "completed",
    dueDate: offsetDate(-5),
    progress: 1,
  });

  // ── Proyecto ───────────────────────────────────────────────
  const proyecto = await addProject({
    courseId: programacion.id,
    name: "TP Final — Árbol AVL",
    description: "Implementar un árbol AVL con inserción, eliminación y búsqueda. Incluye informe.",
    status: "in_progress",
    dueDate: offsetDate(14),
  });

  // Actividades del proyecto
  const actDiseno = await addActivity({
    courseId: programacion.id,
    projectId: proyecto.id,
    name: "Diseño de la estructura",
    type: "project",
    status: "completed",
    progress: 1,
  });

  const actImpl = await addActivity({
    courseId: programacion.id,
    projectId: proyecto.id,
    name: "Implementación en C++",
    type: "project",
    status: "in_progress",
    dueDate: offsetDate(7),
    progress: 0,
  });

  const actInforme = await addActivity({
    courseId: programacion.id,
    projectId: proyecto.id,
    name: "Informe final",
    type: "assignment",
    status: "pending",
    dueDate: offsetDate(14),
    progress: 0,
  });

  // ── Tasks ──────────────────────────────────────────────────
  // Tasks del parcial de matemática
  await addTask({ activityId: parcialMat.id, title: "Repasar regla de la cadena", completed: true, order: 0 });
  await addTask({ activityId: parcialMat.id, title: "Repasar derivadas implícitas", completed: true, order: 1 });
  await addTask({ activityId: parcialMat.id, title: "Hacer ejercicios del capítulo 5", completed: false, order: 2, dueDate: offsetDate(7) });
  await addTask({ activityId: parcialMat.id, title: "Repasar con apuntes del teórico", completed: false, order: 3 });

  // Tasks del TP de física
  await addTask({ activityId: tpFisica.id, title: "Plantear ecuaciones del sistema", completed: true, order: 0 });
  await addTask({ activityId: tpFisica.id, title: "Resolver analíticamente", completed: false, order: 1 });
  await addTask({ activityId: tpFisica.id, title: "Graficar en Python", completed: false, order: 2 });
  await addTask({ activityId: tpFisica.id, title: "Redactar conclusión", completed: false, order: 3, dueDate: offsetDate(5) });

  // Tasks de la lectura de inglés
  await addTask({ activityId: lecturaIngles.id, title: "Leer secciones 1–3", completed: false, order: 0 });
  await addTask({ activityId: lecturaIngles.id, title: "Glosario de términos técnicos", completed: false, order: 1 });
  await addTask({ activityId: lecturaIngles.id, title: "Responder preguntas de comprensión", completed: false, order: 2 });

  // Tasks de la implementación del AVL
  await addTask({ activityId: actImpl.id, title: "Nodo con altura y factor de balance", completed: true, order: 0 });
  await addTask({ activityId: actImpl.id, title: "Rotación simple izquierda/derecha", completed: true, order: 1 });
  await addTask({ activityId: actImpl.id, title: "Rotación doble", completed: false, order: 2 });
  await addTask({ activityId: actImpl.id, title: "Inserción con rebalanceo", completed: false, order: 3 });
  await addTask({ activityId: actImpl.id, title: "Eliminación con rebalanceo", completed: false, order: 4 });
  await addTask({ activityId: actImpl.id, title: "Tests unitarios", completed: false, order: 5, dueDate: offsetDate(7) });

  // Tasks del informe
  await addTask({ activityId: actInforme.id, title: "Introducción y marco teórico", completed: false, order: 0 });
  await addTask({ activityId: actInforme.id, title: "Descripción del algoritmo", completed: false, order: 1 });
  await addTask({ activityId: actInforme.id, title: "Análisis de complejidad", completed: false, order: 2 });
  await addTask({ activityId: actInforme.id, title: "Conclusión", completed: false, order: 3 });
}

/** Retorna fecha ISO YYYY-MM-DD con offset en días desde hoy */
function offsetDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}
