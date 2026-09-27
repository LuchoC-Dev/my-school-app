# Arquitectura

## Jerarquía de datos

```
Course (Materia)
├── Project (opcional — agrupa activities relacionadas)
│   └── Activity
│       └── Task
└── Activity (suelta, sin project)
    └── Task

Task (suelta, sin activity ni materia)
```

- Un **Course** contiene todo el trabajo de una materia
- Un **Project** es opcional. Agrupa activities de un trabajo largo (TP, parcial, etc.)
- Una **Activity** representa un trabajo o entrega. Siempre pertenece a un Course y opcionalmente a un Project
- Una **Task** es la unidad mínima de trabajo. Puede pertenecer a una Activity o ir suelta. No tiene relación directa con Course: su materia se deduce a través de la Activity

## Modelos

Definidos en `src/types/entities.ts`. Todas las entidades tienen `id` (generado con `expo-crypto`), `createdAt` y `updatedAt` (ISO strings).

### Course
| Campo | Tipo | Notas |
|---|---|---|
| name | string | requerido |
| description | string | opcional |
| professor | string | opcional |
| color | `"orange" \| "blue" \| "violet" \| "green"` | se mapea a colores en `src/theme/tokens.ts` |
| emoji | string | opcional |
| schedules | `CourseSchedule[]` | `{ day: "Lu"…"Do", from: "HH:MM", to: "HH:MM" }` |

### Project
| Campo | Tipo | Notas |
|---|---|---|
| courseId | string | FK → Course |
| name | string | requerido |
| description | string | opcional |
| status | `Status` | `"pending" \| "in_progress" \| "completed"` |
| dueDate | string | opcional |
| links | `MaterialLink[]` | opcional |

### Activity
| Campo | Tipo | Notas |
|---|---|---|
| courseId | string | FK → Course, requerido |
| projectId | string | opcional, FK → Project |
| name | string | requerido |
| description | string | opcional |
| type | `ActivityType` | `"assignment" \| "exam" \| "project" \| "reading" \| "other"` |
| status | `Status` | |
| dueDate | string | opcional |
| progress | number | 0–1, calculado a partir de sus tasks |
| links | `MaterialLink[]` | opcional |

### Task
| Campo | Tipo | Notas |
|---|---|---|
| activityId | string | opcional, FK → Activity |
| title | string | requerido |
| completed | boolean | |
| order | number | posición dentro de su activity |
| dueDate | string | opcional |
| notes | string | opcional |
| links | `MaterialLink[]` | opcional |

### MaterialLink
Material adjunto a projects, activities y tasks: `{ label, url, type: "link" | "file", mimeType? }`.

## Reglas de negocio

- Borrar un Course borra en cascada sus Projects, sus Activities y las Tasks de esas Activities
- Borrar una Activity borra en cascada sus Tasks
- Borrar un Project NO borra sus Activities
- El progreso de una Activity es `tasks completadas / tasks totales` y se recalcula al crear, editar o borrar una Task
- El progreso de un Project se muestra como `activities completadas / activities totales`
- Un ítem aparece en el calendario solo si tiene `dueDate`

## Arquitectura técnica

```
Pantallas (app/)  →  Stores Zustand (src/stores)  →  Repositorios (src/repositories)  →  storageAdapter (src/storage)
```

- **Pantallas** (`app/`): rutas de Expo Router. Leen y modifican datos solo a través de los stores.
- **Stores** (`src/stores`): un store por entidad (`courseStore`, `projectStore`, `activityStore`, `taskStore`) más `settingsStore` y `themeStore`. Exponen `add`, `update`, `remove` y selectores (`getById`, `getByCourseId`, …). Implementan las cascadas y el recálculo de progreso. Se persisten con `persist` de Zustand.
- **Repositorios** (`src/repositories`): cada entidad tiene una interfaz `I*Repository` (extiende `IRepository<T>` con `getAll`, `getById`, `create`, `update`, `delete`) y una implementación que guarda la colección como JSON bajo una clave (`_raw_courses`, etc.). Cambiar de persistencia (por ejemplo a SQLite) implica solo nuevas implementaciones.
- **storageAdapter** (`src/storage/storageAdapter.ts`): implementa `StateStorage` de Zustand y elige `expo-secure-store` en mobile o `localStorage` en web.

### Otros módulos

| Carpeta | Contenido |
|---|---|
| `src/theme` | Tokens de color claro/oscuro, colores por materia, tipografía, font themes y `ThemeProvider` |
| `src/hooks` | `useTheme` / `useFontTokens` y `useSmartBack` (volver atrás aunque se haya recargado la página en web) |
| `src/i18n` | Inicialización de i18next y traducciones en `locales/es.ts` y `locales/en.ts` |
| `src/utils` | Fechas (`dateUtils`), IDs (`generateId`) y datos de prueba (`seedData`) |
| `src/components` | `ui/` (componentes base) y componentes por dominio: `calendar`, `courses`, `activities`, `projects`, `tasks`, `navigation` |

Los imports usan alias `@/…` configurados en `tsconfig.json` y `babel.config.js`.
