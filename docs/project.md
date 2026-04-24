# My School — Proyecto

## Qué es

App mobile para estudiantes que organiza el trabajo académico en una jerarquía de tres niveles: materias → actividades → tareas. El objetivo es tener en un solo lugar todo lo que hay que hacer, con visibilidad en calendario.

## Stack

- **React Native** (sin Expo por defecto, a confirmar)
- **Almacenamiento local** — sin backend ni autenticación en el MVP
- **Plataformas objetivo** — iOS y Android

## Fuera de scope (MVP)

- Autenticación / cuentas en la nube
- Sincronización entre dispositivos
- Múltiples perfiles
- Onboarding (pendiente para siguiente iteración)
- Integraciones externas (Google Calendar, etc.)

## Pendiente de decisión técnica

- Librería de navegación (React Navigation recomendado)
- Solución de estado global (Zustand / Context API)
- ORM / persistencia local (MMKV, AsyncStorage, SQLite)
- Librería de componentes base o todo custom
