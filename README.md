# 🗺️ Mapa Conceptual

Dashboard interactivo para visualizar el avance de proyectos en 3 vistas:

- **🕸 Grafo** — Navegación visual de tareas y dependencias con vis-network
- **📋 Kanban** — Paneles movibles arrastrando tarjetas (SortableJS)
- **📃 Lista** — Vista tabular con columnas ordenables y filtros

## Cómo funciona

Cada proyecto expone su estado en un archivo JSON dentro de `data/projects/`. El dashboard lo lee y renderiza automáticamente.

### Agregar un proyecto nuevo

1. Crear `data/projects/<slug>.json` con el formato del schema
2. Agregar la entrada en `data/INDEX.json`
3. Pushear a `main` → se deploya solo

## Stack

- 100% estático — un solo `index.html`
- [vis-network](https://visjs.org/) para el grafo interactivo
- [SortableJS](https://sortablejs.github.io/Sortable/) para kanban drag & drop
- Sin build tools, sin servidor, sin dependencias externas

## Desarrollo local

Abrir `index.html` en cualquier navegador. No necesita servidor.

## Deploy

Automático a GitHub Pages con cada push a `main`.
