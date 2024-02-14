type IncrementKeyCode = 'ArrowRight' | 'ArrowDown'
type DecrementKeyCode = 'ArrowUp' | 'ArrowLeft'

function getTabs(el: TabContainerElement): HTMLElement[] {
  return Array.from(el.querySelectorAll<HTMLElement>('[role="tablist"] [role="tab"]')).filter(
    tab => tab instanceof HTMLElement && tab.closest(el.tagName) === el,
  )
}

export class TabContainerChangeEvent extends Event {
  constructor(type: string, {tab, panel, ...init}: EventInit & {tab?: Element; panel?: Element}) {
    super(type, init)
    this.#tab = tab || null
    this.#panel = panel || null
  }

  get detail() {
    // eslint-disable-next-line no-console
    console.warn('TabContainerElement.detail is deprecated, please use .panel instead')
    return {relatedTarget: this.#panel}
  }

  #panel: Element | null = null
  get panel(): Element | null {
    return this.#panel
  }

  #tab: Element | null = null
  get tab(): Element | null {
    return this.#tab
  }
}

function getNavigationKeyCodes(vertical: boolean): [IncrementKeyCode[], DecrementKeyCode[]] {
  if (vertical) {
    return [
      ['ArrowDown', 'ArrowRight'],
      ['ArrowUp', 'ArrowLeft'],
    ]
  } else {
    return [['ArrowRight'], ['ArrowLeft']]
  }
}

export class TabContainerElement extends HTMLElement {
  static define(tag = 'tab-container', registry = customElements) {
    registry.define(tag, this)
    return this
  }

  #onTabContainerChange: ((event: TabContainerChangeEvent) => void) | null = null
  get onTabContainerChange() {
    return this.#onTabContainerChange
  }

  set onTabContainerChange(listener: ((event: TabContainerChangeEvent) => void) | null) {
    if (this.#onTabContainerChange) {
      this.removeEventListener(
        'tab-container-change',
        this.#onTabContainerChange as unknown as EventListenerOrEventListenerObject,
      )
    }
    this.#onTabContainerChange = typeof listener === 'object' || typeof listener === 'function' ? listener : null
    if (typeof listener === 'function') {
      this.addEventListener('tab-container-change', listener as unknown as EventListenerOrEventListenerObject)
    }
  }

  #onTabContainerChanged: ((event: TabContainerChangeEvent) => void) | null = null
  get onTabContainerChanged() {
    return this.#onTabContainerChanged
  }

  set onTabContainerChanged(listener: ((event: TabContainerChangeEvent) => void) | null) {
    if (this.#onTabContainerChanged) {
      this.removeEventListener(
        'tab-container-changed',
        this.#onTabContainerChanged as unknown as EventListenerOrEventListenerObject,
      )
    }
    this.#onTabContainerChanged = typeof listener === 'object' || typeof listener === 'function' ? listener : null
    if (typeof listener === 'function') {
      this.addEventListener('tab-container-changed', listener as unknown as EventListenerOrEventListenerObject)
    }
  }

  connectedCallback(): void {
    this.addEventListener('keydown', (event: KeyboardEvent) => {
      const target = event.target
      if (!(target instanceof HTMLElement)) return
      if (target.closest(this.tagName) !== this) return
      if (target.getAttribute('role') !== 'tab' && !target.closest('[role="tablist"]')) return
      const tabs = getTabs(this)
      const currentIndex = tabs.indexOf(tabs.find(tab => tab.matches('[aria-selected="true"]'))!)
      const [incrementKeys, decrementKeys] = getNavigationKeyCodes(
        target.closest('[role="tablist"]')?.getAttribute('aria-orientation') === 'vertical',
      )

      if (incrementKeys.some(code => event.code === code)) {
        let index = currentIndex + 1
        if (index >= tabs.length) index = 0
        this.selectTab(index)
      } else if (decrementKeys.some(code => event.code === code)) {
        let index = currentIndex - 1
        if (index < 0) index = tabs.length - 1
        this.selectTab(index)
      } else if (event.code === 'Home') {
        this.selectTab(0)
        event.preventDefault()
      } else if (event.code === 'End') {
        this.selectTab(tabs.length - 1)
        event.preventDefault()
      }
    })

    this.addEventListener('click', (event: MouseEvent) => {
      const tabs = getTabs(this)

      if (!(event.target instanceof Element)) return
      if (event.target.closest(this.tagName) !== this) return

      const tab = event.target.closest('[role="tab"]')
      if (!(tab instanceof HTMLElement) || !tab.closest('[role="tablist"]')) {
        return
      }

      const index = tabs.indexOf(tab)
      this.selectTab(index)
    })

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

  selectTab(index: number): void {
    const tabs = getTabs(this)
    const panels = Array.from(this.querySelectorAll<HTMLElement>('[role="tabpanel"]')).filter(
      panel => panel.closest(this.tagName) === this,
    )

    /**
     * Out of bounds index
     */
    if (index > tabs.length - 1) {
      throw new RangeError(`Index "${index}" out of bounds`)
    }

    const selectedTab = tabs[index]
    const selectedPanel = panels[index]

    const cancelled = !this.dispatchEvent(
      new TabContainerChangeEvent('tab-container-change', {
        bubbles: true,
        cancelable: true,
        tab: selectedTab,
        panel: selectedPanel,
      }),
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

    this.dispatchEvent(
      new TabContainerChangeEvent('tab-container-changed', {
        bubbles: true,
        tab: selectedTab,
        panel: selectedPanel,
      }),
    )
  }
}
