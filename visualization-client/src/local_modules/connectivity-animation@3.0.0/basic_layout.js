import Konva from "konva";
import { color_scale, to_bin_hex } from "./color_utils";

const has_layers = (app) => app.getLayers().length > 0
// Before: 283MB, CPU 0% GPU 23%
// After: 280-370MB, CPU 103% GPU 43%
export const drawPointsEEG = (locations,
  app, {
    border_color = "gray",
    fill_color = "orange",
    radius = 2,
    alpha = 1,
  } = {}) => {
  let layer = has_layers(app) ? app.getLayers()[0] : new Konva.Layer();
  Object.keys(locations).forEach(m => {
    const v = locations[m];
    let circle = new Konva.Circle({
      x: v[0],
      y: v[1],
      radius: radius,
      perfectDrawEnabled: false,
      opacity: alpha,
      //zIndex: 0,
    });
    circle.fill(fill_color);
    circle.stroke(border_color);
    circle.strokeWidth(1);
    layer.add(circle);
  });
  if (!has_layers(app)) app.add(layer);
};

export const drawLabelsEEG = (data_positions,
  app, {
    border_color = "gray",
    fill_color = "orange",
    radius = 2
  } = {}) => {
  let layer = has_layers(app) ? app.getLayers()[0] : new Konva.Layer();
  for (let i = 0; i < data_positions.length; i++) {
    const [x, y, m] = data_positions[i];
    let circle = new Konva.Circle({
      x,
      y,
      radius: radius,
      perfectDrawEnabled: false,
      //zIndex: 0,
    });
    circle.fill(fill_color);
    circle.stroke(border_color);
    circle.strokeWidth(1);
    layer.add(circle);
    let text = new Konva.Text({
      x: x + 3,
      y: y,
      text: m.toUpperCase(),
      //fontSize: 8,
      fontSize: 14,
      fontFamily: 'Calibri',
      fill: border_color,
      opacity: 0.5,
      perfectDrawEnabled: false,
      //zIndex: 0,
    });
    layer.add(text);
  }
  if (!has_layers(app)) app.add(layer);
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
    cmap_autolevel = true,
    size = 120,
    pos_x = 20,
    pos_y = 450,
    border_color = "black",
    border_width = 0.1,
    label_color = "black",
    replace_diagonals = true,
  } = {}) => {
  let is_new_layout = false;
  let layer = null;
  if (!layout) {
    //console.log("NO")
    layout = [...Array(matrix.length)].map(() => null);
    /////layout.
    layer = has_layers(app) ? app.getLayers()[0] : new Konva.Layer();
    is_new_layout = true;
  } else {
    //console.log("YES")
  }
  let p = Math.round(Math.sqrt(matrix.length));
  if(replace_diagonals && false){
    //let max_val = Math.max(...matrix.flat(2).filter((v, i) => i % 4 == 3));
    //let mean_val = matrix.filter((v, i) => v[0] != v[1]).map(v => v[3]).reduce((a,b) => a+b) / matrix.length;
    //let sd_val = Math.sqrt(matrix.filter((v, i) => v[0] != v[1]).map(v => v[3]*v[3]).reduce((a,b) => a+b) / matrix.length - mean_val * mean_val);
    //const restrict = (x) => Math.max(mean_val - 3 * sd_val, Math.min(mean_val + 3 * sd_val, x))
    //console.log(mean_val, sd_val)
    const ordered_matrix = matrix.copyWithin().sort((a, b) => a[3] - b[3])
    const percentile_95 = ordered_matrix[Math.ceil(ordered_matrix.length * 0.95)][3]
    const percentile_5 = ordered_matrix[Math.ceil(ordered_matrix.length * 0.05)][3]
    const restrict = (x) => Math.max(percentile_5, Math.min(percentile_95, x))
    matrix = matrix.map((v, i) => v[0] == v[1]? [v[0], v[1], v[2], NaN]: [v[0], v[1], v[2], restrict(v[3])]);
    window.__matrix = matrix
    cmap_max = percentile_95;
    cmap_min = percentile_5;
  }else{
    if(cmap_autolevel){
      //cmap_max = Math.max(...matrix.flat(2).filter((v, i) => i % 4 == 3).filter(isFinite))
      //cmap_min = Math.min(...matrix.flat(2).filter((v, i) => i % 4 == 3).filter(isFinite))
      cmap_max = Math.max(...matrix.filter(v => v[0] != v[1]).map(m => m[3]));
      cmap_min = Math.min(...matrix.filter(v => v[0] != v[1]).map(m => m[3]));
    }
  }
  const colscale = color_scale(cmap, {
    levels: cmap_levels,
    max: cmap_max,
    min: cmap_min
  });
  window.colscale_ = {cmap_levels, cmap_max, cmap_min}
  window.colscale_matrix = matrix.filter(v => v[3] >= (cmap_max - 0.1 * (cmap_max - cmap_min)))
  //let total_width = Math.ceil(size / p);
  let total_width = Math.floor(size / p);
  let cell_width = total_width > 1 ? total_width - border_width : total_width;
  let cell_border_width = total_width > 1 ? border_width : 0;
  for (let k = 0; k < matrix.length; k++) {
    let j = matrix[k][0];
    let i = matrix[k][1];
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
        //zIndex: 0,
      });
      layout[k] = rect;
      //////layout.
      layer.add(layout[k]);
    } else {
      rect = layout[k];
      //rect.draw();
    }
    ///console.log(val, colscale.getHex(val))
    if(i == j){
      rect.fill("#FF0000");
      rect.opacity(0);
    }else{
      rect.fill(colscale.getHex(val));
      rect.opacity(1);
    }
    if (border_width > 0) {
      rect.stroke(border_color);
      rect.strokeWidth(border_width);
    } else {
      rect.strokeWidth(0);
    }
  }
  if (is_new_layout) {
    let text_height = Math.min(14, cell_width);
    for (let i = 0; i < p; i++) {
      let x = pos_x + total_width * p + 2;
      let y = pos_y + total_width * i + (total_width - text_height) / 2;
      let text = new Konva.Text({
        x: x,
        y: y,
        text: data_positions[i][2],
        fontSize: text_height,
        fontFamily: 'Calibri',
        fill: label_color,
        perfectDrawEnabled: false,
        //zIndex: 0,
      });
      layer.add(text);
    }
    for (let j = 0; j < p; j++) {
      let x = pos_x + total_width * (j) + text_height + (total_width - text_height) / 2;
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
        //zIndex: 0,
      });
      layer.add(text);
    } {
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
        //zIndex: 0,
      });
      layer.add(title_text);
    }
    ///
    if (!has_layers(app)) app.add(layer);
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
    cmap_autolevel = true,
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
      cmap,
      cmap_levels,
      cmap_max,
      cmap_min,
      cmap_autolevel,
      size,
      pos_x: x0,
      pos_y: pos_y,
      border_color,
      border_width,
      label_color
    })
    let layer = has_layers(app) ? app.getLayers()[0] : new Konva.Layer();
    layer.batchDraw();
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
    let points = [...Array(2 * max_points)].map((m, i) => i % 2 == 0 ? Math.floor(i / 2) * scale_x : NaN);
    layout = new Konva.Line({
      points,
      perfectDrawEnabled: false,
      //zIndex: 0,
    });
    layout._true_points = points.map((m) => NaN);
    layout.move({ x: pos_x, y: pos_y });
    layout.stroke(line_color);
    layout.strokeWidth(line_width);
    layout.opacity(alpha);
    layout.tension(spline_tension);
  }

  let true_points = layout._true_points;
  let points = layout.points();

  let mean_y = 0;
  let mean2_y = 0;
  for (let t = 0; t < max_points; t++) {
    mean_y += true_points[2 * t + 1] || 0;
    mean2_y += (true_points[2 * t + 1] * true_points[2 * t + 1]) || 0;
  }
  mean_y = mean_y / (max_points);
  mean2_y = mean2_y / (max_points);
  //
  let std_y = ((mean2_y - mean_y * mean_y) * max_points / (max_points - 1)) || 1e-4;
  for (let t = 0; t < max_points - 1; t++) {
    layout._true_points[2 * t + 1] = layout._true_points[2 * (t + 1) + 1];
  }
  layout._true_points[2 * max_points - 1] = y * scale_y;
  //
  for (let t = 0; t < max_points; t++) {
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
    layer = has_layers(app) ? app.getLayers()[0] : new Konva.Layer();
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
      layouts[k], {
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
        //zIndex: 0,
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
      if (!has_layers(app)) app.add(layer);
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
    line_width_max = 5,
    line_width_min = 0.1,
    //alpha = 1,
    alpha_max = 1,
    alpha_min = 0.1,
  } = {}) => {
  if (!layout) {
    /////console.log("new!")
    layout = new Konva.Arrow({
      perfectDrawEnabled: false,
      tension: 0.5,
      //zIndex: 0,
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
  //let relative_val = (colscale.getScale(val) / value_levels);
  //let relative_val = (value_max - val) / (value_max - value_min);
  let relative_val = (val) / (value_max - value_min);
  ////relative_val = relative_val * relative_val;
  ///relative_val = 1 - relative_val;
  //let line_width = 1;
  //relative_val = 1 - relative_val;
  let line_width = relative_val * (line_width_max - line_width_min) + line_width_min;
  //relative_val = 1 - relative_val;
  let alpha = relative_val * (alpha_max - alpha_min) + alpha_min;
  /*
  line_width = 1
  alpha = 1
  line_color = "white"
  */
  
  layout.opacity(alpha);
  layout.x(x0);
  layout.y(y0);
  //layout.points([0, 0, x1 - x0, y1 - y0]);
  layout.points([0, 0, (x1 - x0)*0.4, (y1 - y0 )*0.7, x1 - x0, y1 - y0]);
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
    value_autolevel = false,
    line_width_max = 1,
    line_width_min = 0.1,
    alpha_max = 0.9,
    alpha_min = 0.1,
  } = {}) => {
  let is_new_layout = false;
  let layer = null;
  let link_number = links.length;
  if (!layouts) {
    layouts = [...Array(link_number * 2)].map(() => null);
    layer = has_layers(app) ? app.getLayers()[0] : new Konva.Layer();
    is_new_layout = true;
  }

  const animate = (link) => {
    link.opacity(0.2);
    link.strokeWidth(4);
    //const points = link.points();
    let anim = new Konva.Animation(function(frame) {
      link.opacity(0.2);
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
  const update = (k, new_link, total_links=null) => {
    total_links = total_links == null? links.length: total_links;
    let is_new = layouts[k] == null;
    layouts[k] = drawArrow(new_link, positions, app, layouts[k], {
      cmap,
      value_levels,
      value_max,
      value_min,
      value_autolevel,
      line_width_max,
      line_width_min,
      //alpha: 0.3,
      alpha_max,
      alpha_min,
    })
    layouts[k]._base_points = layouts[k].points();
    // fixed
    layouts[k + total_links] = drawArrow(new_link, positions, app, layouts[k + total_links], {
      cmap,
      value_levels,
      value_max,
      value_min,
      line_width_max,
      line_width_min,
      alpha_max: 0.9,
      alpha_min: 0.1,
    })
    if (is_new) {
      layer.add(layouts[k]);
      layer.add(layouts[k + total_links]);
      animate(layouts[k]);
    } else {
      //layouts[k].draw();
    }
  };
  const update_all = (new_links, filter_links=true) => {
    const L = (2 * new_links.length - layouts.length);
    console.log("###", 2 * new_links.length, layouts.length, "::", L)
    for (let k = 0; k < L; k++) {
      layouts.push(null);// = [...Array(link_number * 2)].map(() => null);
      layouts.push(null);// = [...Array(link_number * 2)].map(() => null);
    }
    //
    if(value_autolevel){
      //value_max = Math.max(...new_links.flat(2).filter((v, i) => i % 4 == 3))
      //value_min = Math.min(...new_links.flat(2).filter((v, i) => i % 4 == 3))
      value_max = Math.max(...new_links.filter(v => v[0] != v[1]).map((v, i) => v[3]))
      value_min = Math.min(...new_links.filter(v => v[0] != v[1]).map((v, i) => v[3]))
    }
    window._new_links = new_links;
    window._new_links_a = {new_links, value_max, value_min};
    if(filter_links){
      const ordered_matrix = new_links.copyWithin().sort((a, b) => a[3] - b[3])
      //const percentile_95 = ordered_matrix[Math.ceil(ordered_matrix.length * 0.95)][3]
      //const percentile_5 = ordered_matrix[Math.ceil(ordered_matrix.length * 0.05)][3]
      /////const percentile_80 = ordered_matrix[Math.ceil(ordered_matrix.length * 0.80)][3]
      const percentile_threshold = ordered_matrix[Math.ceil(ordered_matrix.length * 0.80)][3]
      new_links = new_links.filter(v => v[0] != v[1] && v[3] > percentile_threshold).map((v, i) => [v[0], v[1], v[2], v[3]]);
      value_max = Math.max(...new_links.filter(v => v[0] != v[1]).map((v, i) => v[3]))
      value_min = Math.min(...new_links.filter(v => v[0] != v[1]).map((v, i) => v[3]))
    }
    window._new_links_a = {new_links, value_max, value_min};
    //
    //
    //
    for (let k = 0; k < layouts.length; k++) {
      if(layouts[k] != null){
        layouts[k].opacity(0);
      }
    }
    for (let k = 0; k < new_links.length; k++) {
      update(k, new_links[k], new_links.length);
    }
    if (is_new_layout) {
      if (!has_layers(app)) app.add(layer);
    } else {
      layer.batchDraw();
    }
    is_new_layout = false;
  };

  update_all(links);
  return { update, update_all, layouts };
}

export const drawScale = (app,
  layout = null, {
    cmap = "viridis",
    cmap_levels = 20,
    cmap_max = 10,
    cmap_min = 0,
    height = 120,
    width = 10,
    pos_x = 20,
    pos_y = 450,
    border_color = "black",
    border_width = 0.1,
    label_color = "black",
  } = {}) => {
  let is_new_layout = false;
  let layer = null;
  if (!layout) {
    layout = [...Array(cmap_levels)].map(() => null);
    layer = has_layers(app) ? app.getLayers()[0] : new Konva.Layer();
    is_new_layout = true;
  }
  //let colscale_levels = Math.max(10, cmap_levels);
  let colscale_levels = 6 * cmap_levels;
  const colscale = color_scale(cmap, {
    levels: colscale_levels,
    max: cmap_levels,
    min: 0
  });
  let cell_height = height / cmap_levels;

  if (is_new_layout) {
    for (let val = 0; val < cmap_levels; val++) {
      let col = colscale.getHex(cmap_levels - 1 - val);
      let x0 = pos_x;
      let y0 = pos_y + cell_height * val;
      let rect;
      rect = new Konva.Rect({
        x: x0,
        y: y0,
        width: width,
        height: cell_height,
        perfectDrawEnabled: false,
        fill: col,
        //zIndex: 0,
      });
      layout[val] = rect;
      layer.add(layout[val]);
      if (border_width > 0) {
        rect.stroke(border_color);
        rect.strokeWidth(border_width);
      } else {
        rect.strokeWidth(0);
      }
    }
  }
  let text_height = Math.max(6, Math.min(14, cell_height));

  let min_label, max_label;
  {
    let x = pos_x + 2;
    let y = pos_y - text_height;// + (cell_height - text_height) / 2;
    max_label = new Konva.Text({
      x: x,
      y: y,
      text: `${cmap_max}`,
      fontSize: text_height,
      fontFamily: 'Calibri',
      fill: label_color,
      perfectDrawEnabled: false,
      //zIndex: 0,
    });
    layer.add(max_label);
  } {
    let x = pos_x + 2;
    let y = pos_y + cell_height * cmap_levels// - (cell_height - text_height) / 2;
    min_label = new Konva.Text({
      x: x,
      y: y,
      text: `${cmap_min}`,
      fontSize: text_height,
      fontFamily: 'Calibri',
      fill: label_color,
      perfectDrawEnabled: false,
      //zIndex: 0,
    });
    layer.add(min_label);
  }
  ///
  if (!has_layers(app)) app.add(layer);

  const update_range = (cmap_max, cmap_min, {to_scientific_notation=true, shift=0} = {}) => {
    if(to_scientific_notation){
      min_label.text(`${(cmap_min + shift).toExponential(2)}`);
      max_label.text(`${(cmap_max + shift).toExponential(2)}`);
    }else{
      min_label.text(`${(cmap_min + shift)}`);
      max_label.text(`${(cmap_max + shift)}`);
    }
    layer.batchDraw();
  }
  update_range(cmap_max, cmap_min);

  return { layout, update_range };
}