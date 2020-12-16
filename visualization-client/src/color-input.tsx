import React from "react";
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss';

interface IColor {
  r: string;
  g: string;
  b: string;
  a: string;
}
interface IColorButtonPickerProp {
  color: IColor;
}
interface IColorButtonPickerState {
  displayColorPicker: bool;
  color?: IColor;
}
export class ColorButtonPicker extends React.Component<IColorButtonPickerProp, IColorButtonPickerState> {
  static defaultProps = {
    color: {
      r: '241',
      g: '112',
      b: '19',
      a: '1',
    },
  };

  state = {
    displayColorPicker: false,
    color: null,
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  }

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  }

  handleChange = (color) => {
    this.setState({ color: color.rgb })
  }

  render() {
    if(this.state.color === null)
      this.state.color = this.props.color;
    const styles = reactCSS({
      'default': {
        color: {
          width: '100%',
          height: '14px',
          borderRadius: '2px',
          background: `rgba(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b}, ${this.state.color.a})`,
        },
        swatch: {
          width: '100%',
          minWidth: '30px',
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <div>
        <div style={styles.swatch} onClick={this.handleClick}>
          <div style={styles.color} />
        </div>
        {
          this.state.displayColorPicker
            ? <div style={styles.popover}>
              <div style={styles.cover} onClick={this.handleClose} />
              <SketchPicker color={this.state.color} onChange={this.handleChange} />
            </div>
            : null
        }
      </div>
    )
  }
}