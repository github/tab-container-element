export default class TabContainerElement extends HTMLElement { }

declare global {
  interface Window {
    TabContainerElement: typeof TabContainerElement
  }
}
