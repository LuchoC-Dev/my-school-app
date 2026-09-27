# Inventario de pantallas

Los wireframes están en `design/views/` (índice navegable en `design/index.html`). La columna **Ruta** indica dónde está implementada cada pantalla en `app/`. Los wireframes son la referencia de diseño original; la implementación puede diferir en detalles.

## Courses

| Pantalla | Archivo | Ruta | Descripción |
|---|---|---|---|
| Course List | `course-list.html` | `/` — `app/(tabs)/index.tsx` | Lista de materias con badges de pendientes/completadas |
| Course List Empty | `course-list-empty.html` | `/` (sin materias) | Sin materias — CTA prominente para crear la primera |
| Course Create | `course-create.html` | `/courses/create` | Form: nombre, profesor y descripción (opcionales), color, horarios |
| Course Edit | — | `/courses/edit/[id]` | Mismo form que Create, precargado |
| Course View | `course-view.html` | `/courses/[id]` | Detalle de materia — projects y activities agrupados |

## Tasks

| Pantalla | Archivo | Ruta | Descripción |
|---|---|---|---|
| Task List | `task-list.html` | `/activities` — sub-tab Tasks | Lista global de tasks con filtros por materia y activity |
| Task List Empty | `task-list-empty.html` | `/activities` — sub-tab Tasks | Sin tasks — aclara que pueden ir sueltas |
| Task View | `task-view.html` | `/tasks/[id]` | Detalle de task |
| Task Create | `task-create.html` | `/tasks/create` | Form: título, activity (opcional), fecha, notas, material. También edita con `?editId=` |

## Activities

| Pantalla | Archivo | Ruta | Descripción |
|---|---|---|---|
| Activity List | `activity-list.html` | `/activities` — sub-tab Activities | Lista global de activities con filtros |
| Activity List Empty | `activity-list-empty.html` | `/activities` — sub-tab Activities | Sin activities — explica diferencia con tasks |
| Activity View | `activity-view.html` | `/activities/[id]` | Detalle con tasks anidadas y progreso |
| Activity Create | `activity-create.html` | `/activities/create` | Form: nombre, materia, project (opcional), tipo, fecha, descripción, material |

## Projects

| Pantalla | Archivo | Ruta | Descripción |
|---|---|---|---|
| Project List | `project-list.html` | `/activities` — sub-tab Projects | Lista global de projects con progreso |
| Project List Empty | `project-list-empty.html` | `/activities` — sub-tab Projects | Sin projects — tono suave, son opcionales |
| Project View | `project-view.html` | `/projects/[id]` | Detalle con activities y tasks agrupadas |
| Project Create | `project-create.html` | `/projects/create` | Form: nombre, materia, fecha |

## Calendar

| Pantalla | Archivo | Ruta | Descripción |
|---|---|---|---|
| Calendar View | `calendar-view.html` | `/calendar` | Vista principal con selector Día / Semana / Mes (inicial según Settings → General) |
| Calendar Empty | `calendar-empty.html` | `/calendar` | Mes sin eventos — explica cómo se puebla |
| Calendar Day | `calendar-day.html` | `/calendar` — vista Día | Vista de día con timetable + tasks |
| Calendar Week | `calendar-week.html` | `/calendar` — vista Semana | Vista semanal |
| Calendar Month | `calendar-month.html` | `/calendar` — vista Mes | Vista mensual con dots de eventos |

## Search

| Pantalla | Archivo | Ruta | Descripción |
|---|---|---|---|
| Search Results | `search.html` | `/search` | Resultados con jerarquía visual indentada y highlight |
| Search Empty | `search-empty.html` | `/search` | Sin query — recientes + vencen pronto |

## Settings

| Pantalla | Archivo | Ruta | Descripción |
|---|---|---|---|
| Settings Main | `settings.html` | `/settings` | Secciones navegables + acciones de datos (exportar, datos de prueba, borrar todo) |
| Settings Account | `settings-account.html` | `/settings/account` | Avatar + nombre editables (perfil local) |
| Settings General | `settings-general.html` | `/settings/general` | Configuraciones de calendario |
| Settings Notifications | `settings-notifications.html` | `/settings/notifications` | Toggles por tipo + días de anticipación |
| Settings Appearance | `settings-appearance.html` | `/settings/appearance` | Tema, color de acento, tipografía, tamaño de texto |
| Settings Language | — | `/settings/language` | Español / English |

## Contenedor de tabs

| Pantalla | Archivo | Ruta | Descripción |
|---|---|---|---|
| Activities Container | `activities-list.html` | `/activities` | Tab bar con Tasks / Activities / Projects |

## Pendiente

- **Onboarding** — bienvenida + crear primera materia. Definido como 3 pasos, no implementado aún
- **Exportar datos** — la opción aparece en Settings pero todavía no hace nada
