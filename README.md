# Ahzi Tech

A React site for Ahzi's forward-deployed enterprise AI consulting.

## Stack

- React with Vite
- Tailwind CSS v4
- shadcn/ui-style owned components
- Motion for interface animation
- Lucide icons

## Commands

```bash
npm run dev
npm run lint
npm run build
```

## Deployment

Production is served by GitHub Pages at `https://ahzi.tech`; Squarespace manages the domain and DNS.

The `main` branch deploys through the Pages workflow. Run `npm run build` before release; the static output is written to `dist/`.
