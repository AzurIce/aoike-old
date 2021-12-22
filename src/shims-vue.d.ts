/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'markdown-it-katex';
declare module 'markdown-it-highlightjs';
declare module 'markdown-it-textual-uml';