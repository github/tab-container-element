describe('tab-container', function () {
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
    })

    afterEach(function () {
      document.body.innerHTML = ''
    })

    it('click works and `tab-container-changed` event is dispatched', function () {
      const tabContainer = document.querySelector('tab-container')
      const tabs = document.querySelectorAll('button')
      const panels = document.querySelectorAll('[role="tabpanel"]')
      let counter = 0
      tabContainer.addEventListener('tab-container-changed', event => {
        counter++
        assert.equal(event.detail.relatedTarget, panels[1])
      })

      tabs[1].click()
      assert(panels[0].hidden)
      assert(!panels[1].hidden)
      assert.equal(counter, 1)
      assert.equal(document.activeElement, tabs[1])
    })

    it('keyboard shortcuts work and `tab-container-changed` events are dispatched', function () {
      const tabContainer = document.querySelector('tab-container')
      const tabs = document.querySelectorAll('button')
      const panels = document.querySelectorAll('[role="tabpanel"]')
      let counter = 0
      tabContainer.addEventListener('tab-container-changed', () => counter++)

      tabs[0].dispatchEvent(new KeyboardEvent('keydown', {code: 'ArrowLeft', bubbles: true}))
      assert(panels[0].hidden)
      assert(!panels[2].hidden)
      assert.equal(document.activeElement, tabs[2])

      tabs[0].dispatchEvent(new KeyboardEvent('keydown', {code: 'Home', bubbles: true}))
      assert(!panels[0].hidden)
      assert(panels[2].hidden)
      assert.equal(document.activeElement, tabs[0])
      assert.equal(counter, 2)
    })

    it('click works and a cancellable `tab-container-change` event is dispatched', function () {
      const tabContainer = document.querySelector('tab-container')
      const tabs = document.querySelectorAll('button')
      const panels = document.querySelectorAll('[role="tabpanel"]')
      let counter = 0
      tabContainer.addEventListener('tab-container-change', event => {
        counter++
        assert.equal(event.detail.relatedTarget, panels[1])
        event.preventDefault()
      })

      tabs[1].click()

      // Since we prevented the event, nothing should have changed.
      assert(!panels[0].hidden)
      assert(panels[1].hidden)

      // The event listener should have been called.
      assert.equal(counter, 1)
    })

    it("panels that don't have a `data-tab-container-no-tabstop` attribute have tabindex with value '0'", function () {
      const tabs = document.querySelectorAll('button')
      const panels = document.querySelectorAll('[role="tabpanel"]')

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
      const tabs = document.querySelectorAll('[role="tab"]')

      tabs[1].click()
      assert.equal(tabs[1].getAttribute('tabindex'), '0')
      assert.equal(tabs[0].getAttribute('tabindex'), '-1')
    })
  })
})
