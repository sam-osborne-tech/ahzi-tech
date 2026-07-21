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

## Photography

Backdrop and inset photos are free-license, self-hosted in `public/photos/`, and processed into the site's duotone treatment:

- `operations-containers.webp`: "Multicolored containers" by Hakan Dahlstrom, CC BY 2.0, via Openverse/Flickr
- `document-archive.webp`: "Documents stacks in a repository at The National Archives" by The National Archives UK, CC BY, via Wikimedia Commons
- `enterprise-racks.webp`: "San Antonio data center" by Robert Scoble, CC BY 2.0, via Openverse/Flickr
- `build-terminal.webp`: "julia vim editing terminal" by cormullion, CC0, via Openverse/Flickr
