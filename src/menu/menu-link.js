import {MenuItem} from 'prosemirror-menu'
import xtend from 'xtend'
import {toggleMark} from 'prosemirror-commands'
import EdSchema from '../schema/ed-schema'
import {TextField, openMenuPrompt} from './menu-prompt'
import {isUrlLike} from '../util/url'
import {key} from '../plugins/store-ref'

const markType = EdSchema.marks.link

function markActive (state, type) {
  let {from, $from, to, empty} = state.selection
  if (empty) return type.isInSet(state.storedMarks || $from.marks())
  else return state.doc.rangeHasMark(from, to, type)
}

function makeToggleLink (toggleLink) {
  const spec = xtend(toggleLink.spec, {
    run: function (state, dispatch, view, attrs) {
      // Toggle link off
      if (markActive(state, markType)) {
        toggleMark(markType)(state, dispatch)
        return true
      }

      // Toggle link on
      if (attrs) {
        toggleMark(markType, attrs)(state, dispatch)
        return true
      }

      // Prompt for link
      const {from, to} = state.selection
      const selectedText = state.doc.textBetween(from, to)
      const urlLike = isUrlLike(selectedText)
      const value = (urlLike ? selectedText : '')

      const {ed} = key.get(state).options.edStuff
      if (ed.onRequestLink) {
        ed.onRequestLink(value)
        return true
      }

      // HAHAHACK
      const menuEl = view.content.parentNode.querySelector('.ProseMirror-menubar')
      if (!menuEl) return false
      const buttonEl = menuEl.querySelector('[title="Add or remove link"]')
      if (!buttonEl) return false

      openMenuPrompt({
        title: 'Create a link',
        fields: {
          href: new TextField({
            label: 'Link address',
            placeholder: 'Starts with http',
            type: 'url',
            required: true,
            value,
            clean: (val) => {
              if (!/^https?:\/\//i.test(val)) {
                val = 'http://' + val
              }
              return val
            },
          }),
          title: new TextField({
            label: 'Hover Title',
          }),
        },
        callback: function (attrs) {
          toggleMark(markType, attrs)(state, dispatch)
          view.focus()
        },
        menuEl,
        buttonEl,
      })
    },
  })
  return new MenuItem(spec)
}

export default makeToggleLink

