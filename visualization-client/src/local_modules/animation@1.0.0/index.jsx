import React from "react";
import { Graphics } from 'pixi.js';
import { PixiComponent, Stage } from '@inlet/react-pixi';

const Rectangle = PixiComponent('Rectangle', {
  create: props => new Graphics(),
  applyProps: (instance, _, props) => {
    const { x, y, width, height, fill } = props;
    instance.clear();
    instance.beginFill(fill);
    instance.drawRect(x, y, width, height);
    instance.endFill();
  },
});

const Circle = PixiComponent('Circle', {
  create: props => new Graphics(),
  applyProps: (instance, _, props) => {
    const { x, y, radius, fill } = props;
    instance.clear();
    instance.beginFill(fill);
    instance.drawCircle(x, y, radius);
    instance.endFill();
  },
});

export const SampleGraphics = ({width=800, height=600}) => (
  <Stage width={width} height={height}>
    <Rectangle x={100} y={100} width={500} height={300} fill={0x000000} />
    <Circle x={100} y={100} radius={50} fill={0xff0001} />
  </Stage>
);
