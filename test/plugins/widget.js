import {expect} from 'chai'

import Ed from '../../src/ed'


describe('PluginWidget', function () {
  let mount, ed, PluginWidget
  const fixture = [
    {type: 'h1', html: '<h1>Title</h1>'},
    {
      id: '0000',
      type: 'placeholder',
      metadata: {status: 'Status'}
    }
  ]

  beforeEach(function (done) {
    mount = document.createElement('div')
    document.body.appendChild(mount)
    ed = new Ed({
      container: mount,
      initialContent: fixture,
      onChange: function () {}
    })
    PluginWidget = ed.plugins[0]
    // TODO event or something?
    setTimeout(done, 100)
  })
  afterEach(function () {
    ed.teardown()
    mount.parentNode.removeChild(mount)
  })

  describe('Content mounting and merging', function () {
    it('has expected pm document', function () {
      const content = ed.pm.doc.content.content
      expect(content.length).to.equal(2)
      expect(content[0].textContent).to.equal('Title')
      expect(content[0].type.name).to.equal('heading')
      expect(content[1].textContent).to.equal('')
      expect(content[1].type.name).to.equal('media')
      expect(content[1].attrs.id).to.equal('0000')
      expect(content[1].attrs.type).to.equal('placeholder')
    })
     
    it('has mounted widget', function () {
      const widget = PluginWidget.widgets['0000']
      expect(widget).to.exist
      expect(widget.type).to.equal('placeholder')
      expect(widget.el.firstChild.className).to.equal('Placeholder')
      expect(widget.el.textContent).to.equal('Status')
    })

    it('updates widget props via setContent', function (done) {
      ed.setContent([{
        id: '0000',
        type: 'placeholder',
        metadata: {
          status: 'Status changed'
        }
      }])

      setTimeout(function () {
        const widget = PluginWidget.widgets['0000']
        expect(widget.type).to.equal('placeholder')
        expect(widget.el.textContent).to.equal('Status changed')
        done()
      }, 100)
    })
    
    it('changes widget type', function (done) {
      ed.setContent([{
        id: '0000',
        type: 'image'
      }])
      
      // PM change
      const content = ed.pm.doc.content.content
      expect(content[1].textContent).to.equal('')
      expect(content[1].type.name).to.equal('media')
      expect(content[1].attrs.id).to.equal('0000')
      expect(content[1].attrs.type).to.equal('image')
      
      // Widget switch
      setTimeout(function () {
        const widget = PluginWidget.widgets['0000']
        expect(widget).to.exist
        expect(widget.type).to.equal('image')
        expect(widget.el.firstChild.className).to.equal('AttributionEditor')
        done()
      }, 100)
    })
  })
})
