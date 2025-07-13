// types/nuxt.d.ts
declare global {
  function definePageMeta(meta: {
    middleware?: string | string[];
    layout?: string;
    title?: string;
    [key: string]: any;
  }): void;
}

export {};
