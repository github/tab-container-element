const HTMLElement = globalThis.HTMLElement || (null as unknown as (typeof window)['HTMLElement'])

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

  static observedAttributes = ['vertical']

  get #tabList() {
    const slot = this.#tabListSlot
    if (this.#tabListSlot.hasAttribute('role')) {
      return slot
    } else {
      return slot.assignedNodes()[0] as HTMLElement
    }
  }

  get #beforeTabsSlot() {
    return this.shadowRoot!.querySelector<HTMLSlotElement>('slot[part="before-tabs"]')!
  }

  get #afterTabsSlot() {
    return this.shadowRoot!.querySelector<HTMLSlotElement>('slot[part="after-tabs"]')!
  }

  get #afterPanelsSlot() {
    return this.shadowRoot!.querySelector<HTMLSlotElement>('slot[part="after-panels"]')!
  }

  get #tabListSlot() {
    return this.shadowRoot!.querySelector<HTMLSlotElement>('slot[part="tablist"]')!
  }

  get #panelSlot() {
    return this.shadowRoot!.querySelector<HTMLSlotElement>('slot[part="panel"]')!
  }

  get #tabs() {
    if (this.#tabListSlot.matches('[role=tablist]')) {
      return this.#tabListSlot.assignedNodes() as HTMLElement[]
    }
    return Array.from(this.#tabList?.querySelectorAll<HTMLElement>('[role="tab"]') || []).filter(
      tab => tab instanceof HTMLElement && tab.closest(this.tagName) === this,
    )
  }

  get activePanel() {
    return this.#panelSlot.assignedNodes()[0] as HTMLElement
  }

  get vertical(): boolean {
    return this.#tabList?.getAttribute('aria-orientation') === 'vertical'
  }

  set vertical(isVertical: boolean) {
    const tabList = this.#tabList
    if (tabList && isVertical) {
      tabList.setAttribute('aria-orientation', 'vertical')
    } else {
      tabList.setAttribute('aria-orientation', 'horizontal')
    }
  }

  #setupComplete = false
  #internals!: ElementInternals | null
  connectedCallback(): void {
    this.#internals ||= this.attachInternals ? this.attachInternals() : null
    const shadowRoot = this.shadowRoot || this.attachShadow({mode: 'open', slotAssignment: 'manual'})
    const tabListContainer = document.createElement('div')
    tabListContainer.style.display = 'flex'
    const tabListSlot = document.createElement('slot')
    tabListSlot.setAttribute('part', 'tablist')
    const panelSlot = document.createElement('slot')
    panelSlot.setAttribute('part', 'panel')
    panelSlot.setAttribute('role', 'presentation')
    const beforeTabSlot = document.createElement('slot')
    beforeTabSlot.setAttribute('part', 'before-tabs')
    const afterTabSlot = document.createElement('slot')
    afterTabSlot.setAttribute('part', 'after-tabs')
    tabListContainer.append(beforeTabSlot, tabListSlot, afterTabSlot)
    const afterSlot = document.createElement('slot')
    afterSlot.setAttribute('part', 'after-panels')
    shadowRoot.replaceChildren(tabListContainer, panelSlot, afterSlot)

    if (this.#internals && 'role' in this.#internals) {
      this.#internals.role = 'presentation'
    } else {
      this.setAttribute('role', 'presentation')
    }

    this.addEventListener('keydown', this)
    this.addEventListener('click', this)
    this.selectTab(
      Math.max(
        this.#tabs.findIndex(el => el.matches('[aria-selected=true]')),
        0,
      ),
    )
    this.#setupComplete = true
  }

  attributeChangedCallback(name: string) {
    if (!this.isConnected || !this.shadowRoot) return
    if (name === 'vertical') {
      this.vertical = this.hasAttribute('vertical')
    }
  }

  handleEvent(event: Event) {
    if (event.type === 'click') return this.#handleClick(event as MouseEvent)
    if (event.type === 'keydown') return this.#handleKeydown(event as KeyboardEvent)
  }

  #handleKeydown(event: KeyboardEvent) {
    const tab = (event.target as HTMLElement)?.closest?.('[role="tab"]')
    if (!tab) return
    const tabs = this.#tabs
    if (!tabs.includes(tab as HTMLElement)) return

    const currentIndex = tabs.indexOf(tabs.find(e => e.matches('[aria-selected="true"]'))!)
    const vertical = tab.closest('[role="tablist"]')?.getAttribute('aria-orientation') === 'vertical'
    const prevTab = event.code === 'ArrowLeft' || (vertical && event.code === 'ArrowUp')
    const nextTab = event.code === 'ArrowRight' || (vertical && event.code === 'ArrowDown')

    if (nextTab) {
      let index = currentIndex + 1
      if (index >= tabs.length) index = 0
      this.selectTab(index)
    } else if (prevTab) {
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
  }

  #handleClick(event: MouseEvent) {
    const tab = (event.target as HTMLElement)?.closest?.('[role=tab]')
    if (!tab) return
    const tabs = this.#tabs
    const index = tabs.indexOf(tab as HTMLElement)
    if (index >= 0) this.selectTab(index)
  }

  selectTab(index: number): void {
    if (!this.#setupComplete) {
      const tabListSlot = this.#tabListSlot
      const customTabList = this.querySelector('[role=tablist]')
      if (customTabList && customTabList.closest(this.tagName) === this) {
        tabListSlot.assign(customTabList)
      } else {
        tabListSlot.assign(...[...this.children].filter(e => e.matches('[role=tab]')))
        tabListSlot.role = 'tablist'
        tabListSlot.style.display = 'block'
      }
      const tabList = this.#tabList
      if (this.hasAttribute('aria-description')) {
        tabList.setAttribute('aria-description', this.getAttribute('aria-description')!)
        this.removeAttribute('aria-description')
      }
      if (this.hasAttribute('aria-label')) {
        tabList.setAttribute('aria-label', this.getAttribute('aria-label')!)
        this.removeAttribute('aria-label')
      }
      if (this.vertical) {
        this.#tabList.setAttribute('aria-orientation', 'vertical')
      }
      const beforeSlotted: Element[] = []
      const afterTabSlotted: Element[] = []
      const afterSlotted: Element[] = []
      let autoSlotted = beforeSlotted
      for (const child of this.children) {
        if (child.getAttribute('role') === 'tab' || child.getAttribute('role') === 'tablist') {
          autoSlotted = afterTabSlotted
          continue
        }
        if (child.getAttribute('role') === 'tabpanel') {
          autoSlotted = afterSlotted
          continue
        }
        if (child.getAttribute('slot') === 'before-tabs') {
          beforeSlotted.push(child)
        } else if (child.getAttribute('slot') === 'after-tabs') {
          afterTabSlotted.push(child)
        } else {
          autoSlotted.push(child)
        }
      }
      this.#beforeTabsSlot.assign(...beforeSlotted)
      this.#afterTabsSlot.assign(...afterTabSlotted)
      this.#afterPanelsSlot.assign(...afterSlotted)
    }

    const tabs = this.#tabs
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

    if (this.#setupComplete) {
      const cancelled = !this.dispatchEvent(
        new TabContainerChangeEvent('tab-container-change', {
          bubbles: true,
          cancelable: true,
          tab: selectedTab,
          panel: selectedPanel,
        }),
      )
      if (cancelled) return
    }

    for (const tab of tabs) {
      tab.setAttribute('aria-selected', 'false')
      tab.setAttribute('tabindex', '-1')
    }
    for (const panel of panels) {
      if (!panel.hasAttribute('tabindex') && !panel.hasAttribute('data-tab-container-no-tabstop')) {
        panel.setAttribute('tabindex', '0')
      }
    }

    selectedTab.setAttribute('aria-selected', 'true')
    selectedTab.setAttribute('tabindex', '0')
    this.#panelSlot.assign(selectedPanel)
    selectedPanel.hidden = false

    if (this.#setupComplete) {
      selectedTab.focus()
      this.dispatchEvent(
        new TabContainerChangeEvent('tab-container-changed', {
          bubbles: true,
          tab: selectedTab,
          panel: selectedPanel,
        }),
      )
    }
  }
}
