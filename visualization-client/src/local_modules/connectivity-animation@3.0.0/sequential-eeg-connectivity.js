/*jshint esversion: 6, browser: true*/
import Kefir from "../../lib/kefir@3.8.6/kefir.js";
import { el, setChildren, mount, setStyle } from "../../lib/redom@3.24.1/index.js";
import htm from "../../lib/htm@2.2.1/index.js";
import { interpolate } from "../../lib/cubic-spline@0.0.1/index.js";
import { ColorPicker } from "../../lib/color-picker@1.4.2/color-picker.js";
import { colormap, linearColor, rgb2bin, rgb2hex } from "../../lib/colormap@2.3.1/index.js";

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
//import PIXI from "../../lib/pixi.js@5.0.4/pixi.js";
import PIXI from "../../lib/pixi.js@4.8.6/pixi.js";

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
    autoDensity: true,
    //resizeTo: window,
    //transparent: true,
    forceFXAA: true
  });
  app.view.classList.add("central-animation");
  if (PIXI.VERSION == "4.8.6") app.view.style.zoom = 1 / animation_resolution;

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
  const map_line_color = (i, i_min, i_max) => linearColor({ from: timeseries_settings.line_color_0, to: timeseries_settings.line_color_1, value: (i - i_min) / (i_max - i_min) });
  for (let ch = 0; ch < Y.length; ch++) {
    //timeseriesCanvas.lineStyle(1, timeseries_settings.map_line_color(ch, 0, Y.length - 1), 1);
    timeseriesCanvas.lineStyle(1, map_line_color(ch, 0, Y.length - 1), 1);
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
  const map_color = (i, i_min, i_max) => linearColor({ from: settings.color_0, to: settings.color_1, value: (i - i_min) / (i_max - i_min) });
  Kefir.sequentially(time / intervals, [...Array(intervals).keys()]).onValue(x => {
    const prop = x / intervals;
    canvas.clear();
    for (let i = 0; i < electrodes.length; i++) {
      for (let j = 0; j < electrodes.length; j++) {
        if (i == j) continue;
        const magnitude = connectivity[i][j];
        const adjustedMagnitude = settings.magnitude_transform(magnitude);
        //const lineColor = settings.map_color(adjustedMagnitude, minvalue, maxvalue);
        const lineColor = map_color(adjustedMagnitude, minvalue, maxvalue);
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
  const map_color = (i, i_min, i_max) => linearColor({ from: settings.color_0, to: settings.color_1, value: (i - i_min) / (i_max - i_min) });
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
      //const rectColor = settings.map_color(adjustedMagnitude, minvalue, maxvalue);
      const rectColor = map_color(adjustedMagnitude, minvalue, maxvalue);
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
const createDefaultScreen = (settings = { animation: {}, timeseries: {}, connectivity_headmap: {}, lag_headmap: {}, requested_connectivities: {}, connectivity_mini_headmap: {} }, testMode = true) => {
  let animation_settings = createProxy({
    animation_width: 1200,
    animation_height: 700,
    animation_background_color: 0x252626,
    animation_resolution: 1.25,
    brain_width: 240,
    brain_height: 300,
    brain_top: 50,
    brain_left: 50,
    show_brain_electrodes: false, // REACTIVE
    channels: [], // REACTIVE
    ...(settings.animation || {})
  });

  let timeseries_settings = createProxy({
    timeseries: [], //REACTIVE
    size_buffer: 50,
    freq_request: 5,
    plot_top: 50,
    plot_left: 300,
    plot_height: 300,
    plot_width: 450,
    plot_scale_y: 50,
    //map_line_color: (i, i_min, i_max) => linearColor({ from: [217, 246, 254], to: [252, 254, 217], value: (i - i_min) / (i_max - i_min) }),
    line_color_0: [217, 246, 254],
    line_color_1: [252, 254, 217],
    label_color: rgb2bin([217, 246, 254]),
    ...(settings.timeseries || {})
  });

  const connectivity_headmap_settings = createProxy({
    //updating_interval: 1000,
    magnitude_transform: x => 10 * x,
    x0: 800,
    y0: 50,
    width: 300,
    height: 300,
    font_size: 8,
    //map_color: (i, i_min, i_max) => linearColor({ from: [217, 246, 254], to: [252, 254, 217], value: (i - i_min) / (i_max - i_min) }),
    color_0: [217, 246, 254],
    color_1: [252, 254, 217],
    line_color: rgb2bin([217, 246, 254]),
    label_color: rgb2bin([217, 246, 254]),
    title: "Cross-lag Maximum Partial Directed Coherence",
    title_font_size: 12,
    ...(settings.connectivity_headmap || {})
  });

  const lag_headmap_settings = createProxy({
    //updating_interval: 1000,
    magnitude_transform: x => 10 * x,
    x0: 850,
    y0: 400,
    width: 200,
    height: 200,
    font_size: 9,
    //map_color: (i, i_min, i_max) => linearColor({ from: [217, 246, 254], to: [252, 254, 217], value: (i - i_min) / (i_max - i_min) }),
    color_0: [217, 246, 254],
    color_1: [252, 254, 217],
    line_color: rgb2bin([217, 246, 254]),
    label_color: rgb2bin([217, 246, 254]),
    title: "Maximum Lag Dependency",
    title_font_size: 12,
    ...(settings.lag_headmap || {})
  });

  const requested_specific_connectivities = {
    delta: "Delta [1Hz-4Hz]",
    theta: "Theta [4Hz-8Hz]",
    alpha: "Alpha [8Hz-12Hz]",
    beta: "Beta [12Hz-30Hz]",
    gamma: "Gamma* [30Hz-50Hz]",
    ...(settings.requested_connectivities || {})
  };

  const connectivity_mini_headmap_base_settings = {
    //updating_interval: 1000,
    magnitude_transform: x => 10 * x,
    x0: 50,
    y0: 450,
    width: 100,
    height: 100,
    font_size: 5,
    //map_color: (i, i_min, i_max) => linearColor({ from: [217, 246, 254], to: [252, 254, 217], value: (i - i_min) / (i_max - i_min) }),
    color_0: [217, 246, 254],
    color_1: [252, 254, 217],
    line_color: rgb2bin([217, 246, 254]),
    label_color: rgb2bin([217, 246, 254]),
    title: "[XYZ]",
    title_font_size: 10,
    ...(settings.connectivity_mini_headmap || {})
  };

  const connectivity_settings = createProxy({
    freq_request: 0.5,
    //map_color: (i, i_min, i_max) => linearColor({ from: [217, 246, 254], to: [252, 254, 217], value: (i - i_min) / (i_max - i_min) }),
    color_0: [217, 246, 254],
    color_1: [252, 254, 217],
    magnitude_transform: x => 10 * x
  });

  //
  const element = html`
    <div class="sequential-animation-screen">
      <div class="animation-container"></div>
    </div>
  `;

  element.settings = {
    animation: animation_settings,
    timeseries: timeseries_settings,
    connectivity_headmap: connectivity_headmap_settings,
    lag_headmap: lag_headmap_settings,
    requested_connectivities: requested_specific_connectivities,
    connectivity_mini_headmap: connectivity_mini_headmap_base_settings,
    connectivity: connectivity_settings
  };

  const container = element.querySelector(".animation-container");
  const app = createCanvas(container, animation_settings);
  addBrainBackground(app, container, animation_settings);

  element.finalize = () => {
    console.log("destroyed");
    app.destroy(true);
    element.removeChild(container);
    delete element.settings;
  };

  const locations = rescaledEEGLocations2D(
    { width: animation_settings.brain_width, height: animation_settings.brain_height, top: animation_settings.brain_top, left: animation_settings.brain_left },
    true
  );

  const eegPositionLayout = drawPointsEEG(app, locations);
  animation_settings.on(["show_brain_electrodes"], () => {
    console.log(":: Updating show_brain_electrodes", animation_settings.show_brain_electrodes);
    eegPositionLayout.visible = animation_settings.show_brain_electrodes;
  });

  const timeseriesCanvas = new PIXI.Graphics();
  let timeseriesCanvasLabels = [];
  app.stage.addChild(timeseriesCanvas);
  timeseries_settings.on(["timeseries"], () => {
    updateTimeSeries(app, timeseriesCanvas, animation_settings, timeseries_settings, timeseriesCanvasLabels);
  });

  //
  const connectivityLinksCanvas = new PIXI.Graphics();
  app.stage.addChild(connectivityLinksCanvas);
  //
  const connectivityHeadmapCanvas = new PIXI.Graphics();
  app.stage.addChild(connectivityHeadmapCanvas);
  //
  const lagHeadmapCanvas = new PIXI.Graphics();
  app.stage.addChild(lagHeadmapCanvas);

  //
  const connectivityMiniHeadmapCanvas = Object.keys(requested_specific_connectivities).map(_ => new PIXI.Graphics());
  connectivityMiniHeadmapCanvas.forEach(canvas => app.stage.addChild(canvas));
  const connectivity_mini_headmap_settings = Object.keys(requested_specific_connectivities).map((key, i) =>
    createProxy({
      ...connectivity_mini_headmap_base_settings,
      x0: connectivity_mini_headmap_base_settings.x0 + i * (20 + connectivity_mini_headmap_base_settings.width),
      title: requested_specific_connectivities[key]
    })
  );
  //
  // TEST
  //
  if (testMode) {
    setTimeout(() => {
      animation_settings.show_brain_electrodes = true;
    }, 2000);

    setTimeout(() => {
      let { electrodes } = randomConnectivityData();
      animation_settings.channels = electrodes;
      timeseries_settings.timeseries = [...new Array(electrodes.length).keys()].map(_ => [...new Array(timeseries_settings.size_buffer).keys()].map(_ => 0));
    }, 1);

    Kefir.withInterval(1000 / timeseries_settings.freq_request, emitter => {
      if (!app.stage) emitter.end();
      try {
        let { electrodes, timeseries } = randomTimeSeriesData();
        for (let i = 0; i < timeseries.length; i++) {
          timeseries_settings.timeseries[i].splice(0, 1);
          timeseries_settings.timeseries[i].push(Math.random());
        }
        timeseries_settings.__updateProperty("timeseries");
        emitter.emit(0);
      } catch (e) {
        emitter.end();
      }
    }).onValue(() => null);
    Kefir.withInterval(1000 / connectivity_settings.freq_request, emitter => {
      if (!app.stage) emitter.end();
      try {
        let { electrodes, connectivity, lagConnectivity, partialConnectivities } = randomConnectivityData(Object.keys(requested_specific_connectivities));
        updateConnectivity(app, connectivityLinksCanvas, locations, electrodes, connectivity, connectivity_settings, { time: (0.9 * 1000) / connectivity_settings.freq_request, intervals: 10 });
        updateConnectivityHeadmap(app, connectivityHeadmapCanvas, electrodes, connectivity, connectivity_headmap_settings);
        updateConnectivityHeadmap(app, lagHeadmapCanvas, electrodes, lagConnectivity, lag_headmap_settings);
        for (let k = 0; k < connectivityMiniHeadmapCanvas.length; k++) {
          updateConnectivityHeadmap(app, connectivityMiniHeadmapCanvas[k], electrodes, partialConnectivities[Object.keys(requested_specific_connectivities)[k]], connectivity_mini_headmap_settings[k]);
        }
        emitter.emit(0);
      } catch (e) {
        emitter.end();
      }
    }).onValue(() => null);
  }
  return element;
};

const parsePropertyToElement = ({ category, prop, initial, min, max, label, type }) => {
  let property_input;
  if (type === "integer") {
    property_input = html`
      <td>
        <input settings="${category}.${prop}" type="text" data-validate="required digits min=${min} max=${max}" value="${initial}" />
        <span class="invalid_feedback">Parameter should an integer between ${min} and ${max}.</span>
      </td>
    `;
    property_input.inputValue = () => Number.parseInt(property_input.querySelector(":scope > input").value);
  } else if (type === "float") {
    property_input = html`
      <td>
        <input settings="${category}.${prop}" type="text" data-validate="required number min=${min} max=${max}" value="${initial}" />
        <span class="invalid_feedback">Parameter should an real number between ${min} and ${max}.</span>
      </td>
    `;
    property_input.inputValue = () => Number.parseFloat(property_input.querySelector(":scope > input").value);
  } else if (type === "string") {
    property_input = html`
      <td>
        <input settings="${category}.${prop}" type="text" data-validate="required" value="${initial}" />
      </td>
    `;
    property_input.inputValue = () => property_input.querySelector(":scope > input").value;
  } else if (type === "eval") {
    property_input = html`
      <td>
        <input settings="${category}.${prop}" type="text" data-validate="required" value="${initial}" mode-eval />
      </td>
    `;
    property_input.inputValue = () => eval(property_input.querySelector(":scope > input").value);
  } else if (type === "bool") {
    property_input = html`
      <td>
        <input settings="${category}.${prop}" type="checkbox" data-role="switch" ${initial ? "checked" : ""} />
      </td>
    `;
    property_input.inputValue = () => property_input.querySelector(":scope > label > input").value === "on";
  } else if (type === "veccolor" || type === "bincolor") {
    const color_initial = rgb2hex(initial);
    property_input = html`
      <td>
        <input settings="${category}.${prop}" type="text" data-validate="required" value="${color_initial}" />
      </td>
    `;
    const picker = new ColorPicker(property_input.querySelector(":scope > input"));
    picker.on("change", function(color) {
      this.source.value = "#" + color;
      this.source.style.backgroundColor = `rgb(${parseInt(color.slice(0, 2), 16)}, ${parseInt(color.slice(2, 4), 16)}, ${parseInt(color.slice(4, 6), 16)})`;
      this.source.style.color = `rgb(${255 - parseInt(color.slice(0, 2), 16)}, ${255 - parseInt(color.slice(2, 4), 16)}, ${255 - parseInt(color.slice(4, 6), 16)})`;
      //
      this.source.binvalue = parseInt(color, 16);
      this.source.vecvalue = [parseInt(color.slice(0, 2), 16), parseInt(color.slice(2, 4), 16), parseInt(color.slice(4, 6), 16)];
    });
    property_input.inputValue = () => (type === "veccolor" ? picker.source.vecvalue : type === "bincolor" ? picker.source.binvalue : picker.source.value);
  }
  const property = html`
    <tr>
      <td>${label}</td>
      ${property_input}
    </tr>
  `;
  property.inputValue = property_input.inputValue;
  return property;
};
const createSettingsForm = () => {
  const form = html`
    <form data-role="validator" action="javascript:" data-interactive-check="true">
      <table class="settings table compact striped"></table>
    </form>
  `;
  const form_container = form.querySelector(":scope > .settings");
  const settings_detail = [
    {
      category: "animation",
      label: "Animation properties",
      nodes: [
        { prop: "animation_width", initial: 1200, min: 1000, max: 2000, label: "Animation width" },
        { prop: "animation_height", initial: 700, min: 600, max: 1000, label: "Animation height" },
        { prop: "animation_background_color", initial: [37, 38, 38], label: "Background color", type: "bincolor" },
        { prop: "animation_resolution", initial: 1.25, min: 1, max: 3, label: "Resolution", type: "float" },
        { prop: "brain_width", initial: 240, min: 200, max: 600, label: "Brain image width" },
        { prop: "brain_height", initial: 300, min: 200, max: 600, label: "Brain image height" },
        { prop: "brain_top", initial: 50, min: 0, max: 1000, label: "Brain image position top" },
        { prop: "brain_left", initial: 50, min: 0, max: 2000, label: "Brain image position left" },
        { prop: "show_brain_electrodes", initial: true, label: "Show electrodes layout", type: "bool", reactive: true }
      ]
    },
    {
      category: "timeseries",
      label: "Time series properties",
      nodes: [
        { prop: "size_buffer", initial: 50, min: 10, max: 2000, label: "Buffer size" },
        { prop: "freq_request", initial: 5, min: 1, max: 100, label: "Updating frequency [Hz]", type: "float" },
        { prop: "plot_width", initial: 300, min: 200, max: 600, label: "Plot width" },
        { prop: "plot_height", initial: 450, min: 200, max: 600, label: "Plot height" },
        { prop: "plot_top", initial: 50, min: 0, max: 1000, label: "Plot position top" },
        { prop: "plot_left", initial: 300, min: 0, max: 2000, label: "Plot position left" },
        { prop: "plot_scale_y", initial: 50, min: 0.1, max: 200, label: "Vertical scale", type: "float" },
        { prop: "line_color_0", initial: [217, 246, 254], label: "Line color 0", type: "veccolor" },
        { prop: "line_color_1", initial: [252, 254, 217], label: "Line color 1", type: "veccolor" },
        { prop: "label_color", initial: [217, 246, 254], label: "Line color 1", type: "bincolor" }
      ]
    },
    {
      category: "connectivity",
      label: "Brain 2D connectivity animation",
      nodes: [
        { prop: "freq_request", initial: 1, min: 0.01, max: 100, label: "Updating frequency [Hz]", type: "float" },
        { prop: "color_0", initial: [217, 246, 254], label: "Line color 0", type: "veccolor" },
        { prop: "color_1", initial: [252, 254, 217], label: "Line color 1", type: "veccolor" },
        { prop: "magnitude_transform", initial: "x => 10 * x", label: "Magnitude transform", type: "eval" }
      ]
    },
    {
      category: "connectivity_headmap",
      label: "Connectivity headmap properties",
      nodes: [
        { prop: "magnitude_transform", initial: "x => 10 * x", label: "Magnitude transform", type: "eval" },
        { prop: "x0", initial: 800, min: 0, max: 1000, label: "Headmap position left" },
        { prop: "y0", initial: 50, min: 0, max: 2000, label: "Headmap position top" },
        { prop: "width", initial: 300, min: 100, max: 600, label: "Headmap width" },
        { prop: "height", initial: 300, min: 100, max: 600, label: "Headmap height" },
        { prop: "font_size", initial: 9, min: 2, max: 30, label: "Font size" },
        { prop: "color_0", initial: [217, 246, 254], label: "Line color 0", type: "veccolor" },
        { prop: "color_1", initial: [252, 254, 217], label: "Line color 1", type: "veccolor" },
        { prop: "line_color", initial: [217, 246, 254], label: "Line color 1", type: "bincolor" },
        { prop: "label_color", initial: [217, 246, 254], label: "Line color 1", type: "bincolor" },
        { prop: "title", initial: "Cross-lag Maximum Partial Directed Coherence", label: "Title", type: "string" },
        { prop: "title_font_size", initial: 12, min: 2, max: 30, label: "Title font size" }
      ]
    },
    {
      category: "lag_headmap",
      label: "Secondary headmap properties",
      nodes: [
        { prop: "magnitude_transform", initial: "x => 10 * x", label: "Magnitude transform", type: "eval" },
        { prop: "x0", initial: 850, min: 0, max: 1000, label: "Headmap position left" },
        { prop: "y0", initial: 400, min: 0, max: 2000, label: "Headmap position top" },
        { prop: "width", initial: 200, min: 100, max: 600, label: "Headmap width" },
        { prop: "height", initial: 200, min: 100, max: 600, label: "Headmap height" },
        { prop: "font_size", initial: 9, min: 2, max: 30, label: "Font size" },
        { prop: "color_0", initial: [217, 246, 254], label: "Line color 0", type: "veccolor" },
        { prop: "color_1", initial: [252, 254, 217], label: "Line color 1", type: "veccolor" },
        { prop: "line_color", initial: [217, 246, 254], label: "Line color 1", type: "bincolor" },
        { prop: "label_color", initial: [217, 246, 254], label: "Line color 1", type: "bincolor" },
        { prop: "title", initial: "Maximum Lag Dependency", label: "Title", type: "string" },
        { prop: "title_font_size", initial: 12, min: 2, max: 30, label: "Title font size" }
      ]
    },
    {
      category: "connectivity_mini_headmap",
      label: "Small headmap properties",
      nodes: [
        { prop: "magnitude_transform", initial: "x => 10 * x", label: "Magnitude transform", type: "eval" },
        { prop: "x0", initial: 50, min: 0, max: 1000, label: "Headmap initial position left" },
        { prop: "y0", initial: 450, min: 0, max: 2000, label: "Headmap initial position top" },
        { prop: "width", initial: 100, min: 50, max: 600, label: "Headmap width" },
        { prop: "height", initial: 100, min: 50, max: 600, label: "Headmap height" },
        { prop: "font_size", initial: 5, min: 2, max: 30, label: "Font size" },
        { prop: "color_0", initial: [217, 246, 254], label: "Line color 0", type: "veccolor" },
        { prop: "color_1", initial: [252, 254, 217], label: "Line color 1", type: "veccolor" },
        { prop: "line_color", initial: [217, 246, 254], label: "Line color 1", type: "bincolor" },
        { prop: "label_color", initial: [217, 246, 254], label: "Line color 1", type: "bincolor" },
        { prop: "title", initial: "[Miniheadmap]", label: "Title", type: "string" },
        { prop: "title_font_size", initial: 10, min: 2, max: 30, label: "Title font size" }
      ]
    }
  ];

  for (let k = 0; k < settings_detail.length; k++) {
    const { category, label, nodes } = settings_detail[k];
    const section_element = html`
      <tr>
        <th colspan="2">${label}</th>
      </tr>
    `;
    mount(form_container, section_element);
    for (let i = 0; i < nodes.length; i++) {
      const { prop, initial, min = 0, max = 0, label, type = "integer" } = nodes[i];
      const property = parsePropertyToElement({ category, prop, initial, min, max, label, type });
      nodes[i]._domnode = property;
      mount(form_container, property);
    }
  }

  form.settings = () => {
    const settings = {};
    for (let k = 0; k < settings_detail.length; k++) {
      const { category, nodes } = settings_detail[k];
      settings[category] = {};
      for (let i = 0; i < nodes.length; i++) {
        const { prop, _domnode } = nodes[i];
        settings[category][prop] = _domnode.inputValue();
      }
    }
    return settings;
  };

  mount(
    form_container,
    html`<tr><td colspan="2">
      <button class="button small dark start-simulation">Start</button>
      </td></tr>
    `
  );
  return form;
};

const createScreen = (settings, testMode) => {
  //const screen_animation = createDefaultScreen({ animation, timeseries, connectivity_headmap, lag_headmap, requested_connectivities, connectivity_mini_headmap }, testMode);
  //const screen_animation = createDefaultScreen(settings, testMode);
  const splitter_container = html`
    <div data-role="splitter" class="sequential-eeg-connectivity h-100" data-split-sizes="20, 80">
      <div class="d-flex flex-justify-center flex-align-center module-settings"><div class="actual-container"></div></div>
      <div class="d-flex flex-justify-center flex-align-center module-content"><div class="actual-container"></div></div>
    </div>
  `;
  const settings_form = createSettingsForm(settings);
  //mount(splitter_container.querySelector(":scope > .module-content > .actual-container"), screen_animation);
  mount(splitter_container.querySelector(":scope > .module-settings > .actual-container"), settings_form);
  settings_form.querySelector(".start-simulation").addEventListener("click", () => {
    if (settings_form.querySelectorAll("input[data-validate].invalid").length > 0) {
      console.error("CANNOT PROCESS");
      return;
    }
    settings = settings_form.settings();
    const screen_animation = createDefaultScreen(settings, testMode);
    mount(splitter_container.querySelector(":scope > .module-content > .actual-container"), screen_animation);
    settings_form.querySelector(".start-simulation").setAttribute("disabled", "disabled");
  });
  return splitter_container;
};

export const SequentialEEGConnectivityScreen = (
  { animation = {}, timeseries = {}, connectivity_headmap = {}, lag_headmap = {}, requested_connectivities = {}, connectivity_mini_headmap = {} } = {},
  testMode = true
) => createScreen({ animation, timeseries, connectivity_headmap, lag_headmap, requested_connectivities, connectivity_mini_headmap }, testMode);
