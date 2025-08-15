/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OFFICIAL_LIVE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
