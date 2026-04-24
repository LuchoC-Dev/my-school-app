# Sistema de diseño

## Tokens de color

Los colores se definen como tokens semánticos. El valor concreto de cada token depende del tema activo (claro / oscuro / sistema). El agente de implementación debe mapear estos tokens al sistema de theming elegido (ej: React Native Paper themes, styled-components ThemeProvider, o un Context propio).

### Tokens base
| Token | Rol |
|---|---|
| `color.background` | Fondo general de la app |
| `color.surface` | Fondo de cards, tab bar |
| `color.surface.alt` | Fondo de campos seleccionados / activos |
| `color.border` | Bordes de inputs, chips, separadores normales |
| `color.border.light` | Separadores suaves |
| `color.text.primary` | Texto principal |
| `color.text.secondary` | Labels, placeholders, metadata |
| `color.text.body` | Texto de cuerpo secundario |
| `color.text.inverse` | Texto sobre fondos oscuros (ej: botón primario) |
| `color.destructive` | Acciones destructivas |

### Tokens de acento (materias)
Cada materia tiene un color asignado por el usuario al crearla. Los tokens de acento se derivan de ese color:

| Token | Rol |
|---|---|
| `color.accent` | Color principal del acento |
| `color.accent.light` | Versión de fondo suave (para badges, chips) |

Los colores disponibles para elegir al crear una materia son: naranja, azul, violeta, verde (4 opciones en el MVP).

### Token de acento global
En Settings → Apariencia el usuario puede cambiar el color de acento global de la UI (botones, elementos activos, links). Este es independiente del color por materia.

### Token destructivo
| Token | Rol |
|---|---|
| `color.destructive` | Texto y bordes de acciones irreversibles |

## Temas

Tres opciones configurables en Settings → Apariencia: **Claro · Oscuro · Sistema**.

Los wireframes están diseñados en tema claro. Los valores concretos de cada token por tema los define el agente de implementación al elegir la librería de theming.

## Tipografía

- **Fuente principal**: Caveat (Google Fonts) — handwritten
- **Alternativas configurables**: Georgia (serif), fuente del sistema (sans-serif)
- La fuente activa se configura en Settings → Apariencia

### Escala
| Rol | Tamaño | Peso |
|---|---|---|
| Screen title | 19 | 700 |
| Card title | 15 | 700 |
| Body / list item | 13 | 400–600 |
| Metadata / labels | 10–11 | 400–700 |
| Section label | 10 | 700, uppercase, letter-spacing 0.4px |

## Componentes recurrentes

### Tab bar (navegación principal)
3 tabs fijos: **Materias** 🏫 · **Actividades** 📋 · **Calendario** 📅

### Header de pantalla
```
[Título con ícono]        [Botón icónico opcional]
```
Padding 10 14. Título en screen title.

### Section label
Texto 10px, uppercase, bold, `color.text.secondary`, letter-spacing 0.4px.

### Separadores
- Sólido: 1px `color.border.light`, margen horizontal 14
- Dashed: 1px dashed `color.border`, margen horizontal 14

### Chips de filtro
Border-radius pill, borde 1.5px. Activo: fondo `color.text.primary`, texto `color.text.inverse`. Inactivo: borde `color.border`, texto `color.text.body`.

### Tags de tipo
Border-radius pill, borde 1.5px, sin fondo. Color según el acento de la materia.

### Botón primario
Fondo `color.text.primary`, texto `color.text.inverse`, border-radius 10, padding 12, full width.

### Botón secundario / dashed
Borde dashed `color.border`, border-radius pill, texto `color.text.secondary`. Para acciones opcionales.

### Toggle
On: fondo `color.text.primary`. Off: fondo `color.border`.

### Search bar
Border-radius pill, borde 1.5px `color.border`. Con link "Buscar en todo →" al lado en `color.accent`.

### Empty state
Ícono grande centrado + título bold + descripción en `color.text.secondary` + CTA.
- CTA botón primario si la acción es obligatoria (ej: crear primera materia)
- CTA dashed si es opcional (ej: crear project)

### Checkbox de task
Círculo 17×17. Completado: fondo `color.text.primary` con ✓ en `color.text.inverse`.

### Progress bar
3px alto, fondo `color.border.light`, relleno `color.accent`, border-radius pill.
