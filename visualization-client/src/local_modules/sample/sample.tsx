import React from "react";
import ReactDOM from "react-dom";
import * as PIXI from 'pixi.js';
import { Graphics } from 'pixi.js';
import {PropTypes} from "./prop-types.js";
import * as dat from "./dat.gui.module.js";
import { Stage, ParticleContainer, withPixiApp, Sprite } from '@inlet/react-pixi';

console.log(dat)


const maggot = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/maggot_tiny.png'

/**
* -----------------------------------------------
* Config
* -----------------------------------------------
*/
const config = {
  maggots: 500,
  
  properties: {
    position: true,
    rotation: true,
    scale: false,
    uvs: false,
    alpha: false,    
  },

  listeners: [],
  onChange: function(prop, val) { this.listeners.forEach(l => l(prop, val)) },
}

/**
* -----------------------------------------------
* Settings Component
* -----------------------------------------------
*/
class Settings extends React.PureComponent {
  
  state = { ...config.properties, maggots: config.maggots, changed: false }

  componentDidMount() {
    config.listeners.push(this.onChange)
  }

  onChange = (prop, val) => {
    this.setState({ [prop]: val, changed: true })
    
    // creates new ParticleContainer as properties cannot be changed over time
    clearTimeout(this.changeTimeout)
    this.changeTimeout = setTimeout(() => this.setState({ changed: false }), 0)
  }
  
  render() {
    return this.state.changed ? null : this.props.children(this.state)
  }
}

/**
* -----------------------------------------------
* Maggot Component
* -----------------------------------------------
*/
const Maggot = props => (
  <Sprite {...props} 
          image={maggot} 
          anchor={0.5} 
          overwriteProps={true} 
          ignoreEvents={true} />
)


/**
* -----------------------------------------------
* Batch Component
* -----------------------------------------------
*/
const Batch = withPixiApp(class extends React.PureComponent {
  time = 0
  bounds = null
  state = { items: [], count: 0, component: null }

  static propTypes = {
    count: PropTypes.number.isRequired,
    component: PropTypes.func.isRequired,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.count === nextProps.count && prevState.component === nextProps.component) {
      return prevState
    }
    
    return {
      count: nextProps.count,
      component: nextProps.component,
      items: [...Array(nextProps.count)].map(() => ({
        speed: (2 + Math.random() * 2) * 0.2,
        offset: Math.random() * 100,
        turningSpeed: Math.random() - 0.8,
        direction: Math.random() * Math.PI * 2,
        tint: Math.random() * 0x808080,
        x: Math.random() * 500,
        y: Math.random() * 500,
        _s: 0.8 + Math.random() * 0.3,
        scale: 0.8 + Math.random() * 0.3,
        rotation: 0,
      })) 
    }
  }
  
  componentDidMount() {
    const padding = 100
    
    this.bounds = new PIXI.Rectangle(
      -padding,
      -padding,
      this.props.app.screen.width + padding * 2,
      this.props.app.screen.height + padding * 2
    )
    
    this.props.app.ticker.add(this.tick)
  }
  
  componentWillUnmount() {
    this.props.app.ticker.remove(this.tick)
  }
  
  tick = () => {
    this.setState(
      ({ items }) => ({
        items: items.map(item => {
           let newItem = {
             scale: item._s + Math.sin(this.time * item._s) * 0.25,
             x: item.x + Math.sin(item.direction) * (item.speed * item._s),
             y: item.y + Math.cos(item.direction) * (item.speed * item._s),
             rotation: -item.direction + Math.PI,
             direction: item.direction + item.turningSpeed * 0.01,
          }

          if (newItem.x < this.bounds.x) {
            newItem.x += this.bounds.width
          } else if (newItem.x > this.bounds.x + this.bounds.width) {
            newItem.x -= this.bounds.width
          }

          if (newItem.y < this.bounds.y) {
            newItem.y += this.bounds.height
          } else if (newItem.y > this.bounds.y + this.bounds.height) {
            newItem.y -= this.bounds.height
          }

          return { ...item, ...newItem }
        })
      })
    )
      
    this.time += 0.1
  }
  
  render() {
    const Comp = this.props.component
    return this.state.items.map(props => <Comp {...props} />)
  }
})

const App = () => (
  <Stage width={500} height={500} options={{ backgroundColor: 0xeef1f5 }}>
    <Settings>
      {config => (
        <ParticleContainer properties={config}>
          <Batch count={config.maggots} component={Maggot} />
        </ParticleContainer>
      )}
    </Settings>
  </Stage>
)

ReactDOM.render(<App />, document.body)

// add gui dat
window.onload = function() {
  const gui = new dat.GUI()
  
  gui.add(config, 'maggots', 10, 1000).step(1).onChange(val => config.onChange('maggots', val))
  
  for (let p in config.properties) {
    gui.add(config.properties, p).onChange(val => config.onChange(p, val))
  }
}
