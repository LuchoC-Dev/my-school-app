# Navegación

## Estructura general

```
Root
├── Tab: Materias       → Course List
├── Tab: Actividades    → Activities Container (Tasks / Activities / Projects)
└── Tab: Calendario     → Calendar View
```

Settings no tiene tab propio — se accede desde un ícono en alguna pantalla (a definir en implementación, probablemente en Course List o como pantalla modal).

## Flujos por sección

### Courses
```
Course List
├── → Course Create       (botón "Nueva materia" o card dashed)
└── → Course View         (tap en card)
```

### Activities Container
El tab Actividades tiene 3 sub-tabs internos: **Tasks · Activities · Projects**

```
Activities Container
├── [Tab Tasks]
│   ├── Task List / Task List Empty
│   ├── → Task Create     (FAB o botón)
│   └── → Task View       (tap en row)
├── [Tab Activities]
│   ├── Activity List / Activity List Empty
│   ├── → Activity Create (FAB o botón)
│   └── → Activity View   (tap en card)
│       └── → Task Create (dentro de activity)
└── [Tab Projects]
    ├── Project List / Project List Empty
    ├── → Project Create  (FAB o botón)
    └── → Project View    (tap en card)
        └── → Activity View (tap en activity)
```

### Calendar
```
Calendar View (mes por defecto)
├── → Calendar Day        (tap en día)
├── → Calendar Week       (selector de vista)
└── → Calendar Month      (selector de vista)
```

### Search
```
Cualquier List view
└── → Search (via link "Buscar en todo →" en el search bar)
    ├── Search Empty      (estado inicial)
    └── Search Results    (con query activo)
        └── → [vista correspondiente al resultado]
```

### Settings
```
Settings Main
├── → Settings Account
├── → Settings General
├── → Settings Notifications
├── → Settings Appearance
├── Exportar datos        (bottom sheet de confirmación)
└── Borrar todos los datos (bottom sheet destructivo con confirmación)
```

## Patrones de navegación

### Back
Cada sub-vista muestra `‹` o `‹ Volver` en el header superior izquierdo.

### Empty states
Cada list view tiene su empty state correspondiente. El CTA del empty state navega al Create de esa entidad.

### Search local vs global
- Cada lista tiene un search bar local (filtra solo esa lista)
- El link "Buscar en todo →" al lado del search bar abre la búsqueda global
- La búsqueda global muestra resultados de todas las entidades con jerarquía visual indentada

### Bottom sheets
Se usan para:
- Confirmación de acciones destructivas (borrar datos)
- Selectores rápidos dentro de forms (fecha, materia, etc.)
