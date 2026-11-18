
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TESTIMONIO_VIDEO_URL?: string;
  readonly VITE_TESTIMONIO_POSTER_URL?: string;
  readonly VITE_TESTIMONIO_SUBTITULOS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
