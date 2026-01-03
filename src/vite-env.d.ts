/// <reference types="vite/client" />

declare module "vite/client" {
  interface ImportMetaEnv {
    readonly VITE_BERNARDBOT_API_URL?: string;
  }
}

