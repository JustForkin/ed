import {Plugin} from 'prosemirror-state'
import { Dropdown
  , undoItem
  , redoItem
  , liftItem,
  } from 'prosemirror-menu'
import { buildMenuItems } from 'prosemirror-example-setup'
import EdSchema from '../schema/ed-schema'
import menuImage from './menu-image'
import makeToggleLink from './menu-link'
import { menuCode
  , menuLocation
  , menuUserhtml
  , menuCta
  , menuQuote,
  } from './menu-media'

const menuItems = buildMenuItems(EdSchema)
const { makeParagraph
  , makeHead1
  , makeHead2
  , makeHead3
  , wrapBulletList
  , wrapOrderedList
  , insertHorizontalRule
  , toggleEm
  , toggleLink
  , toggleStrong,
  } = menuItems

// Customise link
const edToggleLink = makeToggleLink(toggleLink)

// Customise labels
makeHead1.spec.label = 'h1 - Main title'
makeHead2.spec.label = 'h2 - Section heading'
makeHead3.spec.label = 'h3 - Subsection heading'
makeParagraph.spec.label = 'p - Body text'

// Disable these menus on media block selection
function enableIsText (state) {
  if (state.selection && state.selection.node && !state.selection.node.isTextblock) {
    return false
  }
  return this.run(state, false)
}
makeParagraph.spec.select = enableIsText
makeHead1.spec.select = enableIsText
makeHead2.spec.select = enableIsText
makeHead3.spec.select = enableIsText


export const edCommands =
  { 'strong:toggle': toggleStrong,
    'em:toggle': toggleEm,
    'link:toggle': edToggleLink,
    'paragraph:make': makeParagraph,
    'heading:make1': makeHead1,
    'heading:make2': makeHead2,
    'heading:make3': makeHead3,
    'bullet_list:wrap': wrapBulletList,
    'ordered_list:wrap': wrapOrderedList,
    'horizontal_rule:insert': insertHorizontalRule,
    'lift': liftItem,
    'undo': undoItem,
    'redo': redoItem,
    'ed_upload_image': menuImage,
    'ed_add_code': menuCode,
    'ed_add_location': menuLocation,
    'ed_add_userhtml': menuUserhtml,
    'ed_add_cta': menuCta,
    'ed_add_quote': menuQuote,
  }

const typeDropdown = new Dropdown(
  [ makeParagraph,
    makeHead1,
    makeHead2,
    makeHead3,
  ]
  , {label: 'Type'}
)

const addDropdown = new Dropdown(
  [ insertHorizontalRule,
    menuLocation,
    menuCode,
    menuCta,
    menuUserhtml,
  ]
  , {label: 'Add'}
)

export const edBlockMenu = [
  [ toggleStrong,
    toggleEm,
    edToggleLink,
  ],
  [ typeDropdown ],
  [ wrapBulletList,
    wrapOrderedList,
    menuQuote,
    liftItem,
  ],
  [ menuImage ],
  [ addDropdown ],
]

export const edBarMenu = edBlockMenu
  .concat([[undoItem, redoItem]])


export const edMenuPlugin = new Plugin({
  props: {
    menuContent: edBarMenu,
    floatingMenu: false,
  },
})

export const edMenuEmptyPlugin = new Plugin({
  props: {
    menuContent: [],
    floatingMenu: false,
  },
})

// Monkeypatch menu with feature flags
export function patchMenuWithFeatureFlags (featureFlags) {
  function returnFalse () { return false }

  if (featureFlags.edCta === false) {
    menuCta.spec.class = 'flaggedFeature'
    menuCta.spec.run = returnFalse
  }
  if (featureFlags.edEmbed === false) {
    menuUserhtml.spec.class = 'flaggedFeature'
    menuUserhtml.spec.run = returnFalse
  }
}
