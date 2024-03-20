import {TabContainerChangeEvent, TabContainerElement} from './tab-container-element.js'

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window
try {
  root.TabContainerElement = TabContainerElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}

type JSXBase = JSX.IntrinsicElements extends {span: unknown}
  ? JSX.IntrinsicElements
  : Record<string, Record<string, unknown>>
declare global {
  interface Window {
    TabContainerElement: typeof TabContainerElement
  }
  interface HTMLElementTagNameMap {
    'tab-container': TabContainerElement
  }
  namespace JSX {
    interface IntrinsicElements {
      ['tab-container']: JSXBase['span'] & Partial<Omit<TabContainerElement, keyof HTMLElement>>
    }
  }
  interface GlobalEventHandlersEventMap {
    'tab-container-change': TabContainerChangeEvent
    'tab-container-changed': TabContainerChangeEvent
  }
  interface ElementEventMap {
    'tab-container-change': TabContainerChangeEvent
    'tab-container-changed': TabContainerChangeEvent
  }
}

export default TabContainerElement
export * from './tab-container-element.js'
