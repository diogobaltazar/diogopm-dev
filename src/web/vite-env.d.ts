/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH0_DOMAIN: string
  readonly VITE_AUTH0_CLIENT_ID: string
  readonly VITE_AUTH0_AUDIENCE: string
  readonly VITE_API_BASE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __APP_VERSION__: string

declare module 'world-atlas/countries-110m.json' {
  import type { Topology, GeometryCollection } from 'topojson-specification'
  const data: Topology<{ countries: GeometryCollection; land: GeometryCollection }>
  export default data
}
