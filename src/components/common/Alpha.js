import React from 'react'
import reactCSS from 'reactcss'
import shallowCompare from 'react-addons-shallow-compare'
import * as alpha from '../../helpers/alpha'

import Checkboard from './Checkboard'

export class Alpha extends React.Component {
  shouldComponentUpdate = shallowCompare.bind(this, this, arguments[0], arguments[1])

  componentWillUnmount() {
    this.unbindEventListeners()
  }

  handleChange = (e, skip) => {
    const change = alpha.calculateChange(e, skip, this.props, this.refs.container)
    change && this.props.onChange(change)
  }

  handleMouseDown = (e) => {
    this.handleChange(e, true)
    window.addEventListener('mousemove', this.handleChange)
    window.addEventListener('mouseup', this.handleMouseUp)
  }

  handleMouseUp = () => {
    this.unbindEventListeners()
  }

  unbindEventListeners = () => {
    window.removeEventListener('mousemove', this.handleChange)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }

  render() {
    const rgb = this.props.rgb
    const styles = reactCSS({
      'default': {
        alpha: {
          absolute: '0px 0px 0px 0px',
          borderRadius: this.props.radius,
        },
        checkboard: {
          absolute: '0px 0px 0px 0px',
          overflow: 'hidden',
        },
        gradient: {
          absolute: '0px 0px 0px 0px',
          background: `linear-gradient(to right, rgba(${ rgb.r },${ rgb.g },${ rgb.b }, 0) 0%,
           rgba(${ rgb.r },${ rgb.g },${ rgb.b }, 1) 100%)`,
          boxShadow: this.props.shadow,
          borderRadius: this.props.radius,
        },
        container: {
          position: 'relative',
          height: '100%',
          margin: '0 3px',
        },
        pointer: {
          position: 'absolute',
          left: `${ rgb.a * 100 }%`,
        },
        slider: {
          width: '4px',
          borderRadius: '1px',
          height: '8px',
          boxShadow: '0 0 2px rgba(0, 0, 0, .6)',
          background: '#fff',
          marginTop: '1px',
          transform: 'translateX(-2px)',
        },
      },
      'overwrite': {
        ...this.props.style,
      },
    }, 'overwrite')

    return (
      <div style={ styles.alpha }>
        <div style={ styles.checkboard }>
          <Checkboard />
        </div>
        <div style={ styles.gradient } />
        <div
          style={ styles.container }
          ref="container"
          onMouseDown={ this.handleMouseDown }
          onTouchMove={ this.handleChange }
          onTouchStart={ this.handleChange }
        >
          <div style={ styles.pointer }>
            { this.props.pointer ? (
              <this.props.pointer { ...this.props } />
            ) : (
              <div style={ styles.slider } />
            ) }
          </div>
        </div>
      </div>
    )
  }
}

export default Alpha
