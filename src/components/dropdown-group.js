/* eslint react/no-find-dom-node: [0] */

import React, {createElement as el} from 'react'

import Menu from 'rebass/dist/Menu'
import ButtonOutline from 'rebass/dist/ButtonOutline'

function hasParentWithClassName (el, className) {
  while (el && el.parentNode) {
    if (el.classList.contains(className)) {
      return true
    }
    el = el.parentNode
  }
  return false
}


class DropdownGroup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      openMenu: null,
    }
    this.boundCloseMenu = this.closeMenu.bind(this)
    this.nodeRefCallback = (node) => { this.node = node }
    this.onKeyDown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        event.stopPropagation()
        this.setState({openMenu: null})
      }
    }
  }
  componentDidMount () {
    // Click away to dismiss
    document.body.addEventListener('click', this.boundCloseMenu)
  }
  componentWillUnmount () {
    document.body.removeEventListener('click', this.boundCloseMenu)
  }
  componentWillReceiveProps (nextProps) {
    if (this.state.openMenu == null) {
      return
    }
    // Find and open new menu
    if (nextProps.menus.length > this.props.menus.length) {
      for (let i = 0, len = nextProps.menus.length; i < len; i++) {
        const menu = this.props.menus[i]
        const nextMenu = nextProps.menus[i]
        if (menu && nextMenu && menu.key !== nextMenu.key) {
          this.setState({openMenu: i})
          return
        }
      }
    }
    // Close if removed
    if (nextProps.menus.length < this.props.menus.length) {
      this.setState({openMenu: null})
    }
  }
  componentDidUpdate (_, prevState) {
    // Focus on open
    if (!prevState.open && this.state.open && this.node) {
      const el = this.node.querySelector('textarea')
      if (el) {
        el.focus()
      }
    }
  }
  render () {
    return el('div',
      {
        className: 'DropdownGroup',
        ref: this.nodeRefCallback,
        onKeyDown: this.onKeyDown,
      },
      this.renderButtons(),
      this.renderMenu()
    )
  }
  renderButtons () {
    const {menus, theme} = this.props
    const {openMenu} = this.state

    let buttons = []
    for (let i = 0, len = menus.length; i < len; i++) {
      // HACK
      const {name, label} = menus[i].props
      buttons.push(
        el(ButtonOutline, {
          key: `button${i}`,
          onClick: this.makeOpenMenu(i),
          theme: (openMenu === i ? 'primary' : theme),
          inverted: false,
          style: {
            borderWidth: 0,
            boxShadow: 'none',
            outline: 'none',
          },
          rounded: false,
          title: `Edit ${label}`,
        },
        el('span', {
          style: {
            maxWidth: '15rem',
            verticalAlign: 'middle',
            display: 'inline-block',
            whiteSpace: 'pre',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textTransform: 'uppercase',
          }},
          (name || label)
        )
        )
      )
    }
    return buttons
  }
  renderMenu () {
    const {menus, theme} = this.props
    const {openMenu} = this.state

    if (openMenu == null) return

    return el('div', {style: { position: 'relative' }},
      el(Menu, {
        theme,
        style: {
          textAlign: 'left',
          position: 'absolute',
          top: -1,
          right: -1,
          zIndex: 100,
          marginBottom: '5rem',
        },
      }, menus[openMenu]
      )
    )
  }
  makeOpenMenu (index) {
    return () => {
      const {openMenu} = this.state
      const toggleOrOpen = (openMenu === index ? null : index)
      this.setState({openMenu: toggleOrOpen})
    }
  }
  closeMenu (event) {
    // Hack since we can't stopPropagation to body
    if (event.type === 'click' && hasParentWithClassName(event.target, 'DropdownGroup')) {
      // Keep open
      return
    }
    // Close menu
    const {openMenu} = this.state
    if (openMenu != null) {
      this.setState({openMenu: null})
    }
  }
}
DropdownGroup.propTypes =
{ menus: React.PropTypes.array.isRequired,
  theme: React.PropTypes.string,
}
DropdownGroup.defaultProps =
  { theme: 'secondary' }
export default React.createFactory(DropdownGroup)
