/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_STEP_FUNCTION_URL: string;
    readonly VITE_APP_URL_API: string;
    // Add other VITE_APP_ variables here
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }