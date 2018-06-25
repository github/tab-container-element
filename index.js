class CustomElementElement extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.textContent = '<custom-element>'
  }

  disconnectedCallback() {}
}

export default CustomElementElement

if (!window.customElements.get('custom-element')) {
  window.CustomElementElement = CustomElementElement
  window.customElements.define('custom-element', CustomElementElement)
}
