# Navegación

La navegación usa Expo Router: cada archivo en `app/` es una ruta. `app/index.tsx` redirige a `/(tabs)`.

## Estructura general

```
Root (Stack — app/_layout.tsx)
├── (tabs)                          app/(tabs)/_layout.tsx, TabBar custom
│   ├── Materias      📚  /          → Course List
│   ├── Actividades   ✅  /activities → Contenedor Tasks / Activities / Projects
│   ├── Calendario    📅  /calendar   → Calendar
│   ├── Ajustes       ⚙️  /settings   → Settings Main
│   └── Búsqueda          /search     → oculta en la tab bar, pero muestra el footer
├── /courses/create, /courses/[id], /courses/edit/[id]
├── /projects/create, /projects/[id]
├── /activities/create, /activities/[id]
├── /tasks/create, /tasks/[id]
└── /settings/*  (account, general, notifications, appearance, language)
```

## Flujos por sección

### Courses
```
Course List (/)
├── → Course Create   (/courses/create)
└── → Course View     (/courses/[id])
    ├── → Course Edit       (/courses/edit/[id])
    ├── → Project / Activity View
    └── → Project / Activity Create
```

### Activities Container (/activities)
Tiene 3 sub-tabs internos: **Tasks · Activities · Projects**. El botón de crear navega al Create de la sub-tab activa.

```
Activities Container
├── [Tasks]       Task List      → /tasks/create, /tasks/[id]
├── [Activities]  Activity List  → /activities/create, /activities/[id]
│                                    └── → /tasks/create?activityId=…
└── [Projects]    Project List   → /projects/create, /projects/[id]
                                     └── → /activities/[id]
```

Las pantallas de detalle permiten editar inline. Task Create también se usa para editar (`/tasks/create?editId=…`).

### Calendar (/calendar)
Una sola pantalla con selector de vista **Día · Semana · Mes**. La vista inicial sale de Settings → General (por defecto: día). Tocar un día en la vista mes abre la vista día de esa fecha. Tocar un ítem navega a su detalle.

### Search (/search)
```
Task / Activity / Project List
└── → Search (link "Buscar en todo →" junto al search bar)
    ├── Estado vacío (sin query)
    └── Resultados
        └── → detalle de la task / activity / project
```

### Settings (/settings)
```
Settings Main
├── → Cuenta           (/settings/account)
├── → General          (/settings/general)       calendario
├── → Notificaciones   (/settings/notifications)
├── → Apariencia       (/settings/appearance)
├── → Idioma           (/settings/language)
├── Exportar datos     (sin implementar)
├── Cargar datos de prueba   (modal de confirmación)
└── Borrar todos los datos   (doble modal de confirmación)
```

## Patrones de navegación

### Back
Las sub-vistas muestran `‹ Volver` en el header. `useSmartBack` vuelve a la pantalla anterior o, si no hay historial (por ejemplo tras recargar en web), a una ruta de fallback.

### Empty states
Cada lista tiene su empty state. El CTA navega al Create de esa entidad.

### Search local vs global
- Cada lista tiene un search bar local que filtra solo esa lista
- El link "Buscar en todo →" abre la búsqueda global, que muestra resultados de todas las entidades con jerarquía y resaltado

### Modales y bottom sheets
- `ConfirmModal`: confirmación de acciones destructivas (borrar entidades o todos los datos) y carga de datos de prueba
- `BottomSheet` / `DatePickerModal`: selectores dentro de los forms (fecha, materia, etc.)
