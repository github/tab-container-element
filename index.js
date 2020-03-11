/* @flow strict */

export default class TabContainerElement extends HTMLElement {
  constructor() {
    super()

    this.addEventListener('keydown', (event: KeyboardEvent) => {
      const target = event.target
      if (!(target instanceof HTMLElement)) return
      if (target.getAttribute('role') !== 'tab' && !target.closest('[role="tablist"]')) return
      const tabs = Array.from(this.querySelectorAll('[role="tablist"] [role="tab"]'))
      const currentIndex = tabs.indexOf(tabs.find(tab => tab.matches('[aria-selected="true"]')))

      if (event.code === 'ArrowRight') {
        let index = currentIndex + 1
        if (index >= tabs.length) index = 0
        selectTab(this, index)
      } else if (event.code === 'ArrowLeft') {
        let index = currentIndex - 1
        if (index < 0) index = tabs.length - 1
        selectTab(this, index)
      } else if (event.code === 'Home') {
        selectTab(this, 0)
        event.preventDefault()
      } else if (event.code === 'End') {
        selectTab(this, tabs.length - 1)
        event.preventDefault()
      }
    })

    this.addEventListener('click', (event: MouseEvent) => {
      const tabs = Array.from(this.querySelectorAll('[role="tablist"] [role="tab"]'))

      if (!(event.target instanceof Element)) return
      const tab = event.target.closest('[role="tab"]')
      if (!tab || !tab.closest('[role="tablist"]')) return

      const index = tabs.indexOf(tab)
      selectTab(this, index)
    })
  }
}

function selectTab(tabContainer: TabContainerElement, index: number) {
  const tabs = tabContainer.querySelectorAll('[role="tablist"] [role="tab"]')
  const panels = tabContainer.querySelectorAll('[role="tabpanel"]')

  const selectedTab = tabs[index]
  const selectedPanel = panels[index]

  const cancelled = !tabContainer.dispatchEvent(
    new CustomEvent('tab-container-change', {
      bubbles: true,
      cancelable: true,
      detail: {relatedTarget: selectedPanel}
    })
  )
  if (cancelled) return

  for (const tab of tabs) {
    tab.setAttribute('aria-selected', 'false')
    tab.setAttribute('tabindex', '-1')
  }
  for (const panel of panels) {
    panel.hidden = true
  }

  selectedTab.setAttribute('aria-selected', 'true')
  selectedTab.removeAttribute('tabindex')
  selectedTab.focus()
  selectedPanel.hidden = false

  tabContainer.dispatchEvent(
    new CustomEvent('tab-container-changed', {
      bubbles: true,
      detail: {relatedTarget: selectedPanel}
    })
  )
}

if (!window.customElements.get('tab-container')) {
  window.TabContainerElement = TabContainerElement
  window.customElements.define('tab-container', TabContainerElement)
}
