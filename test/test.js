import {assert, expect} from '@open-wc/testing'
import TabContainerElement from '../src/index.ts'

describe('tab-container', function () {
  const isSelected = e => e.matches('[aria-selected=true]')
  const isHidden = e => !e.assignedSlot
  let tabContainer = null
  let tabs = []
  let panels = []
  let events = []

  describe('Shadow DOM', function () {
    it('`renderShadow` contains the correct string representation', function () {
      const expected = `
  <div style="display: flex" part="tablist-wrapper">
    <slot part="before-tabs" name="before-tabs"></slot>
    <div part="tablist-tab-wrapper">
      <slot part="tablist" name="tablist"></slot>
    </div>
    <slot part="after-tabs" name="after-tabs"></slot>
  </div>
  <slot part="panel" name="panel" role="presentation"></slot>
  <slot part="after-panels" name="after-panels"></slot>
`
      assert.equal(TabContainerElement.renderShadow(), expected)
    })
  })

  describe('element creation', function () {
    it('creates from document.createElement', function () {
      const el = document.createElement('tab-container')
      assert.equal('TAB-CONTAINER', el.nodeName)
    })

    it('creates from constructor', function () {
      const el = new window.TabContainerElement()
      assert.equal('TAB-CONTAINER', el.nodeName)
    })
  })

  describe('events', function () {
    it('has an onTabContainerChange property for the change event', function () {
      const el = document.createElement('tab-container')
      let called = false
      const listener = () => (called = true)
      el.onTabContainerChange = listener
      assert.equal(el.onTabContainerChange, listener)
      assert.equal(called, false)
      el.dispatchEvent(new Event('tab-container-change'))
      assert.equal(called, true)
    })

    it('has an onTabContainerChanged property for the changed event', function () {
      const el = document.createElement('tab-container')
      let called = false
      const listener = () => (called = true)
      el.onTabContainerChanged = listener
      assert.equal(el.onTabContainerChanged, listener)
      assert.equal(called, false)
      el.dispatchEvent(new Event('tab-container-changed'))
      assert.equal(called, true)
    })

    it('has an onChange property that is aliased to onTabContainerChange', function () {
      const el = document.createElement('tab-container')
      let called = false
      const listener = () => (called = true)
      el.onChange = listener
      assert.equal(el.onTabContainerChange, listener)
      assert.equal(el.onChange, listener)
      assert.equal(called, false)
      el.dispatchEvent(new Event('tab-container-change'))
      assert.equal(called, true)
    })

    it('has an onChanged property that is aliased to onTabContainerChanged', function () {
      const el = document.createElement('tab-container')
      let called = false
      const listener = () => (called = true)
      el.onChanged = listener
      assert.equal(el.onTabContainerChanged, listener)
      assert.equal(el.onChanged, listener)
      assert.equal(called, false)
      el.dispatchEvent(new Event('tab-container-changed'))
      assert.equal(called, true)
    })
  })

  describe('after tree insertion with aria-selected on second tab', function () {
    beforeEach(function () {
      document.body.innerHTML = `
      <tab-container>
        <button type="button" role="tab">Tab one</button>
        <button type="button" role="tab" aria-selected="true">Tab two</button>
        <button type="button" role="tab">Tab three</button>
        <div role="tabpanel" hidden>
          Panel 1
        </div>
        <div role="tabpanel">
          Panel 2
        </div>
        <div role="tabpanel" hidden data-tab-container-no-tabstop>
          Panel 3
        </div>
      </tab-container>
      `
      tabs = Array.from(document.querySelectorAll('button'))
      panels = Array.from(document.querySelectorAll('[role="tabpanel"]'))
    })

    afterEach(function () {
      // Check to make sure we still have accessible markup after the test finishes running.
      expect(document.body).to.be.accessible()

      document.body.innerHTML = ''
    })

    it('has accessible markup', function () {
      expect(document.body).to.be.accessible()
    })

    it('the second tab is still selected', function () {
      assert.deepStrictEqual(tabs.map(isSelected), [false, true, false], 'Second tab is selected')
      assert.deepStrictEqual(panels.map(isHidden), [true, false, true], 'Second panel is visible')
    })
  })

  describe('after tree insertion with defaulTabIndex', function () {
    beforeEach(function () {
      document.body.innerHTML = `
      <tab-container default-tab="1">
        <button type="button" role="tab">Tab one</button>
        <button type="button" role="tab">Tab two</button>
        <button type="button" role="tab">Tab three</button>
        <div role="tabpanel" hidden>
          Panel 1
        </div>
        <div role="tabpanel">
          Panel 2
        </div>
        <div role="tabpanel" hidden data-tab-container-no-tabstop>
          Panel 3
        </div>
      </tab-container>
      `
      tabs = Array.from(document.querySelectorAll('button'))
      panels = Array.from(document.querySelectorAll('[role="tabpanel"]'))
    })

    afterEach(function () {
      // Check to make sure we still have accessible markup after the test finishes running.
      expect(document.body).to.be.accessible()

      document.body.innerHTML = ''
    })

    it('has accessible markup', function () {
      expect(document.body).to.be.accessible()
    })

    it('the second tab is still selected', function () {
      assert.deepStrictEqual(tabs.map(isSelected), [false, true, false], 'Second tab is selected')
      assert.deepStrictEqual(panels.map(isHidden), [true, false, true], 'Second panel is visible')
    })
  })

  describe('after tree insertion', function () {
    beforeEach(function () {
      document.body.innerHTML = `
      <tab-container>
        <div role="tablist">
          <button type="button" role="tab" aria-selected="true">Tab one</button>
          <button type="button" role="tab">Tab two</button>
          <button type="button" role="tab">Tab three</button>
        </div>
        <div role="tabpanel">
          Panel 1
        </div>
        <div role="tabpanel" hidden>
          Panel 2
        </div>
        <div role="tabpanel" hidden data-tab-container-no-tabstop>
          Panel 3
        </div>
      </tab-container>
      `
      tabContainer = document.querySelector('tab-container')
      tabs = Array.from(document.querySelectorAll('button'))
      panels = Array.from(document.querySelectorAll('[role="tabpanel"]'))
      events = []
      tabContainer.addEventListener('tab-container-change', e => events.push(e))
      tabContainer.addEventListener('tab-container-changed', e => events.push(e))
    })

    afterEach(function () {
      // Check to make sure we still have accessible markup after the test finishes running.
      expect(document.body).to.be.accessible()

      document.body.innerHTML = ''
    })

    it('has accessible markup', function () {
      expect(document.body).to.be.accessible()
    })

    it('click works and `tab-container-changed` event is dispatched with correct index', function () {
      tabs[1].click()
      assert.deepStrictEqual(tabs.map(isSelected), [false, true, false], 'Second tab is selected')
      assert.deepStrictEqual(panels.map(isHidden), [true, false, true], 'Second panel is visible')
      assert.equal(events.length, 2, 'tab-container-change(d) called')
      assert.deepStrictEqual(
        events.map(e => e.type),
        ['tab-container-change', 'tab-container-changed'],
        'events fired in right order',
      )
      assert.deepStrictEqual(
        events.map(e => e.tab),
        [tabs[1], tabs[1]],
        'change events point to second tab',
      )
      assert.deepStrictEqual(
        events.map(e => e.tabIndex),
        [1, 1],
        'change events point to second tabIndex',
      )
      assert.deepStrictEqual(
        events.map(e => e.panel),
        [panels[1], panels[1]],
        'change events point to second panel',
      )
      assert.equal(document.activeElement, tabs[1])
      assert.equal(tabContainer.activeTab, tabs[1])
      assert.equal(tabContainer.selectedTabIndex, 1)
    })

    it('keyboard shortcuts work and `tab-container-changed` events are dispatched', function () {
      tabs[0].dispatchEvent(new KeyboardEvent('keydown', {code: 'ArrowLeft', bubbles: true}))
      assert.deepStrictEqual(tabs.map(isSelected), [false, false, true], 'Third tab is selected')
      assert.deepStrictEqual(panels.map(isHidden), [true, true, false], 'Third panel is visible')
      assert.equal(document.activeElement, tabs[2])
      assert.equal(events.length, 2, 'tab-container-change(d) called')
      assert.deepStrictEqual(
        events.map(e => e.type),
        ['tab-container-change', 'tab-container-changed'],
        'events fired in right order',
      )
      assert.deepStrictEqual(
        events.map(e => e.detail.relatedTarget),
        [panels[2], panels[2]],
        'change events point to third panel',
      )

      events = []

      tabs[0].dispatchEvent(new KeyboardEvent('keydown', {code: 'Home', bubbles: true}))
      assert.deepStrictEqual(tabs.map(isSelected), [true, false, false], 'First tab is selected')
      assert.deepStrictEqual(panels.map(isHidden), [false, true, true], 'First panel is visible')
      assert.equal(document.activeElement, tabs[0])
      assert.equal(tabContainer.activeTab, tabs[0])
      assert.equal(tabContainer.selectedTabIndex, 0)
      assert.equal(events.length, 2, 'tab-container-change(d) called')
      assert.deepStrictEqual(
        events.map(e => e.type),
        ['tab-container-change', 'tab-container-changed'],
        'events fired in right order',
      )
      assert.deepStrictEqual(
        events.map(e => e.detail.relatedTarget),
        [panels[0], panels[0]],
        'change events point to first panel',
      )
    })

    it('down and up keyboard shortcuts do not work and `tab-container-changed` events are not dispatched', () => {
      tabs[0].dispatchEvent(new KeyboardEvent('keydown', {code: 'ArrowDown', bubbles: true}))
      assert.deepStrictEqual(tabs.map(isSelected), [true, false, false], 'First tab is selected')
      assert.deepStrictEqual(panels.map(isHidden), [false, true, true], 'First panel is visible')
      assert.equal(document.activeElement, document.body)
      assert.equal(events.length, 0)

      tabs[0].dispatchEvent(new KeyboardEvent('keydown', {code: 'ArrowUp', bubbles: true}))
      assert.deepStrictEqual(tabs.map(isSelected), [true, false, false], 'First tab is selected')
      assert.deepStrictEqual(panels.map(isHidden), [false, true, true], 'First panel is visible')
      assert.equal(document.activeElement, document.body)
      assert.equal(events.length, 0)
    })

    it('click works and a cancellable `tab-container-change` event is dispatched', function () {
      tabContainer.addEventListener('tab-container-change', event => {
        event.preventDefault()
      })

      tabs[1].click()

      // Since we prevented the event, nothing should have changed.
      assert.deepStrictEqual(tabs.map(isSelected), [true, false, false], 'First tab is selected')
      assert.deepStrictEqual(panels.map(isHidden), [false, true, true], 'First panel is visible')
      assert.equal(document.activeElement, document.body)

      // The event listener should have been called.
      assert.equal(events.length, 1, 'only tab-container-change fired')
    })

    it("panels that don't have a `data-tab-container-no-tabstop` attribute have tabindex with value '0'", function () {
      tabs[1].click()

      assert.equal(panels[0].getAttribute('tabindex'), '0')
      assert.equal(panels[1].getAttribute('tabindex'), '0')
      assert(!panels[2].hasAttribute('tabindex'))
    })

    it('the aria-selected attribute is set to "false" for all tabs that don\'t have a aria-selected attribute', function () {
      for (const tab of document.querySelectorAll('[role="tab"]:not([aria-selected="true"])')) {
        assert.equal(tab.getAttribute('aria-selected'), 'false')
      }
    })

    it('the tabindex attribute is set to "0" for the selected tab', function () {
      assert.equal(document.querySelector('[role="tab"][aria-selected="true"]').getAttribute('tabindex'), '0')
    })

    it('the tabindex attribute is set to "-1" for the non-selected tabs', function () {
      for (const tab of document.querySelectorAll('[role="tab"]:not([aria-selected="true"])')) {
        assert.equal(tab.getAttribute('tabindex'), '-1')
      }
    })
    it('selected tab has tabindex="0" after selection', function () {
      tabs[1].click()
      assert.equal(tabs[1].getAttribute('tabindex'), '0')
      assert.equal(tabs[0].getAttribute('tabindex'), '-1')
    })

    it('`selectTab` works and `tab-container-changed` event is dispatched', function () {
      tabContainer.selectTab(1)
      assert.deepStrictEqual(tabs.map(isSelected), [false, true, false], 'Second tab is selected')
      assert.deepStrictEqual(panels.map(isHidden), [true, false, true], 'Second panel is visible')
      assert.equal(events.length, 2, 'tab-container-change(d) called')
      assert.deepStrictEqual(
        events.map(e => e.type),
        ['tab-container-change', 'tab-container-changed'],
        'events fired in right order',
      )
      assert.deepStrictEqual(
        events.map(e => e.tab),
        [tabs[1], tabs[1]],
        'change events point to second tab',
      )
      assert.deepStrictEqual(
        events.map(e => e.panel),
        [panels[1], panels[1]],
        'change events point to second panel',
      )
      assert.equal(document.activeElement, tabs[1])
      assert.equal(tabContainer.activeTab, tabs[1])
      assert.equal(tabContainer.selectedTabIndex, 1)
    })

    it('result in noop, when selectTab receives out of bounds index', function () {
      assert.throws(() => tabContainer.selectTab(3), 'Index "3" out of bounds')

      tabContainer.selectTab(2)
      assert.deepStrictEqual(tabs.map(isSelected), [false, false, true], 'Third tab is selected')
      assert.deepStrictEqual(panels.map(isHidden), [true, true, false], 'Third panel is visible')
    })
  })

  describe('nesting', function () {
    let nestedTabs = []
    let nestedPanels = []
    beforeEach(function () {
      document.body.innerHTML = `
      <tab-container class="test-top">
        <div role="tablist" >
          <button type="button" role="tab" aria-selected="true">Tab one</button>
          <button type="button" role="tab">Tab two</button>
          <button type="button" role="tab">Tab three</button>
        </div>
        <div role="tabpanel">
          <tab-container class="test-nested">
            <div role="tablist">
              <button type="button" role="tab" aria-selected="true">Nested Tab one</button>
              <button type="button" role="tab">Nested Tab two</button>
            </div>
            <div role="tabpanel">Nested Panel 1</div>
            <div role="tabpanel" hidden>Nested Panel 2</div>
          </tab-container>
        </div>
        <div role="tabpanel" hidden>
          Panel 2
        </div>
        <div role="tabpanel" hidden data-tab-container-no-tabstop>
          Panel 3
        </div>
      </tab-container>
      `
      tabContainer = document.querySelector('tab-container')
      tabs = Array.from(document.querySelectorAll('body > tab-container > [role="tablist"] > button'))
      panels = Array.from(document.querySelectorAll('body > tab-container > [role="tabpanel"]'))
      nestedTabs = Array.from(document.querySelectorAll('.test-nested > [role="tablist"] > [role="tab"]'))
      nestedPanels = Array.from(document.querySelectorAll('.test-nested > [role="tabpanel"]'))
      events = []
      tabContainer.addEventListener('tab-container-change', e => events.push(e))
      tabContainer.addEventListener('tab-container-changed', e => events.push(e))
    })

    afterEach(function () {
      // Check to make sure we still have accessible markup after the test finishes running.
      expect(document.body).to.be.accessible()

      document.body.innerHTML = ''
    })

    it('has accessible markup', function () {
      expect(document.body).to.be.accessible()
    })

    it('only switches closest tab-containers on click', () => {
      assert.deepStrictEqual(tabs.map(isSelected), [true, false, false])
      assert.deepStrictEqual(nestedTabs.map(isSelected), [true, false])
      assert.deepStrictEqual(panels.map(isHidden), [false, true, true])
      assert.deepStrictEqual(nestedPanels.map(isHidden), [false, true])

      nestedTabs[1].click()

      assert.deepStrictEqual(tabs.map(isSelected), [true, false, false], 'top tabs changed state')
      assert.deepStrictEqual(nestedTabs.map(isSelected), [false, true], 'nested tabs did change state')
      assert.deepStrictEqual(panels.map(isHidden), [false, true, true], 'top panels changed state')
      assert.deepStrictEqual(nestedPanels.map(isHidden), [true, false], 'nested panels did not change state')

      tabs[1].click()

      assert.deepStrictEqual(nestedPanels.map(isHidden), [true, false], 'nested panels did change state')
    })

    it('only switches closest tab-containers on arrow', () => {
      assert.deepStrictEqual(tabs.map(isSelected), [true, false, false])
      assert.deepStrictEqual(nestedTabs.map(isSelected), [true, false])
      assert.deepStrictEqual(panels.map(isHidden), [false, true, true])
      assert.deepStrictEqual(nestedPanels.map(isHidden), [false, true])

      nestedTabs[0].dispatchEvent(new KeyboardEvent('keydown', {code: 'ArrowLeft', bubbles: true}))

      assert.deepStrictEqual(tabs.map(isSelected), [true, false, false], 'top tabs changed state')
      assert.deepStrictEqual(nestedTabs.map(isSelected), [false, true], 'nested tabs did change state')
      assert.deepStrictEqual(panels.map(isHidden), [false, true, true], 'top panels changed state')
      assert.deepStrictEqual(nestedPanels.map(isHidden), [true, false], 'nested panels did not change state')

      tabs[1].dispatchEvent(new KeyboardEvent('keydown', {code: 'ArrowLeft', bubbles: true}))

      assert.deepStrictEqual(
        nestedPanels.map(isHidden),
        [true, false],
        'nested panels changed state when top panel changed',
      )
      assert.deepStrictEqual(
        nestedTabs.map(isSelected),
        [false, true],
        'nested tabs changed state when top panel changed',
      )
    })
  })

  describe('with vertical tabs', function () {
    beforeEach(function () {
      document.body.innerHTML = `
      <tab-container>
        <div role="tablist" aria-orientation="vertical">
          <button type="button" role="tab" aria-selected="true">Tab one</button>
          <button type="button" role="tab">Tab two</button>
          <button type="button" role="tab">Tab three</button>
        </div>
        <div role="tabpanel">
          Panel 1
        </div>
        <div role="tabpanel" hidden>
          Panel 2
        </div>
        <div role="tabpanel" hidden data-tab-container-no-tabstop>
          Panel 3
        </div>
      </tab-container>
      `
      tabContainer = document.querySelector('tab-container')
      tabs = Array.from(document.querySelectorAll('button'))
      panels = Array.from(document.querySelectorAll('[role="tabpanel"]'))
      events = []
      tabContainer.addEventListener('tab-container-change', e => events.push(e))
      tabContainer.addEventListener('tab-container-changed', e => events.push(e))
    })

    afterEach(function () {
      document.body.innerHTML = ''
    })

    it('up and down keyboard shortcuts work and `tab-container-changed` events are dispatched', () => {
      tabs[0].dispatchEvent(new KeyboardEvent('keydown', {code: 'ArrowUp', bubbles: true}))
      assert.deepStrictEqual(tabs.map(isSelected), [false, false, true], 'Third tab is selected')
      assert.deepStrictEqual(panels.map(isHidden), [true, true, false], 'Third panel is visible')
      assert.equal(document.activeElement, tabs[2])
      assert.equal(tabContainer.activeTab, tabs[2])
      assert.equal(tabContainer.selectedTabIndex, 2)
      assert.equal(events.length, 2, 'tab-container-change(d) called')
      assert.deepStrictEqual(
        events.map(e => e.type),
        ['tab-container-change', 'tab-container-changed'],
        'events fired in right order',
      )
      assert.deepStrictEqual(
        events.map(e => e.tab),
        [tabs[2], tabs[2]],
        'change events point to second tab',
      )
      assert.deepStrictEqual(
        events.map(e => e.panel),
        [panels[2], panels[2]],
        'change events point to second panel',
      )
      events = []

      tabs[0].dispatchEvent(new KeyboardEvent('keydown', {code: 'Home', bubbles: true}))
      assert.deepStrictEqual(tabs.map(isSelected), [true, false, false], 'First tab is selected')
      assert.deepStrictEqual(panels.map(isHidden), [false, true, true], 'First panel is visible')
      assert.equal(document.activeElement, tabs[0])
      assert.equal(tabContainer.activeTab, tabs[0])
      assert.equal(tabContainer.selectedTabIndex, 0)
      assert.equal(events.length, 2, 'tab-container-change(d) called')
      assert.deepStrictEqual(
        events.map(e => e.type),
        ['tab-container-change', 'tab-container-changed'],
        'events fired in right order',
      )
      assert.deepStrictEqual(
        events.map(e => e.tab),
        [tabs[0], tabs[0]],
        'change events point to first tab',
      )
      assert.deepStrictEqual(
        events.map(e => e.panel),
        [panels[0], panels[0]],
        'change events point to first panel',
      )
      events = []

      tabs[0].dispatchEvent(new KeyboardEvent('keydown', {code: 'ArrowDown', bubbles: true}))
      assert.deepStrictEqual(tabs.map(isSelected), [false, true, false], 'Second tab is selected')
      assert.deepStrictEqual(panels.map(isHidden), [true, false, true], 'Second panel is visible')
      assert.equal(document.activeElement, tabs[1])
      assert.equal(tabContainer.activeTab, tabs[1])
      assert.equal(tabContainer.selectedTabIndex, 1)
      assert.equal(events.length, 2, 'tab-container-change(d) called')
      assert.deepStrictEqual(
        events.map(e => e.type),
        ['tab-container-change', 'tab-container-changed'],
        'events fired in right order',
      )
      assert.deepStrictEqual(
        events.map(e => e.tab),
        [tabs[1], tabs[1]],
        'change events point to second tab',
      )
      assert.deepStrictEqual(
        events.map(e => e.panel),
        [panels[1], panels[1]],
        'change events point to second panel',
      )
      events = []

      tabs[1].dispatchEvent(new KeyboardEvent('keydown', {code: 'End', bubbles: true}))
      assert.deepStrictEqual(tabs.map(isSelected), [false, false, true], 'Third tab is selected')
      assert.deepStrictEqual(panels.map(isHidden), [true, true, false], 'Third panel is visible')
      assert.equal(document.activeElement, tabs[2])
      assert.equal(tabContainer.activeTab, tabs[2])
      assert.equal(tabContainer.selectedTabIndex, 2)
      assert.equal(events.length, 2, 'tab-container-change(d) called')
      assert.deepStrictEqual(
        events.map(e => e.type),
        ['tab-container-change', 'tab-container-changed'],
        'events fired in right order',
      )
      assert.deepStrictEqual(
        events.map(e => e.tab),
        [tabs[2], tabs[2]],
        'change events point to third tab',
      )
      assert.deepStrictEqual(
        events.map(e => e.panel),
        [panels[2], panels[2]],
        'change events point to third panel',
      )
    })

    it('left and right keyboard shortcuts work and `tab-container-changed` events are dispatched', () => {
      tabs[0].dispatchEvent(new KeyboardEvent('keydown', {code: 'ArrowLeft', bubbles: true}))
      assert.deepStrictEqual(tabs.map(isSelected), [false, false, true], 'Third tab is selected')
      assert.deepStrictEqual(panels.map(isHidden), [true, true, false], 'Third panel is visible')
      assert.equal(document.activeElement, tabs[2])
      assert.equal(tabContainer.activeTab, tabs[2])
      assert.equal(tabContainer.selectedTabIndex, 2)
      assert.equal(events.length, 2, 'tab-container-change(d) called')
      assert.deepStrictEqual(
        events.map(e => e.type),
        ['tab-container-change', 'tab-container-changed'],
        'events fired in right order',
      )
      assert.deepStrictEqual(
        events.map(e => e.tab),
        [tabs[2], tabs[2]],
        'change events point to third tab',
      )
      assert.deepStrictEqual(
        events.map(e => e.panel),
        [panels[2], panels[2]],
        'change events point to third panel',
      )
      events = []

      tabs[0].dispatchEvent(new KeyboardEvent('keydown', {code: 'Home', bubbles: true}))
      assert.deepStrictEqual(tabs.map(isSelected), [true, false, false], 'First tab is selected')
      assert.deepStrictEqual(panels.map(isHidden), [false, true, true], 'First panel is visible')
      assert.equal(document.activeElement, tabs[0])
      assert.equal(tabContainer.activeTab, tabs[0])
      assert.equal(tabContainer.selectedTabIndex, 0)
      assert.equal(events.length, 2, 'tab-container-change(d) called')
      assert.deepStrictEqual(
        events.map(e => e.type),
        ['tab-container-change', 'tab-container-changed'],
        'events fired in right order',
      )
      assert.deepStrictEqual(
        events.map(e => e.tab),
        [tabs[0], tabs[0]],
        'change events point to first tab',
      )
      assert.deepStrictEqual(
        events.map(e => e.panel),
        [panels[0], panels[0]],
        'change events point to first panel',
      )
      events = []

      tabs[0].dispatchEvent(new KeyboardEvent('keydown', {code: 'ArrowRight', bubbles: true}))
      assert.deepStrictEqual(tabs.map(isSelected), [false, true, false], 'Second tab is selected')
      assert.deepStrictEqual(panels.map(isHidden), [true, false, true], 'Second panel is visible')
      assert.equal(document.activeElement, tabs[1])
      assert.equal(tabContainer.activeTab, tabs[1])
      assert.equal(tabContainer.selectedTabIndex, 1)
      assert.equal(events.length, 2, 'tab-container-change(d) called')
      assert.deepStrictEqual(
        events.map(e => e.type),
        ['tab-container-change', 'tab-container-changed'],
        'events fired in right order',
      )
      assert.deepStrictEqual(
        events.map(e => e.tab),
        [tabs[1], tabs[1]],
        'change events point to second tab',
      )
      assert.deepStrictEqual(
        events.map(e => e.panel),
        [panels[1], panels[1]],
        'change events point to second panel',
      )
      events = []

      tabs[1].dispatchEvent(new KeyboardEvent('keydown', {code: 'End', bubbles: true}))
      assert.deepStrictEqual(tabs.map(isSelected), [false, false, true], 'Third tab is selected')
      assert.deepStrictEqual(panels.map(isHidden), [true, true, false], 'Third panel is visible')
      assert.equal(document.activeElement, tabs[2])
      assert.equal(tabContainer.activeTab, tabs[2])
      assert.equal(tabContainer.selectedTabIndex, 2)
      assert.equal(events.length, 2, 'tab-container-change(d) called')
      assert.deepStrictEqual(
        events.map(e => e.type),
        ['tab-container-change', 'tab-container-changed'],
        'events fired in right order',
      )
      assert.deepStrictEqual(
        events.map(e => e.tab),
        [tabs[2], tabs[2]],
        'change events point to third tab',
      )
      assert.deepStrictEqual(
        events.map(e => e.panel),
        [panels[2], panels[2]],
        'change events point to third panel',
      )
    })
  })
})
