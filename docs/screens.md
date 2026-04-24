# Inventario de pantallas

Los wireframes están en `design/views/`. Leer el archivo correspondiente para ver el layout detallado.

## Courses

| Pantalla | Archivo | Descripción |
|---|---|---|
| Course List | `course-list.html` | Lista de materias con badges de pendientes/completadas |
| Course List Empty | `course-list-empty.html` | Sin materias — CTA prominente para crear la primera |
| Course Create | `course-create.html` | Form: nombre, profesor (opcional), color, horarios |
| Course View | `course-view.html` | Detalle de materia — projects y activities agrupados |

## Tasks

| Pantalla | Archivo | Descripción |
|---|---|---|
| Task List | `task-list.html` | Lista global de tasks con filtros por materia y activity |
| Task List Empty | `task-list-empty.html` | Sin tasks — aclara que pueden ir sueltas |
| Task View | `task-view.html` | Detalle de task |
| Task Create | `task-create.html` | Form: nombre, materia, activity (opcional), fecha |

## Activities

| Pantalla | Archivo | Descripción |
|---|---|---|
| Activity List | `activity-list.html` | Lista global de activities con filtros |
| Activity List Empty | `activity-list-empty.html` | Sin activities — explica diferencia con tasks |
| Activity View | `activity-view.html` | Detalle con tasks anidadas y progreso |
| Activity Create | `activity-create.html` | Form: nombre, materia, project (opcional), fecha |

## Projects

| Pantalla | Archivo | Descripción |
|---|---|---|
| Project List | `project-list.html` | Lista global de projects con progreso |
| Project List Empty | `project-list-empty.html` | Sin projects — tono suave, son opcionales |
| Project View | `project-view.html` | Detalle con activities y tasks agrupadas |
| Project Create | `project-create.html` | Form: nombre, materia, fecha |

## Calendar

| Pantalla | Archivo | Descripción |
|---|---|---|
| Calendar View | `calendar-view.html` | Vista principal (mes por defecto) |
| Calendar Empty | `calendar-empty.html` | Mes sin eventos — explica cómo se puebla |
| Calendar Day | `calendar-day.html` | Vista de día con timetable + tasks |
| Calendar Week | `calendar-week.html` | Vista semanal |
| Calendar Month | `calendar-month.html` | Vista mensual con dots de eventos |

## Search

| Pantalla | Archivo | Descripción |
|---|---|---|
| Search Results | `search.html` | Resultados con jerarquía visual indentada y highlight |
| Search Empty | `search-empty.html` | Sin query — recientes + vencen pronto |

## Settings

| Pantalla | Archivo | Descripción |
|---|---|---|
| Settings Main | `settings.html` | Lista de 5 secciones navegables |
| Settings Account | `settings-account.html` | Avatar + nombre editables (perfil local) |
| Settings General | `settings-general.html` | Configuraciones de calendario |
| Settings Notifications | `settings-notifications.html` | Toggles por tipo + días de anticipación |
| Settings Appearance | `settings-appearance.html` | Tema, color de acento, tipografía, tamaño de texto |

## Contenedor de tabs

| Pantalla | Archivo | Descripción |
|---|---|---|
| Activities Container | `activities-list.html` | Tab bar con Tasks / Activities / Projects |

## Pendiente

- **Onboarding** — bienvenida + crear primera materia. Definido como 3 pasos, no implementado aún
