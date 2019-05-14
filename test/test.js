describe('tab-container', function() {
  describe('element creation', function() {
    it('creates from document.createElement', function() {
      const el = document.createElement('tab-container')
      assert.equal('TAB-CONTAINER', el.nodeName)
    })

    it('creates from constructor', function() {
      const el = new window.TabContainerElement()
      assert.equal('TAB-CONTAINER', el.nodeName)
    })
  })

  describe('after tree insertion', function() {
    beforeEach(function() {
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
        <div role="tabpanel" hidden>
          Panel 3
        </div>
      </tab-container>
      `
    })

    afterEach(function() {
      document.body.innerHTML = ''
    })

    it('click works and event is dispatched', function() {
      const tabContainer = document.querySelector('tab-container')
      const tabs = document.querySelectorAll('button')
      const panels = document.querySelectorAll('[role="tabpanel"]')
      let counter = 0
      tabContainer.addEventListener('tab-container-change', event => {
        counter++
        assert.equal(event.detail.relatedTarget, panels[1])
      })

      tabs[1].click()
      assert(panels[0].hidden)
      assert(!panels[1].hidden)
      assert.equal(counter, 1)
      assert.equal(document.activeElement, tabs[1])
    })

    it('keyboard shortcuts work and events are dispatched', function() {
      const tabContainer = document.querySelector('tab-container')
      const tabs = document.querySelectorAll('button')
      const panels = document.querySelectorAll('[role="tabpanel"]')
      let counter = 0
      tabContainer.addEventListener('tab-container-change', () => counter++)

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
  })
})
