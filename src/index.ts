function getTabs(el: TabContainerElement): HTMLElement[] {
  return Array.from(el.querySelectorAll<HTMLElement>('[role="tablist"] [role="tab"]')).filter(
    tab => tab instanceof HTMLElement && tab.closest(el.tagName) === el
  )
}

export default class TabContainerElement extends HTMLElement {
  constructor() {
    super()

    this.addEventListener('keydown', (event: KeyboardEvent) => {
      const target = event.target
      if (!(target instanceof HTMLElement)) return
      if (target.closest(this.tagName) !== this) return
      if (target.getAttribute('role') !== 'tab' && !target.closest('[role="tablist"]')) return
      const tabs = getTabs(this)
      const currentIndex = tabs.indexOf(tabs.find(tab => tab.matches('[aria-selected="true"]'))!)

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
      const tabs = getTabs(this)

      if (!(event.target instanceof Element)) return
      if (event.target.closest(this.tagName) !== this) return

      const tab = event.target.closest('[role="tab"]')
      if (!(tab instanceof HTMLElement) || !tab.closest('[role="tablist"]')) return

      const index = tabs.indexOf(tab)
      selectTab(this, index)
    })
  }

  connectedCallback(): void {
    for (const tab of getTabs(this)) {
      if (!tab.hasAttribute('aria-selected')) {
        tab.setAttribute('aria-selected', 'false')
      }
      if (!tab.hasAttribute('tabindex')) {
        if (tab.getAttribute('aria-selected') === 'true') {
          tab.setAttribute('tabindex', '0')
        } else {
          tab.setAttribute('tabindex', '-1')
        }
      }
    }
  }
}

function selectTab(tabContainer: TabContainerElement, index: number) {
  const tabs = getTabs(tabContainer)
  const panels = Array.from(tabContainer.querySelectorAll<HTMLElement>('[role="tabpanel"]')).filter(
    panel => panel.closest(tabContainer.tagName) === tabContainer
  )

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
    if (!panel.hasAttribute('tabindex') && !panel.hasAttribute('data-tab-container-no-tabstop')) {
      panel.setAttribute('tabindex', '0')
    }
  }

  selectedTab.setAttribute('aria-selected', 'true')
  selectedTab.setAttribute('tabindex', '0')
  selectedTab.focus()
  selectedPanel.hidden = false

  tabContainer.dispatchEvent(
    new CustomEvent('tab-container-changed', {
      bubbles: true,
      detail: {relatedTarget: selectedPanel}
    })
  )
}

declare global {
  interface Window {
    TabContainerElement: typeof TabContainerElement
  }
}

if (!window.customElements.get('tab-container')) {
  window.TabContainerElement = TabContainerElement
  window.customElements.define('tab-container', TabContainerElement)
}
