import React, {createElement as el} from 'react'
import {sans, colors} from './rebass-theme'

const containerStyle =
  { fontFamily: sans
  , fontSize: '50%'
  , marginBottom: '1rem'
  }

const areaStyle =
  { fontFamily: 'inherit'
  , fontSize: '200%'
  , lineHeight: 1.5
  , minHeight: '1.5rem'
  , display: 'block'
  , width: '100%'
  , padding: 0
  , resize: 'none'
  , color: 'inherit'
  , backgroundColor: colors.highlight
  , border: 0
  , borderRadius: 0
  , outline: 'none'
  , overflow: 'hidden'
  }

function resize () {
  const { textarea } = this.refs
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}


class TextareaAutosize extends React.Component {
  constructor () {
    super()
    this.resize = resize.bind(this)
  }
  componentDidMount () {
    this.resize()
    if (this.props.defaultFocus === true) {
      this.refs.textarea.focus()
    }
  }
  componentDidUpdate () {
    this.resize()
  }
  render () {
    const {label, placeholder, defaultValue} = this.props

    return el('div'
    , { className: 'TextareaAutosize'
      , style: containerStyle
      }
    , el('label'
      , {}
      , label
      , el('textarea'
        , { ref: 'textarea'
          , style: areaStyle
          , defaultValue
          , placeholder
          , onChange: this.onChange.bind(this)
          , rows: 1
          , onFocus: this.resize
          }
        )
      )
    )
  }
  onChange (event) {
    this.props.onChange(event)
    this.resize()
  }
}
TextareaAutosize.propTypes =
  { defaultValue: React.PropTypes.string
  , defaultFocus: React.PropTypes.bool
  , label: React.PropTypes.string
  , placeholder: React.PropTypes.string
  , onChange: React.PropTypes.func
  }
export default React.createFactory(TextareaAutosize)
