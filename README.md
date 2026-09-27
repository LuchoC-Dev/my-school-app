# My School

> App mobile para estudiantes que organiza todo el trabajo académico — materias, proyectos, actividades y tareas — en un solo lugar, con vista de calendario.

---

## ¿Qué es My School?

My School es una app para iOS, Android y web pensada para que un estudiante tenga a mano todo lo que tiene que hacer en la cursada. El trabajo se organiza en una jerarquía simple: cada **materia** contiene **proyectos** opcionales (un TP largo, un parcial), **actividades** (entregas, exámenes, lecturas) y **tareas** (la unidad mínima de trabajo). Todo lo que tenga fecha aparece en el calendario.

Funciona 100% local: no hay backend, cuentas ni sincronización. Los datos quedan guardados en el dispositivo.

---

## ✨ Funcionalidades

- **Materias**: nombre, profesor, descripción, color identificatorio y horarios de cursada.
- **Proyectos, actividades y tareas** con fecha de entrega, estado, descripción o notas y material adjunto (links). Las actividades pueden pertenecer a un proyecto o ir sueltas en la materia; las tareas pueden pertenecer a una actividad o ir sueltas.
- **Progreso** de proyectos y actividades calculado a partir de sus tareas completadas.
- **Edición inline** desde las pantallas de detalle.
- **Calendario** con vistas de día, semana y mes; los ítems con fecha se muestran con el color de su materia.
- **Búsqueda global** con resaltado de coincidencias, filtros y contexto jerárquico (materia → actividad → tarea).
- **Ajustes**:
  - Perfil local (nombre y avatar).
  - Vista de calendario por defecto y día de inicio de la semana.
  - Preferencias de notificaciones.
  - Apariencia: tema claro / oscuro / sistema, color de acento, tipografía (manuscrita, serif o del sistema) y tamaño de fuente.
  - Idioma: español o inglés (se detecta el del dispositivo por defecto).
  - Cargar datos de prueba y borrar todos los datos.

> La exportación de datos y el envío real de notificaciones todavía no están implementados.

---

## 🛠️ Stack

| Área | Tecnología |
|------|------------|
| Framework | [Expo](https://expo.dev) SDK 54 · React Native 0.81 · React 19 |
| Lenguaje | TypeScript (modo `strict`) |
| Navegación | [Expo Router](https://docs.expo.dev/router/introduction/) (rutas basadas en archivos, typed routes) |
| Estado | [Zustand](https://github.com/pmndrs/zustand) con middleware `persist` |
| Persistencia | `expo-secure-store` en iOS/Android · `localStorage` en web |
| i18n | i18next + react-i18next + expo-localization |
| Tipografía | Caveat (`@expo-google-fonts/caveat`), Georgia y fuentes del sistema |
| Animaciones | react-native-reanimated |

---

## 📋 Requisitos previos

- [Node.js](https://nodejs.org) 20 o superior y npm
- La app **Expo Go** en el celular, o un emulador de Android / simulador de iOS
- Para builds nativos (`expo run:*`): Android Studio y/o Xcode

---

## 🚀 Instalación y setup

```bash
git clone https://github.com/LuchoC-Dev/my-school-app.git
cd my-school-app
npm install
```

> El repo incluye un `.npmrc` con `legacy-peer-deps=true`, necesario para resolver algunas dependencias.

No hace falta configurar variables de entorno.

### Correr la app

```bash
npm start          # Inicia Metro / Expo (escaneá el QR con Expo Go)
npm run web        # Abre la versión web en el navegador
npm run android    # Build nativo y ejecución en Android
npm run ios        # Build nativo y ejecución en iOS
```

Para explorar la app con contenido, andá a **Ajustes → Datos → Cargar datos de prueba**.

---

## 📁 Estructura del proyecto

```
my-school-app/
├── app/                    # Pantallas (Expo Router)
│   ├── (tabs)/             # Tabs principales: materias, actividades, calendario, ajustes, búsqueda
│   ├── courses/            # Crear, ver y editar materias
│   ├── projects/           # Crear y ver proyectos
│   ├── activities/         # Crear y ver actividades
│   ├── tasks/              # Crear y ver tareas
│   └── settings/           # Sub-pantallas de ajustes
├── src/
│   ├── components/         # Componentes UI y por dominio (calendar, courses, tasks, ...)
│   ├── stores/             # Stores de Zustand (entidades, tema, ajustes)
│   ├── repositories/       # Interfaces y repositorios de acceso a datos
│   ├── storage/            # Adaptador de almacenamiento (SecureStore / localStorage)
│   ├── theme/              # Tokens de color, tipografía y ThemeProvider
│   ├── i18n/               # Configuración de i18next y traducciones (es / en)
│   ├── hooks/              # useTheme, useSmartBack
│   ├── types/              # Tipos de las entidades
│   └── utils/              # Fechas, generación de IDs, datos de prueba
├── design/                 # Wireframes HTML de cada pantalla (abrir design/index.html)
└── docs/                   # Documentación funcional y de diseño
```

Los imports usan alias (`@/components`, `@/stores`, `@/theme`, etc.), definidos en `tsconfig.json` y `babel.config.js`.

### Arquitectura en pocas palabras

Las pantallas leen y modifican datos a través de **stores de Zustand**. Los stores delegan en **repositorios** (con interfaces `I*Repository`) que serializan las entidades a JSON y las guardan mediante un **adaptador de almacenamiento** que elige el backend según la plataforma. Esto permite cambiar la persistencia (por ejemplo, a SQLite) sin tocar las pantallas.

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [`docs/project.md`](./docs/project.md) | Visión general, stack, estado actual y alcance del MVP |
| [`docs/architecture.md`](./docs/architecture.md) | Jerarquía de datos, modelos, reglas de negocio y arquitectura técnica |
| [`docs/navigation.md`](./docs/navigation.md) | Estructura de navegación y flujos entre pantallas |
| [`docs/screens.md`](./docs/screens.md) | Inventario de pantallas con sus wireframes |
| [`docs/design-system.md`](./docs/design-system.md) | Tokens de color, temas y lineamientos visuales |
| [`TODO.md`](./TODO.md) | Tareas pendientes |
| [`design/index.html`](./design/index.html) | Índice navegable de los wireframes |

---

## 🤝 Contribución

1. Hacé un fork del repositorio.
2. Creá una rama para tu cambio: `git checkout -b feat/mi-cambio`.
3. Commiteá siguiendo [Conventional Commits](https://www.conventionalcommits.org/) (`feat(scope): ...`, `fix(scope): ...`), como en el resto del historial.
4. Abrí un Pull Request describiendo el cambio.
