/// <reference types="nuxt" />
/// <reference types="nuxt/auto-imports" />
/// <reference types="nuxt/nuxt" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
