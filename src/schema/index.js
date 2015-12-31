import {defaultSchema, Attribute, Schema, Block} from 'prosemirror/src/model'
import uuid from 'uuid'

import {Figure, FigCaption, iFrame} from './figure'
import {Media} from './media'

//import {Embed} from './embed'


// Extend default schema with custom types

let spec = defaultSchema.spec
spec = spec.update({
  figure: Figure,
  figcaption: FigCaption,
  media: Media,
  iframe: iFrame
  //embed:Embed
})

// Block id
// TODO: make these for top-level blocks only

let makeId = () => uuid.v4()

const idAttribute = new Attribute({
  
  default: ''
    
  //compute: makeId // WARNING: this causes selection of blockquotes to break??
  
})

idAttribute.parseDOM = (dom, options) => dom.getAttribute('data-grid-id') || makeId()
idAttribute.serializeDOM = (dom, id) => {
  dom ? dom.setAttribute('data-grid-id', id) : ''
} 

let idPred = (_, data) => data.type.prototype.isTextblock || data.type.prototype.isBlock
spec = spec.addAttribute(idPred, 'data-grid-id', idAttribute)

// Non-editable blocks

const editableAttribute = new Attribute({
  default: 'false'
})
editableAttribute.parseDOM = (dom, options) => dom.getAttribute('contenteditable') || 'false'
editableAttribute.serializeDOM = (dom, editable) => dom ? dom.setAttribute('contenteditable', editable) : null

let editablePred = (_, data) => data.type.prototype.isNotEditable
spec = spec.addAttribute(editablePred, 'contenteditable', editableAttribute)

//

const GridSchema = new Schema(spec)
console.log(GridSchema)
export default GridSchema
