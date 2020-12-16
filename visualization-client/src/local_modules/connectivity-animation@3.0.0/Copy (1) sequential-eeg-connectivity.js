/*jshint esversion: 6, browser: true*/
import Kefir from "../../lib/kefir@3.8.6/kefir.js";
import { el, setChildren, mount, setStyle } from "../../lib/redom@3.24.1/index.js";
import htm from "../../lib/htm@2.2.1/index.js";
import { interpolate } from "../../lib/cubic-spline@0.0.1/index.js";
import { colormap, linearColor, rgb2bin } from "../../lib/colormap@2.3.1/index.js";

console.log(
  colormap({
    colormap: "jet",
    nshades: 10,
    format: "rgbaString"
  })
);
console.log(
  colormap({
    colormap: "jet",
    nshades: 10,
    format: "bin"
  })
);
import PIXI from "../../lib/pixi.js@5.0.4/pixi.js";

//import { computed, observe, dispose } from "../../lib/hyperactiv@0.8.1/index.js";

import { rescaledEEGLocations2D } from "../eeg-positions@1.0.0/eeg2D.js";

import { createCanvasText, createProxy, closestToEndPoint, pointArrowHead, proportionalToEndPoint } from "./utils.js";

const html = htm.bind(el);

//
//
//
const createCanvas = (container, { animation_width, animation_height, animation_background_color, animation_resolution }) => {
  setStyle(container, { width: animation_width + "px", height: animation_height + "px" });
  const app = new PIXI.Application({
    width: animation_width,
    height: animation_height,
    backgroundColor: animation_background_color,
    resolution: animation_resolution,
    autoDensity: true
    //resizeTo: window,
  });
  app.view.classList.add("central-animation");

  setChildren(container, app.view);
  return app;
};

import { imagefMRI } from "./resources/images.js";
//
//
//
const addBrainBackground = (app, container, { brain_width, brain_height, brain_top, brain_left }, use_html = false) => {
  if (use_html) {
    const element = html`
      <div class="brain-background" style="width: ${brain_width}px; height: ${brain_height}px; top: ${brain_top}px; left: ${brain_left}px;" />
    `;
    mount(container, element);
  } else {
    const texture = PIXI.Texture.from(imagefMRI);
    const img = new PIXI.Sprite(texture);
    //img.anchor.set(0.5);
    img.width = brain_width;
    img.height = brain_height;
    img.x = brain_left;
    img.y = brain_top;
    app.stage.addChild(img);
  }
};

//
//
//
const drawPointsEEG = (app, locations) => {
  const eegPositionLayout = new PIXI.Graphics();
  eegPositionLayout.lineStyle(2, 0xfeeb77, 1);
  Object.keys(locations).forEach(m => {
    const v = locations[m];
    eegPositionLayout.beginFill(0x650a5a, 1);
    eegPositionLayout.drawCircle(v[0], v[1], 2);
    eegPositionLayout.endFill();
  });
  app.stage.addChild(eegPositionLayout);
  return eegPositionLayout;
};

//
//
//
const updateTimeSeries = (app, timeseriesCanvas, settings, timeseries_settings, timeseriesCanvasLabels) => {
  for (let i = 0; i < timeseriesCanvasLabels.length; i++) {
    app.stage.removeChild(timeseriesCanvasLabels[i]);
  }
  timeseriesCanvasLabels.splice(0, timeseriesCanvasLabels.length); //CLEAN ARRAY
  const Y = timeseries_settings.timeseries;
  //console.log(":: Updating timeseries_settings.timeseries", Y && Y.length, "x", Y && Y[0] && Y[0].length);
  //
  timeseriesCanvas.clear();
  const interpolatedPoints = 500;
  const plot_distance_y = timeseries_settings.plot_height / Y.length;
  const plot_scale_x = timeseries_settings.plot_width / interpolatedPoints;
  for (let ch = 0; ch < Y.length; ch++) {
    timeseriesCanvas.lineStyle(1, timeseries_settings.map_line_color(ch, 0, Y.length - 1), 1);
    let x0 = timeseries_settings.plot_left;
    let y0 = timeseries_settings.plot_top + ch * plot_distance_y;
    let x = x0;
    let y = y0;
    let Ys = interpolate({ y: Y[ch], lengthExtendedPoints: interpolatedPoints }).y;
    for (let t = 0; t < Ys.length; t++) {
      x = t * plot_scale_x + x0;
      y = Ys[t] * timeseries_settings.plot_scale_y + y0;
      if (t == 0) timeseriesCanvas.moveTo(x, y);
      else timeseriesCanvas.lineTo(x, y);
    }
    //timeseriesCanvas.closePath();
    if (!settings.channels[ch]) continue;
    let text = createCanvasText({ content: settings.channels[ch], fontSize: 10, color: timeseries_settings.label_color, x: x + 5, y: y });
    app.stage.addChild(text);
    timeseriesCanvasLabels.push(text);
  }
};

//
//
//
const randomTimeSeriesData = (timeticks = 10) => {
  //const electrodes = ["F3", "F8", "O1", "P7", "T8", "T5", "F5", "Oz"];
  const electrodes = ["T7", "C5", "C3", "C1", "C2", "C6", "F8", "P8", "O2", "F7", "P7", "O1", "F4", "F6", "P5", "P3", "P1", "P2"];
  const timeseries = [...new Array(electrodes.length)].map(() => [...new Array(timeticks)].map(() => Math.random()));
  return { electrodes, timeseries };
};

//
//
//
const randomConnectivityData = (partialConnectivityMetrics = []) => {
  //const electrodes = ["F3", "F8", "O1", "P7", "T8"];
  const electrodes = ["T7", "C5", "C3", "C1", "C2", "C6", "F8", "P8", "O2", "F7", "P7", "O1", "F4", "F6", "P5", "P3", "P1", "P2"];
  const connectivity = [...new Array(electrodes.length)].map(() => [...new Array(electrodes.length)].map(() => 1 - Math.random() * 2));
  const lagConnectivity = [...new Array(electrodes.length)].map(() => [...new Array(electrodes.length)].map(() => 1 - Math.random() * 2));
  const partialConnectivities = {};
  for (let i = 0; i < partialConnectivityMetrics.length; i++) {
    const metric = partialConnectivityMetrics[i];
    partialConnectivities[metric] = [...new Array(electrodes.length)].map(() => [...new Array(electrodes.length)].map(() => 1 - Math.random() * 2));
  }
  return { electrodes, connectivity, lagConnectivity, partialConnectivities };
};

//
//
//
const updateConnectivity = (app, canvas, locations, electrodes, connectivity, settings, { time = 1000, intervals = 10 } = {}) => {
  const maxvalue = Math.max(...connectivity.flat().map(settings.magnitude_transform));
  const minvalue = Math.min(...connectivity.flat().map(settings.magnitude_transform));
  Kefir.sequentially(time / intervals, [...Array(intervals).keys()]).onValue(x => {
    const prop = x / intervals;
    canvas.clear();
    for (let i = 0; i < electrodes.length; i++) {
      for (let j = 0; j < electrodes.length; j++) {
        if (i == j) continue;
        const magnitude = connectivity[i][j];
        const adjustedMagnitude = settings.magnitude_transform(magnitude);
        const lineColor = settings.map_color(adjustedMagnitude, minvalue, maxvalue);
        const [x0, y0] = locations[electrodes[i]];
        const [xf_base, yf_base] = locations[electrodes[j]];
        const [xf, yf] = proportionalToEndPoint({ x0, xf: xf_base, y0, yf: yf_base, prop: prop });
        const [xa, ya, xm, ym, xb, yb] = pointArrowHead({ x0, y0, xf, yf, width: adjustedMagnitude, height: 0.6 * adjustedMagnitude });
        canvas.lineStyle(adjustedMagnitude, lineColor, 1);
        canvas.moveTo(x0, y0);
        canvas.lineTo(xm, ym);
        canvas.closePath();
        if (adjustedMagnitude > 1) {
          canvas.lineStyle(5, lineColor, 1);
          canvas.beginFill(lineColor, 1);
          canvas.moveTo(xm, ym);
          canvas.lineTo(xa, ya);
          canvas.lineTo(xf, yf);
          canvas.lineTo(xb, yb);
          canvas.closePath();
          canvas.endFill();
        }
      }
    }
  });
};

//
//
//
const updateConnectivityHeadmap = (app, canvas, electrodes, connectivity, settings) => {
  canvas.clear();
  settings._canvasTextCache = settings._canvasTextCache || [];
  const dx = settings.width / electrodes.length;
  const dy = settings.height / electrodes.length;
  const maxvalue = Math.max(...connectivity.flat().map(settings.magnitude_transform));
  const minvalue = Math.min(...connectivity.flat().map(settings.magnitude_transform));
  if (settings._canvasTextCache.length == 0) {
    for (let i = 0; i < electrodes.length; i++) {
      const rowText = createCanvasText({
        content: electrodes[i],
        fontSize: settings.font_size,
        color: settings.label_color,
        x: settings.x0 + settings.width + 5,
        y: settings.y0 + dy * i + (dy - settings.font_size) / 2
      });
      const colText = createCanvasText({
        content: electrodes[i],
        fontSize: settings.font_size,
        color: settings.label_color,
        x: settings.x0 + dx * i + (dx - settings.font_size) / 2,
        y: settings.y0 + settings.height + 5,
        angle: 30
      });
      app.stage.addChild(rowText);
      app.stage.addChild(colText);
      settings._canvasTextCache.push(rowText);
      settings._canvasTextCache.push(colText);
    }
    const titleText = createCanvasText({
      content: settings.title,
      fontSize: settings.title_font_size,
      color: settings.label_color,
      x: settings.x0 + 5,
      y: settings.y0 - settings.title_font_size - 5
    });
    app.stage.addChild(titleText);
    settings._canvasTextCache.push(titleText);
  }
  for (let i = 0; i < electrodes.length; i++) {
    for (let j = 0; j < electrodes.length; j++) {
      //if (i == j) continue;
      const magnitude = connectivity[i][j];
      const adjustedMagnitude = settings.magnitude_transform(magnitude);
      const rectColor = settings.map_color(adjustedMagnitude, minvalue, maxvalue);
      const lineColor = settings.line_color;
      const x0 = settings.x0 + dx * i;
      const y0 = settings.y0 + dy * j;
      canvas.lineStyle(1, lineColor, 1);
      canvas.beginFill(rectColor, 1);
      canvas.moveTo(x0, y0);
      canvas.drawRect(x0, y0, dx, dy);
      canvas.closePath();
      canvas.endFill();
    }
  }
};

//@view
//@no-safe
const createDefaultScreen = ({testMode}) => {
  let settings = createProxy({
    animation_width: 1200,
    animation_height: 700,
    animation_background_color: 0x252626,
    animation_resolution: 1.25,
    brain_width: 240,
    brain_height: 300,
    brain_top: 50,
    brain_left: 50,
    show_brain_electrodes: true, // REACTIVE
    channels: [], // REACTIVE
  });
  let indexChannels = [];
  let locationChannels = [];

  const element = html`
    <div class="sequential-animation-screen">
      <div class="animation-container"></div>
    </div>
  `;

  element.settings = settings;

  const container = element.querySelector(".animation-container");

  const app = createCanvas(container, settings);

  addBrainBackground(app, container, settings);

  const locations = rescaledEEGLocations2D({ width: settings.brain_width, height: settings.brain_height, top: settings.brain_top, left: settings.brain_left }, true);
  settings.on(["channels"], () => {
    console.log(":: Updating indexChannels and locationChannels", settings.channels);
    locationChannels = settings.channels.map(chname => locations[chname]);
    indexChannels = settings.channels.map(chname => Object.keys(locations).indexOf(chname));
  });

  const eegPositionLayout = drawPointsEEG(app, locations);

  settings.on(["show_brain_electrodes"], () => {
    console.log(":: Updating show_brain_electrodes", settings.show_brain_electrodes);
    eegPositionLayout.visible = settings.show_brain_electrodes;
  });

  setTimeout(() => {
    settings.show_brain_electrodes = false;
  }, 2000);

  let timeseries_settings = createProxy({
    timeseries: [], //REACTIVE
    size_buffer: 50,
    freq_request: 5,
    plot_top: 50,
    plot_left: 300,
    plot_height: 300,
    plot_width: 450,
    plot_scale_y: 50,
    map_line_color: (i, i_min, i_max) => linearColor({ from: [217, 246, 254], to: [252, 254, 217], value: (i - i_min) / (i_max - i_min) }),
    label_color: rgb2bin([217, 246, 254])
  });
  const timeseriesCanvas = new PIXI.Graphics();
  let timeseriesCanvasLabels = [];
  app.stage.addChild(timeseriesCanvas);
  timeseries_settings.on(["timeseries"], () => {
    updateTimeSeries(app, timeseriesCanvas, settings, timeseries_settings, timeseriesCanvasLabels);
  });

  setTimeout(() => {
    /*let { electrodes, timeseries } = randomTimeSeriesData();
    settings.channels = electrodes;
    timeseries_settings.timeseries = timeseries;*/
    let { electrodes,} = randomConnectivityData();
    settings.channels = electrodes;
    timeseries_settings.timeseries = [...new Array(electrodes.length).keys()].map(_ =>       [...new Array(timeseries_settings.size_buffer).keys()].map(_ => 0));
  }, 1);
  Kefir.interval((1 / timeseries_settings.freq_request) * 1000, 1).onValue(() => {
    let { electrodes, timeseries } = randomTimeSeriesData();
    /*
    //Straightforward:
    timeseries = timeseries.map((m, i) => {
      timeseries_settings.timeseries[i].splice(0, 1);
      timeseries_settings.timeseries[i].push(m[0]);
      return timeseries_settings.timeseries[i];
    });
    timeseries_settings.timeseries = timeseries;
    */
    //More efficient:
    for (let i = 0; i < timeseries.length; i++) {
      timeseries_settings.timeseries[i].splice(0, 1);
      timeseries_settings.timeseries[i].push(Math.random());
    }
    timeseries_settings.__updateProperty("timeseries");
  });

  //
  const connectivityLinksCanvas = new PIXI.Graphics();
  app.stage.addChild(connectivityLinksCanvas);
  const connectivitySettings = createProxy({
    updating_interval: 1000,
    map_color: (i, i_min, i_max) => linearColor({ from: [217, 246, 254], to: [252, 254, 217], value: (i - i_min) / (i_max - i_min) }),
    magnitude_transform: x => 10 * x
  });
  //
  const connectivityHeadmapCanvas = new PIXI.Graphics();
  app.stage.addChild(connectivityHeadmapCanvas);
  const connectivity_headmap_settings = createProxy({
    updating_interval: 1000,
    magnitude_transform: x => 10 * x,
    x0: 800,
    y0: 50,
    width: 300,
    height: 300,
    font_size: 8,
    map_color: (i, i_min, i_max) => linearColor({ from: [217, 246, 254], to: [252, 254, 217], value: (i - i_min) / (i_max - i_min) }),
    line_color: rgb2bin([217, 246, 254]),
    label_color: rgb2bin([217, 246, 254]),
    title: "Cross-lag Maximum Partial Directed Coherence",
    title_font_size: 12
  });
  //
  const lagHeadmapCanvas = new PIXI.Graphics();
  app.stage.addChild(lagHeadmapCanvas);
  const lagHeadmapSettings = createProxy({
    updating_interval: 1000,
    magnitude_transform: x => 10 * x,
    x0: 850,
    y0: 400,
    width: 200,
    height: 200,
    font_size: 9,
    map_color: (i, i_min, i_max) => linearColor({ from: [217, 246, 254], to: [252, 254, 217], value: (i - i_min) / (i_max - i_min) }),
    line_color: rgb2bin([217, 246, 254]),
    label_color: rgb2bin([217, 246, 254]),
    title: "Maximum Lag Dependency",
    title_font_size: 12
  });

  //
  const requested_specific_connectivities = {
    delta: "Delta [1Hz-4Hz]",
    theta: "Theta [4Hz-8Hz]",
    alpha: "Alpha [8Hz-12Hz]",
    beta: "Beta [12Hz-30Hz]",
    gamma: "Gamma* [30Hz-50Hz]"
  };
  const connectivity_mini_headmap_base_settings = {
    updating_interval: 1000,
    magnitude_transform: x => 10 * x,
    x0: 50,
    y0: 450,
    width: 100,
    height: 100,
    font_size: 5,
    map_color: (i, i_min, i_max) => linearColor({ from: [217, 246, 254], to: [252, 254, 217], value: (i - i_min) / (i_max - i_min) }),
    line_color: rgb2bin([217, 246, 254]),
    label_color: rgb2bin([217, 246, 254]),
    title: "[XYZ]",
    title_font_size: 10
  };
  const connectivityMiniHeadmapCanvas = Object.keys(requested_specific_connectivities).map(_ => new PIXI.Graphics());
  connectivityMiniHeadmapCanvas.forEach(canvas => app.stage.addChild(canvas));
  const connectivity_mini_headmap_settings = Object.keys(requested_specific_connectivities).map((key, i) =>
    createProxy({
      ...connectivity_mini_headmap_base_settings,
      x0: connectivity_mini_headmap_base_settings.x0 + i * (20 + connectivity_mini_headmap_base_settings.width),
      title: requested_specific_connectivities[key]
    })
  );

  Kefir.interval(connectivitySettings.updating_interval, 1).onValue(() => {
    let { electrodes, connectivity, lagConnectivity, partialConnectivities } = randomConnectivityData(Object.keys(requested_specific_connectivities));
    updateConnectivity(app, connectivityLinksCanvas, locations, electrodes, connectivity, connectivitySettings, { time: 0.9 * connectivitySettings.updating_interval, intervals: 10 });
    updateConnectivityHeadmap(app, connectivityHeadmapCanvas, electrodes, connectivity, connectivity_headmap_settings);
    updateConnectivityHeadmap(app, lagHeadmapCanvas, electrodes, lagConnectivity, lagHeadmapSettings);
    for (let k = 0; k < connectivityMiniHeadmapCanvas.length; k++) {
      updateConnectivityHeadmap(app, connectivityMiniHeadmapCanvas[k], electrodes, partialConnectivities[Object.keys(requested_specific_connectivities)[k]], connectivity_mini_headmap_settings[k]);
    }
  });

  return element;
};

export const SequentialEEGConnectivityScreen = ({testMode=true}={}) => createDefaultScreen({testMode});
