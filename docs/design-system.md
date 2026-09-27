# Sistema de diseño

## Tokens de color

Los colores se definen como tokens semánticos en `src/theme/tokens.ts` (`ColorTokens`), con un valor para tema claro y otro para oscuro. `ThemeProvider` (`src/theme/ThemeContext.tsx`) resuelve el tema activo y los componentes los leen con `useTheme()`.

### Tokens base
| Token | Rol | Claro | Oscuro |
|---|---|---|---|
| `background` | Fondo general de la app | `#F5F0E8` | `#1A1510` |
| `surface` | Fondo de cards, tab bar | `#FFFFFF` | `#2A2016` |
| `surfaceAlt` | Fondo de campos seleccionados / activos | `#EDE8DF` | `#332A1E` |
| `border` | Bordes de inputs, chips, separadores normales | `#C8BFB0` | `#4A3F32` |
| `borderLight` | Separadores suaves | `#E0D9CE` | `#3D3228` |
| `textPrimary` | Texto principal | `#2A2016` | `#F5F0E8` |
| `textSecondary` | Labels, placeholders, metadata | `#7A6F62` | `#A89880` |
| `textBody` | Texto de cuerpo secundario | `#4A4035` | `#C8BBAA` |
| `textInverse` | Texto sobre fondos oscuros (ej: botón primario) | `#FFFFFF` | `#2A2016` |
| `destructive` | Texto y bordes de acciones irreversibles | `#D94040` | `#F07070` |
| `warning` / `warningLight` | Avisos y fechas próximas a vencer | `#B45309` / `#FEF3C7` | `#FBBF24` / `#3D2E00` |
| `accent` / `accentLight` | Acento global de la UI | ver abajo | ver abajo |

### Acento global
En Settings → Apariencia el usuario elige el color de acento de la UI (botones, elementos activos, links) entre 7 opciones. `ThemeProvider` pisa `accent` con el color elegido y `accentLight` con su versión pastel precalculada. Por defecto: naranja `#D4753A`.

### Colores por materia
Cada materia tiene un color elegido al crearla, independiente del acento global. Se definen en `courseColors` (`src/theme/tokens.ts`):

| Color | `accent` | `accentLight` |
|---|---|---|
| orange | `#D97B3A` | `#F5E0CC` |
| blue | `#3A7BD9` | `#CCE0F5` |
| violet | `#7B3AD9` | `#E0CCF5` |
| green | `#3AD97B` | `#CCF5E0` |

## Temas

Tres opciones en Settings → Apariencia: **Claro · Oscuro · Sistema** (por defecto: Sistema). Se guarda en `themeStore`. El fondo del root se pinta con el token `background` para evitar el flash blanco al cargar.

## Tipografía

### Font themes
La familia se elige en Settings → Apariencia y se resuelve en `src/theme/fontTokens.ts` a roles semánticos (`heading`, `body`, `label`, `caption`, `mono`), accesibles con `useFontTokens()`:

| Opción | Headings | Body | UI (labels) |
|---|---|---|---|
| Manuscrita (por defecto) | Caveat Bold | Caveat Regular | Caveat Regular |
| Serif | Georgia | Georgia | sistema |
| Sistema | sistema | sistema | sistema |

### Escala
Definida en `src/theme/typography.ts` y aplicada por `ThemedText` según su `variant`. Todos los tamaños se multiplican por el tamaño de texto elegido por el usuario (`fontScale`, 0.85–1.2).

| Variant | Tamaño | Peso | Fuente |
|---|---|---|---|
| `title` | 26 | 700 | heading |
| `card` | 20 | 700 | heading |
| `body` | 17 | 400 | body |
| `metadata` | 14 | 400 | body |
| `section-label` | 12 | 700, uppercase, letter-spacing 0.4 | heading |

## Componentes recurrentes

Los componentes base viven en `src/components/ui` (`Button`, `Chip`, `ChipRow`, `Checkbox`, `ProgressBar`, `SearchBar`, `EmptyState`, `SectionLabel`, `Separator`, `ConfirmModal`, `BottomSheet`, `DatePickerModal`, `CustomCalendar`, `MaterialSection`, `ThemedText`).

### Tab bar (navegación principal)
4 tabs fijos: **Materias** 📚 · **Actividades** ✅ · **Calendario** 📅 · **Ajustes** ⚙️ (`src/components/navigation/TabBar.tsx`). La tab activa se marca con `accent`.

### Header de pantalla
```
[Título con ícono]        [Botón icónico opcional]
```
Padding 10 14. Título con `ThemedText variant="title"` (`src/components/navigation/AppHeader.tsx`).

### Section label
`ThemedText variant="section-label"` en `textSecondary`.

### Separadores
- Sólido: 1px `borderLight`, margen horizontal 14
- Dashed: 1px dashed `border`, margen horizontal 14

### Chips de filtro
Border-radius pill, borde 1.5px. Activo: fondo `textPrimary`, texto `textInverse`. Inactivo: borde `border`, texto `textBody`.

### Tags de tipo
Border-radius pill, borde 1.5px, sin fondo. Color según el acento de la materia.

### Botón primario
Fondo `textPrimary`, texto `textInverse`, border-radius 10, padding 12, full width.

### Botón secundario / dashed
Borde dashed `border`, border-radius pill, texto `textSecondary`. Para acciones opcionales.

### Toggle
On: fondo `textPrimary`. Off: fondo `border`.

### Search bar
Border-radius pill, borde 1.5px `border`. Con link "Buscar en todo →" al lado en `accent`.

### Empty state
Ícono grande centrado + título bold + descripción en `textSecondary` + CTA.
- CTA botón primario si la acción es obligatoria (ej: crear primera materia)
- CTA dashed si es opcional (ej: crear project)

### Checkbox de task
Círculo 17×17. Completado: fondo `textPrimary` con ✓ en `textInverse`.

### Progress bar
3px alto, fondo `borderLight`, relleno `accent`, border-radius pill.
