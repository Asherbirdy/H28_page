/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE: string
  readonly VITE_SERVER: string
  readonly VITE_PORT: string
  readonly VITE_API_MEETING: string
  readonly VITE_API_MEETING_DATA: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}