/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DATABASE_URL: string
  readonly VITE_DATABASE_URL: string
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}