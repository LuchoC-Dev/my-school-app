# My School — Proyecto

## Qué es

App para estudiantes que organiza el trabajo académico por materia: cada materia agrupa proyectos (opcionales), actividades y tareas. El objetivo es tener en un solo lugar todo lo que hay que hacer, con visibilidad en calendario.

Ver [`architecture.md`](./architecture.md) para la jerarquía de datos completa.

## Stack

| Área | Decisión |
|---|---|
| Framework | Expo SDK 54 · React Native 0.81 (New Architecture) · React 19 |
| Lenguaje | TypeScript en modo `strict` |
| Navegación | Expo Router (rutas basadas en archivos, `typedRoutes` habilitado) |
| Estado global | Zustand con middleware `persist` |
| Persistencia | Local: `expo-secure-store` en iOS/Android, `localStorage` en web |
| Componentes | Todo custom (`src/components/ui`), sin librería de componentes |
| Theming | `ThemeProvider` propio con tokens de color y tipografía |
| i18n | i18next + react-i18next, idiomas `es` y `en` |
| Plataformas | iOS, Android y web (compatible con Expo Go) |

## Estado actual

Implementado:

- CRUD de materias, proyectos, actividades y tareas, con edición inline en las vistas de detalle
- Calendario con vistas día / semana / mes
- Búsqueda global
- Settings: cuenta, calendario, notificaciones (solo preferencias), apariencia, idioma, datos de prueba y borrado total

Pendiente:

- Exportar datos (la opción existe en Settings pero no hace nada)
- Envío real de notificaciones
- Onboarding
- Mostrar proyectos en la vista semana del calendario (ver [`TODO.md`](../TODO.md))

## Fuera de scope (MVP)

- Autenticación / cuentas en la nube
- Sincronización entre dispositivos
- Múltiples perfiles
- Integraciones externas (Google Calendar, etc.)
