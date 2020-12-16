/*jshint esversion: 6, browser: true*/

export const createProxy = obj => {
  const subscriptors = [];
  const simple_subscribe = (channel, sub) => {
    subscriptors[channel] = subscriptors[channel] || [];
    subscriptors[channel].push(sub);
  };
  const subscribe = (channel, sub) => {
    if (Array.isArray(channel)) {
      channel.forEach(ch => simple_subscribe(ch, sub));
    } else {
      simple_subscribe(channel, sub);
    }
  };
  const publish = (channel, ...args) => {
    (subscriptors[channel] || []).forEach(sub => sub(...args));
  };
  const publishAll = (...args) => {
    Object.keys(subscriptors).forEach(ch => subscriptors[ch].forEach(sub => sub(...args)));
  };
  let proxiedObject = new Proxy(obj, {
    get: function(obj, prop) {
      if (prop === "on") {
        return subscribe;
      } else if (prop === "updateAll") {
        return () => publishAll("*", null, null);
      } else if (prop === "__updateProperty") {
        return (propname) => publishAll(propname, null, null);
      }
      return obj[prop];
    },
    set: function(obj, prop, value) {
      const oldValue = obj[prop];
      obj[prop] = value;
      publish("*", prop, null, null);
      publish(prop, prop, oldValue, value);
      return true;
    }
  });
  return proxiedObject;
};

export const updateArray = (proxy, newArray) => proxy.splice(0, proxy.length, ...newArray);

export const rotateClockwise = ({ x, y }) => {
  return { x: Math.cos(angle) * x - Math.sin(angle) * y, y: Math.sin(angle) * x + Math.cos(angle) * y };
};

export const closestToEndPoint = ({ x0, y0, xf, yf, d }) => {
  //const slope = (yf - y0 + 1e-10) / (xf - x0 + 1e-10);
  const hypotenusa = Math.sqrt((yf - y0) * (yf - y0) + (xf - x0) * (xf - x0));
  const xn = (xf - x0) * (1 - d / hypotenusa) + x0;
  const yn = (yf - y0) * (1 - d / hypotenusa) + y0;
  return [xn, yn];
};

export const proportionalToEndPoint = ({ x0, y0, xf, yf, prop }) => {
  //const slope = (yf - y0 + 1e-10) / (xf - x0 + 1e-10);
  const xn = (xf - x0) * prop + x0;
  const yn = (yf - y0) * prop + y0;
  return [xn, yn];
};

//https://math.stackexchange.com/questions/2051149/how-to-draw-arrowheads
export const pointArrowHead = ({ x0, y0, xf, yf, height, width }) => {
  const hypotenusa = Math.sqrt((yf - y0) * (yf - y0) + (xf - x0) * (xf - x0));
  const xn = (xf - x0) / hypotenusa;
  const yn = (yf - y0) / hypotenusa;
  const xm = xn * (hypotenusa - height) + x0;
  const ym = yn * (hypotenusa - height) + y0;
  const xa = xf - width * xn - height * yn;
  const ya = yf - width * yn + height * xn;
  const xb = xf - width * xn + height * yn;
  const yb = yf - width * yn - height * xn;
  return [xa, ya, xm, ym, xb, yb];
};


//import PIXI from "../../lib/pixi.js@5.0.4/pixi.js";
import PIXI from "../../lib/pixi.js@4.8.6/pixi.js";

export const createCanvasText = ({ content = "", fontSize = 10, color = 0x000000, x = 0, y = 0, angle = 0} = {}) => {
  let text = new PIXI.Text(content);
  text.style.fontFamily = "Arial";
  text.style.fontSize = fontSize;
  text.style.fill = color;
  text.resolution = 2;
  text.rotation = 0;
  text.position.x = x;
  text.position.y = y;
  text.visible = true;
  text.angle = angle;
  return text;
};


export const imageToBase64 = (url) => fetch(url)
  .then(response => response.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  }))

/*
//Usage:
  imageToBase64('./modules/sequential-eeg-connectivity@1.0.0/resources/fmri-brain-squared.png')
  .then(dataUrl => {
    console.log('RESULT:', dataUrl)
  })
*/