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
      document.body.innerHTML = '<tab-container>Tabs go here</tab-container>'
    })

    afterEach(function() {
      document.body.innerHTML = ''
    })

    it('initiates', function() {
      const ce = document.querySelector('tab-container')
      assert.equal(ce.textContent, 'Tabs go here')
    })
  })
})
