describe('custom-element', function() {
  describe('element creation', function() {
    it('creates from document.createElement', function() {
      const el = document.createElement('custom-element')
      assert.equal('CUSTOM-ELEMENT', el.nodeName)
    })

    it('creates from constructor', function() {
      const el = new window.CustomElementElement()
      assert.equal('CUSTOM-ELEMENT', el.nodeName)
    })
  })

  describe('after tree insertion', function() {
    beforeEach(function() {
      document.body.innerHTML = '<custom-element></custom-element>'
    })

    afterEach(function() {
      document.body.innerHTML = ''
    })

    it('initiates', function() {
      const ce = document.querySelector('custom-element')
      assert.equal(ce.textContent, '<custom-element>')
    })
  })
})
