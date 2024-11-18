/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_STEP_FUNCTION_URL: string;
    readonly VITE_APP_URL_API: string;
    readonly VITE_APP_USERPOOL_ID: string;
    readonly VITE_APP_USERPOOL_ID_Region: string;
    readonly VITE_APP_USERPOOL_ID_2: string;
    readonly VITE_APP_USERPOOL_ID_Region_2: string;
    // Add other VITE_APP_ variables here
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }