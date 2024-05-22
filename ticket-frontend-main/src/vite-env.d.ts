/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SYSTEM_CLUSTER_NODES: string
  readonly VITE_AUTH_SERVER_FT4_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
