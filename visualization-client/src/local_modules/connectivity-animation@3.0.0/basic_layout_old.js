//const PIXI = require("pixi.js");
import Konva from "konva";
import { color_scale, to_bin_hex } from "./color_utils";


export const drawPointsEEG = (locations,
  app, {
    border_color = "gray",
    fill_color = "orange",
    radius = 2
  } = {}) => {
  let layer = new Konva.Layer();
  Object.keys(locations).forEach(m => {
    const v = locations[m];
    let circle = new Konva.Circle({
      x: v[0],
      y: v[1],
      radius: radius,
      perfectDrawEnabled: false,
    });
    circle.fill(fill_color);
    circle.stroke(border_color);
    circle.strokeWidth(1);
    layer.add(circle);
  });
  app.add(layer);
};


export const drawMatrix = (matrix,
  app,
  layout = null, 
  data_positions = [], 
  title = "", {
    cmap = "viridis",
    cmap_levels = 20,
    cmap_max = 10,
    cmap_min = 0,
    size = 120,
    pos_x = 20,
    pos_y = 450,
    border_color = "black",
    border_width = 0.1,
    label_color = "black",
  } = {}) => {
  let is_new_layout = false;
  let layer = null;
  if (!layout) {
    //console.log("NO")
    layout = [...Array(matrix.length)].map(() => null);
    /////layout.
    layer = new Konva.Layer();
    is_new_layout = true;
  } else {
    //console.log("YES")
  }
  let p = Math.round(Math.sqrt(matrix.length));
  const colscale = color_scale(cmap, {
    levels: cmap_levels,
    max: cmap_max,
    min: cmap_min
  });
  //let total_width = Math.ceil(size / p);
  let total_width = Math.floor(size / p);
  let cell_width = total_width > 1 ? total_width - border_width : total_width;
  let cell_border_width = total_width > 1 ? border_width : 0;
  for (let k = 0; k < matrix.length; k++) {
    let i = matrix[k][0];
    let j = matrix[k][1];
    let val = matrix[k][3];
    let x0 = pos_x + total_width * i;
    let y0 = pos_y + total_width * j;
    let rect;
    if (is_new_layout) {
      //rect = app.makeRectangle(x0, y0, cell_width, cell_width);
      rect = new Konva.Rect({
        x: x0,
        y: y0,
        width: cell_width,
        height: cell_width,
        perfectDrawEnabled: false,
      });
      layout[k] = rect;
      //////layout.
      layer.add(layout[k]);
    } else {
      rect = layout[k];
      rect.draw();
    }
    ///console.log(val, colscale.getHex(val))
    rect.fill(colscale.getHex(val));
    if (border_width > 0) {
      rect.stroke(border_color);
      rect.strokeWidth(border_width);
    } else {
      rect.strokeWidth(0);
    }
  }
  if (is_new_layout) {
    let text_height = Math.min(14, cell_width);
    for(let i = 0; i < p; i++){
      let x = pos_x + total_width * p + 2;
      let y = pos_y + total_width * i + (total_width - text_height)/2;
      let text = new Konva.Text({
        x: x,
        y: y,
        text: data_positions[i][2],
        fontSize: text_height,
        fontFamily: 'Calibri',
        fill: label_color,
        perfectDrawEnabled: false,
      });
      layer.add(text);
    }
    for(let j = 0; j < p; j++){
      let x = pos_x + total_width * (j) + text_height + (total_width - text_height)/2;
      let y = pos_y + total_width * (p) + 2;
      let text = new Konva.Text({
        x: x,
        y: y,
        text: data_positions[j][2],
        fontSize: text_height,
        fontFamily: 'Calibri',
        rotation: 90,
        fill: label_color,
        perfectDrawEnabled: false,
      });
      layer.add(text);
    }
    {
      let x = pos_x + 1;
      let y = pos_y - Math.max(14, text_height + 2) - 1;
      let title_text = new Konva.Text({
        x: x,
        y: y,
        text: title,
        fontSize: Math.max(14, text_height + 2),
        fontFamily: 'Calibri',
        fill: label_color,
        fontStyle: "bold",
        fontVariant: "small-caps",
        perfectDrawEnabled: false,
      });
      layer.add(title_text);
    }
    ///
    app.add(layer);
  }
  return layout;
}

export const drawMatrices = (matrices, app,
  layouts = null,
  data_positions = [], titles = [], {
    cmap = "viridis",
    cmap_levels = 20,
    cmap_max = 10,
    cmap_min = 0,
    size = 120,
    pos_x = 20,
    pos_y = 450,
    shift_x = 20,
    border_color = "#000000",
    border_width = 0.1,
    label_color = "black",
  } = {}) => {
  if (!layouts) {
    layouts = [...Array(matrices.length)].map(() => null);
  }
  const update = (k, new_matrix) => {
    let x0 = pos_x + (size + shift_x) * k;
    layouts[k] = drawMatrix(new_matrix, app, layouts[k], data_positions, titles[k], {
      cmap: cmap,
      cmap_levels: cmap_levels,
      cmap_max: cmap_max,
      cmap_min: cmap_min,
      size: size,
      pos_x: x0,
      pos_y: pos_y,
      border_color: border_color,
      border_width: border_width,
    })
  };
  for (let k = 0; k < matrices.length; k++) {
    update(k, matrices[k]);
  }
  return { update, layouts }
}

//
export const drawLine = (y,
  layout = null, {
    line_color = "black",
    max_points = 100,
    scale_x = 5,
    scale_y = 1,
    pos_x = 300,
    pos_y = 10,
    line_width = 1,
    alpha = 1,
    spline_tension = 0.5,
  } = {}) => {
  if (!layout) {
    let points = [...Array(2 * max_points)].map((m, i) => i % 2 == 0? Math.floor(i/2) * scale_x: NaN);
    layout = new Konva.Line({points, perfectDrawEnabled: false,});
    layout._true_points = points.map((m) => NaN);
    layout.move({x: pos_x, y: pos_y});
    layout.stroke(line_color);
    layout.strokeWidth(line_width);
    layout.opacity(alpha);
    layout.tension(spline_tension);
  }

  let true_points = layout._true_points;
  let points = layout.points();
  
  let mean_y = 0;
  let mean2_y = 0;
  for(let t = 0; t < max_points; t++){
    mean_y += true_points[2 * t + 1] || 0;
    mean2_y += (true_points[2 * t + 1] * true_points[2 * t + 1]) || 0;
  }
  mean_y = mean_y / (max_points);
  mean2_y = mean2_y / (max_points);
  //
  let std_y = ((mean2_y - mean_y * mean_y)  * max_points / (max_points - 1)) || 1e-4;
  for(let t = 0; t < max_points - 1; t++){
    layout._true_points[2 * t + 1] = layout._true_points[2 * (t + 1) + 1];
  }
  layout._true_points[2 * max_points - 1] = y * scale_y;
  //
  for(let t = 0; t < max_points; t++){
    //points[2 * t + 1] = (layout._true_points[2 * t + 1] - mean_y) / std_y;
    points[2 * t + 1] = (layout._true_points[2 * t + 1] - mean_y);
  }
  //
  /*
  //let ref_val = points[1] || points[2 * max_points - 1] || 0;
  for(let t = 0; t < max_points - 1; t++){
    points[2 * t + 1] = points[2 * (t + 1) + 1];
  }
  points[2 * max_points - 1] = y * scale_y;*/
  layout.points(points);
  return layout;
}


export const drawLines = (signal_timepoint, app,
  layouts = null, 
  labels = [], {
    cmap = "viridis",
    max_points = 100,
    scale_y = 1,
    pos_x = 300,
    pos_y = 10,
    width = 100,
    height = 400,
    line_width = 1,
    alpha = 1,
    spline_tension = 0.5,
  } = {}) => {
  let is_new_layout = false;
  let layer = null;
  if (!layouts) {
    layouts = [...Array(signal_timepoint.length)].map(() => null);
    layer = new Konva.Layer();
    is_new_layout = true;
  }
  const colscale = color_scale(cmap, {
    levels: Math.max(10, signal_timepoint.length),
    max: signal_timepoint.length + 1,
    min: 0
  });
  const shift_y = height / signal_timepoint.length;
  const scale_x = width / max_points;
  const update = (k, timepoint) => {
    let is_new = layouts[k] == null;
    layouts[k] = drawLine(timepoint,
      layouts[k],{
        line_color: colscale.getHex(k),
        max_points,
        scale_x,
        scale_y,
        pos_x,
        pos_y: pos_y + k * shift_y,
        line_width,
        alpha,
        spline_tension,
    })
    if (is_new) {
      ////console.log(pos_x + width + 3, pos_y, labels[k])
      let title_text = new Konva.Text({
        x: pos_x + width + 3,
        y: pos_y + k * shift_y,
        text: labels[k],
        fontSize: 12,
        fontFamily: 'Calibri',
        fill: colscale.getHex(k),
        fontStyle: "bold",
        //fontVariant: "small-caps",
        perfectDrawEnabled: false,
      });
      layer.add(title_text);
      layer.add(layouts[k]);
    }
  };
  const update_all = (multitimepoint) => {
    for (let k = 0; k < multitimepoint.length; k++) {
      update(k, multitimepoint[k]);
    }
    if (is_new_layout) {
      app.add(layer);
    } else {
      layer.batchDraw();
    }
    is_new_layout = false;
  };
  update_all(signal_timepoint);
  return { update, update_all, layouts };
}

export const drawArrow = (link, positions, app,
  layout = null, {
    cmap = "viridis",
    value_levels = 20,
    value_max = 10,
    value_min = 0,
    line_width_max = 1,
    line_width_min = 0.1,
    alpha = 1,
  } = {}) => {
  if (!layout) {
    /////console.log("new!")
    layout = new Konva.Arrow({
      perfectDrawEnabled: false,
    });
  }
  const colscale = color_scale(cmap, {
    levels: value_levels,
    max: value_max,
    min: value_min
  });

  let [src, dst, lag, val] = link;
  let [x0, y0, n0] = positions[src];
  let [x1, y1, n1] = positions[dst];
  let line_color = colscale.getHex(val);
  let line_width = (colscale.getScale(val) / value_levels) * (line_width_max - line_width_min) + line_width_min;

  layout.opacity(alpha);
  layout.x(x0);
  layout.y(y0);
  layout.points([0, 0, x1 - x0, y1 - y0]);
  layout.pointerLength(10);
  layout.pointerWidth(10);
  layout.fill(line_color);
  layout.stroke(line_color);
  layout.strokeWidth(line_width);

  return layout;
}

export const drawArrows = (links, positions, app,
  layouts = null, {
    cmap = "viridis",
    value_levels = 20,
    value_max = 10,
    value_min = 0,
    line_width_max = 1,
    line_width_min = 0.1,
  } = {}) => {
  let is_new_layout = false;
  let layer = null;
  if (!layouts) {
    layouts = [...Array(links.length * 2)].map(() => null);
    layer = new Konva.Layer();
    is_new_layout = true;
  }
  const animate = (link) => {
    //const points = link.points();
    let anim = new Konva.Animation(function(frame) {
      const points = link._base_points;
      let period = 1000;
      let w = Math.cos((frame.time * 2 * Math.PI) / period);
      let k = (-0.5 * w + 0.5);
      //let k = Math.max(frame.time, period) / period;
      link.points([
        0, 0,
        k * points[2],
        k * points[3],
      ]);
      //if(k >= 1) anim.stop();
    }, layer);
    anim.start();
  }
  const update = (k, new_link) => {
    let is_new = layouts[k] == null;
    layouts[k] = drawArrow(new_link, positions, app, layouts[k], {
      cmap,
      value_levels,
      value_max,
      value_min,
      line_width_max,
      line_width_min,
      alpha: 0.3,
    })
    layouts[k]._base_points = layouts[k].points();
    // fixed
    layouts[k + links.length] = drawArrow(new_link, positions, app, layouts[k + links.length], {
      cmap,
      value_levels,
      value_max,
      value_min,
      line_width_max,
      line_width_min,
      alpha: 1,
    })
    if (is_new) {
      //layer.add(layouts[k]);
      layer.add(layouts[k + links.length]);
      //animate(layouts[k]);
    } else {
      //layouts[k].draw();
    }
  };
  const update_all = (new_links) => {
    for (let k = 0; k < new_links.length; k++) {
      update(k, new_links[k]);
    }
    if (is_new_layout) {
      app.add(layer);
    } else {
      layer.batchDraw();
    }
    is_new_layout = false;
  };
  update_all(links);
  return { update, update_all, layouts };
}


