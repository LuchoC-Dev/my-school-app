# Arquitectura de información

## Jerarquía de datos

```
Course (Materia)
└── Project (opcional — agrupa activities relacionadas)
    └── Activity
        └── Task
└── Activity (suelta, sin project)
    └── Task
└── Task (suelta, sin activity)
```

- Un **Course** contiene todo el trabajo de una materia
- Un **Project** es opcional. Agrupa activities de un trabajo largo (TP, parcial, etc.)
- Una **Activity** representa un trabajo o entrega. Puede tener tasks adentro o ir sola
- Una **Task** es la unidad mínima de trabajo. Puede pertenecer a una activity o ir suelta

## Modelos

### Course
| Campo | Tipo | Notas |
|---|---|---|
| id | string | uuid |
| name | string | requerido |
| teacher | string | opcional |
| color | string | hex, para identificación visual |
| schedule | Schedule[] | horarios de clase |

### Project
| Campo | Tipo | Notas |
|---|---|---|
| id | string | |
| courseId | string | FK → Course |
| name | string | |
| dueDate | date | opcional |
| description | string | opcional |

### Activity
| Campo | Tipo | Notas |
|---|---|---|
| id | string | |
| courseId | string | FK → Course |
| projectId | string | opcional, FK → Project |
| name | string | |
| dueDate | date | opcional |
| description | string | opcional |
| completed | boolean | |

### Task
| Campo | Tipo | Notas |
|---|---|---|
| id | string | |
| courseId | string | FK → Course |
| activityId | string | opcional, FK → Activity |
| name | string | |
| dueDate | date | opcional |
| completed | boolean | |

## Reglas de negocio

- Borrar un Course borra en cascada todos sus Projects, Activities y Tasks
- Borrar un Project NO borra sus Activities — quedan sueltas bajo el Course
- Borrar una Activity NO borra sus Tasks — quedan sueltas bajo el Course
- Una Task o Activity aparece en el calendario solo si tiene `dueDate`
- El progreso de un Project se calcula como tasks completadas / tasks totales
