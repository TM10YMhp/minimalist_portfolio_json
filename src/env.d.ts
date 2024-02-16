/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly PH_API_KEY: string;
  readonly PH_INSTANCE_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
