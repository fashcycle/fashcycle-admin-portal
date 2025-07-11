interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_API_KEY: string;
  readonly VITE_LOCAL_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
