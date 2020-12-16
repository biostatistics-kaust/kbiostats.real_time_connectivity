import jStat from "jstat";
import Konva from "konva";
import { rescaledEEGLocations2D } from "../opc-eeg-positions@1.0.0/eeg2D.js";
import { drawLabelsEEG, drawPointsEEG, drawMatrices, drawArrows, drawLines, drawScale } from "./basic_layout";

export const zero_matrix = (M) => {
  let matrix2 = [];
  for(let i = 0; i < M; i++){
    for(let j = 0; j < M; j++){
      matrix2.push([i, j, 0, 0]);
    }
  }
  return matrix2;
}

export const random_matrix = (M) => {
  let matrix2 = [];
  for(let i = 0; i < M; i++){
    for(let j = 0; j < M; j++){
      matrix2.push([i, j, 0, jStat.normal.sample(0, 50)]);
      //matrix2.push([i, j, 0, i*j]);
      if(i == j && i == 0){
        matrix2[matrix2.length - 1][3] = 0;
      }
    }
  }
  return matrix2;
}

export const random_point = (M) => {
  let matrix2 = [];
  for(let i = 0; i < M; i++){
    matrix2.push(jStat.normal.sample(0, 2));
  }
  return matrix2;
}

export const random_links = (M, number_links) => {
  const links = [...Array(number_links)].map((v) => [
    Math.floor(jStat.uniform.sample(0, M)),
    Math.floor(jStat.uniform.sample(0, M)),
    -1,
    jStat.normal.sample(0, 2),
  ])
  return links;
}

///////////////////////////////////////////////////////////////////////////////
/**
 * From https://stackoverflow.com/a/44779316
 *
 * @param {Function} fn Callback function
 * @param {Boolean|undefined} [throttle] Optionally throttle callback
 * @return {Function} Bound function
 *
 * @example
 * //generate rAFed function
 * jQuery.fn.addClassRaf = bindRaf(jQuery.fn.addClass);
 *
 * //use rAFed function
 * $('div').addClassRaf('is-stuck');
 */
const bindRaf = (fn, throttle=true) => {
  let isRunning = false, that, args;
  const run = () => {
    //isRunning = false;
    fn.apply(that, args);
  };
  return function() {
    that = this;
    args = arguments;
    if (isRunning && throttle) {
      return;
    }
    isRunning = true;
    requestAnimationFrame(run);
  };
}

const create_links = (links, link_arrows, app, data_positions, settings) => {
  const number_links = settings.animation.mainmap_number_links;
  const update = (new_links) => {
    if(!link_arrows){
      link_arrows = drawArrows(new_links, data_positions, app, null, {
        cmap: settings.animation.arrow_cmap,
        value_levels: settings.animation.arrow_value_levels,
        value_max: settings.animation.arrow_value_max,
        value_min: settings.animation.arrow_value_min,
        value_autolevel: true,
        line_width_max: settings.animation.arrow_line_width_max,
        line_width_min: settings.animation.arrow_line_width_min,
        alpha_max: settings.animation.arrow_line_alpha_max,
        alpha_min: settings.animation.arrow_line_alpha_min,
      });
    }else{
      link_arrows.update_all(new_links)
    }
  }
  update(links);
  return {update};
}

const create_lines = (new_timepoint, app, settings, channels) => {
  let lines = drawLines(new_timepoint, app, null, channels, {
      cmap: settings.animation.timeseries_cmap,
      max_points: settings.animation.timeseries_max_points,
      scale_y: settings.animation.timeseries_scale_y,
      pos_x: settings.animation.timeseries_pos_x,
      pos_y: settings.animation.timeseries_pos_y,
      width: settings.animation.timeseries_width,
      height: settings.animation.timeseries_height,
      line_width: settings.animation.timeseries_line_width,
      alpha: settings.animation.timeseries_alpha,
      spline_tension: settings.animation.timeseries_spline_tension,
    });
   return lines;
}

// https://stackoverflow.com/questions/12539574/whats-the-best-way-most-efficient-to-turn-all-the-keys-of-an-object-to-lower
const objectKeysToLowerCase = (obj) => {
  let key, keys = Object.keys(obj);
  let n = keys.length;
  const newobj = {};
  while (n--) {
    key = keys[n];
    newobj[key.toLowerCase()] = obj[key];
  }
  return newobj;
}

const getMinMaxInMatrix = (link_matrix) => {
  return {
    //max: Math.max(...link_matrix.flat(2).filter((v, i) => i % 4 == 3)),
    //min: Math.min(...link_matrix.flat(2).filter((v, i) => i % 4 == 3)),
    max: Math.max(...link_matrix.filter(v => v[0] != v[1]).map(m => m[3])),
    min: Math.min(...link_matrix.filter(v => v[0] != v[1]).map(m => m[3])),
  };
}

///////////////////////////////////////////////////////////////////////////////

export const draw_animation = (canvas_element, canvas_params, settings, channels) => {
  const M = channels.length;
  ///////////////////////////////////////////////////////////////////////////////

  const app = new Konva.Stage({
    container: canvas_element,
    width: canvas_params.width,
    height: canvas_params.height,
    //pixelRatio: 2,
  });
  window._app = app

  //
  let image_background = window.getComputedStyle(app.container().querySelector('[role="presentation"]')).backgroundImage.replace(/(^\s*url\s*\(\s*|\s*\)\s*|"|')/g, "")
  console.log("image_background:", image_background)

  //
  //Konva.Image.fromURL(image_background, function(imgNode)
  {
  //  window._imgNode = imgNode;
    const has_layers = (app) => app.getLayers().length > 0
    let had_layer = has_layers(app);
    let layer = had_layer? app.getLayers()[0]: new Konva.Layer();
    let shape = new Konva.Rect({
      x: 0,
      y: 0,
      width: app.width(),
      height: app.height(),
      //fill: 'rgba(255, 255, 255, 0.2)',
      //stroke: 'black',
      strokeWidth: 0,
      //shadowBlur : 40,
      //fillPatternImage: _imgNode.image(),
      //zIndex: -1000,
      //opacity : 0.5,
    });
    window._shape = shape;
    console.log(shape)
    layer.add(shape);
    if(!had_layer) app.add(layer);
    Konva.Image.fromURL(image_background, (imgNode) => {
      shape.fillPatternImage(imgNode.image());
    });
  }
  /*Konva.Image.fromURL(image_background, function(imgNode) {
    const has_layers = (app) => app.getLayers().length > 0
    window._imgNode = imgNode;
    let layer = has_layers(app)? app.getLayers()[0]: new Konva.Layer();
    imgNode.setAttrs({
      x: 0,
      y: 0,
      scaleX: app.width() / imgNode.width(),
      scaleY: app.width() / imgNode.width(),
    });
    layer.add(imgNode);
    //layer.batchDraw();
    app.add(layer);
  });
  */

  //
  /*
  {
    const has_layers = (app) => app.getLayers().length > 0
    let layer = has_layers(app)? app.getLayers()[0]: new Konva.Layer();
    let shape = new Konva.Rect({
      x: 20,
      y: 20,
      width: app.width(),
      height: app.height(),
      fill: 'red',
      stroke: 'black',
      strokeWidth: 4,
      shadowBlur : 40,
      //opacity : 0.5,
    });
    window._shape = shape;
    console.log(shape)
    layer.add(shape);
    app.add(layer);
  }
  */

  const eeg_locations = objectKeysToLowerCase(rescaledEEGLocations2D({
      width: settings.animation.brain_width,
      height: settings.animation.brain_height,
      top: settings.animation.brain_top,
      left: settings.animation.brain_left
    }, true));

  const timeseries = create_lines(random_point(M), app, settings, channels);

  const data_positions = channels.map((k) => [...eeg_locations[k.toLowerCase()], k])
  window._data_positions = data_positions

  drawPointsEEG(eeg_locations, app, {
    border_color: settings.animation.brain_nodes_border_color,
    fill_color: settings.animation.brain_nodes_fill_color,
    radius: settings.animation.brain_nodes_radius,
    alpha: 0.2,
  });
  
  drawLabelsEEG(data_positions, app, {
    border_color: settings.animation.brain_nodes_border_color,
    fill_color: settings.animation.brain_nodes_fill_color,
    radius: settings.animation.brain_nodes_radius
  });

  ///////////////////////////////////////////////////////////////////////////////
  const connectivity_matrix = drawMatrices([random_matrix(M)], app, null, data_positions, ["Maximum cross-lag connectivity (PDC)"], {
    cmap: settings.animation.mainmap_cmap,
    cmap_levels: settings.animation.mainmap_cmap_levels,
    cmap_max: settings.animation.mainmap_cmap_max,
    cmap_min: settings.animation.mainmap_cmap_min,
    cmap_autolevel: true,
    size: settings.animation.mainmap_size,
    pos_x: settings.animation.mainmap_left,
    pos_y: settings.animation.mainmap_top,
    shift_x: 0,
    border_color: settings.animation.mainmap_border_color,
    border_width: settings.animation.mainmap_border_width,
    label_color: settings.animation.mainmap_label_color,
  });

  const connectivity_matrix_scale = drawScale(app, null, {
    cmap: settings.animation.mainmap_cmap,
    cmap_levels: settings.animation.mainmap_cmap_levels,
    cmap_max: settings.animation.mainmap_cmap_max,
    cmap_min: settings.animation.mainmap_cmap_min,
    height: settings.animation.mainmap_size,
    width: 10,
    pos_x: settings.animation.mainmap_left + settings.animation.mainmap_size * 1.1,
    pos_y: settings.animation.mainmap_top,
    border_color: settings.animation.mainmap_border_color,
    border_width: settings.animation.mainmap_border_width,
    label_color: settings.animation.mainmap_label_color,
  });

  const lag_dependency_matrix = drawMatrices([random_matrix(M)], app, null, data_positions, ["Maximum lag"], {
    cmap: settings.animation.lagmap_cmap,
    cmap_levels: settings.animation.lagmap_cmap_levels,
    cmap_max: settings.animation.lagmap_cmap_max,
    cmap_min: settings.animation.lagmap_cmap_min,
    cmap_autolevel: false,
    size: settings.animation.lagmap_size,
    pos_x: settings.animation.lagmap_left,
    pos_y: settings.animation.lagmap_top,
    shift_x: 0,
    border_color: settings.animation.lagmap_border_color,
    border_width: settings.animation.lagmap_border_width,
    label_color: settings.animation.lagmap_label_color,
  });

  const lag_dependency_matrix_scale = drawScale(app, null, {
    cmap: settings.animation.lagmap_cmap,
    cmap_levels: settings.animation.lagmap_cmap_levels,
    cmap_max: settings.animation.lagmap_cmap_max,
    cmap_min: settings.animation.lagmap_cmap_min,
    height: settings.animation.lagmap_size,
    width: 10,
    pos_x: settings.animation.lagmap_left + settings.animation.lagmap_size * 1.1,
    pos_y: settings.animation.lagmap_top,
    border_color: settings.animation.lagmap_border_color,
    border_width: settings.animation.lagmap_border_width,
    label_color: settings.animation.lagmap_label_color,
  });
  lag_dependency_matrix_scale.update_range(settings.animation.lagmap_cmap_levels, 1, {to_scientific_notation: false, shift: 0});


  const spectral_connectivity_matrices = drawMatrices([
      random_matrix(M),
      random_matrix(M),
      random_matrix(M),
      random_matrix(M),
      random_matrix(M),
     ], app, null, data_positions, ["Delta [0-4Hz]", "Theta [4-8Hz]", "Alpha [8-12Hz]", "Beta [12-30Hz]", "Gamma [30-50Hz]"], {
    cmap: settings.animation.minimap_cmap,
    cmap_levels: settings.animation.minimap_cmap_levels,
    cmap_max: settings.animation.minimap_cmap_max,
    cmap_min: settings.animation.minimap_cmap_min,
    size: settings.animation.minimap_size,
    pos_x: settings.animation.minimap_left + 0,
    pos_y: settings.animation.minimap_top + 0,
    shift_x: settings.animation.minimap_separation_x,
    border_color: settings.animation.minimap_border_color,
    border_width: settings.animation.minimap_border_width,
    label_color: settings.animation.minimap_label_color,
  });

  //const connectivity_arrows = create_links(random_links(M, settings.animation.mainmap_number_links), null, app, data_positions, settings);
  const connectivity_arrows = drawArrows(
    random_links(M, settings.animation.mainmap_number_links), 
    data_positions, 
    app, 
    null, {
        cmap: settings.animation.arrow_cmap,
        value_levels: settings.animation.arrow_value_levels,
        value_max: settings.animation.arrow_value_max,
        value_min: settings.animation.arrow_value_min,
        value_autolevel: true,
        line_width_max: settings.animation.arrow_line_width_max,
        line_width_min: settings.animation.arrow_line_width_min,
      });
  
  const connectivity_arrows_scale = drawScale(app, null, {
    cmap: settings.animation.arrow_cmap,
    cmap_levels: settings.animation.arrow_value_levels,
    cmap_max: settings.animation.arrow_value_max,
    cmap_min: settings.animation.arrow_value_min,
    height: settings.animation.brain_height,
    width: 10,
    pos_x: settings.animation.brain_left - 15,
    pos_y: settings.animation.brain_top,
    border_color: "white",
    border_width: 0,
    label_color: settings.animation.mainmap_label_color, // NOTE: It derives the label color from mainmap
  });
  //return {app, connectivity_matrix, lag_dependency_matrix, spectral_connectivity_matrices, timeseries, connectivity_arrows};
  ///////////////////////////////////////////////////////////////////////////////
  const fill_matrix = (X) => {
    //console.log(X)
    let X1 = zero_matrix(M);
    for(let k = 0; k < X.length; k++){
      let i = X[k][0];
      let j = X[k][1];
      X1[i * M + j][2] = X[k][2];
      X1[i * M + j][3] = X[k][3];
    }
    return X1;
  }
  const update_connectivity = (X) => {
    connectivity_matrix.update(0, fill_matrix(X));
    const ranges = getMinMaxInMatrix(X);
    connectivity_matrix_scale.update_range(ranges.max, ranges.min, {to_scientific_notation: true, shift: 0});
  }
  const update_lag_dependency = (X) => {
    lag_dependency_matrix.update(0, fill_matrix(X));
    //const ranges = getMinMaxInMatrix(X);
    //lag_dependency_matrix_scale.update_range(ranges.max, ranges.min, {to_scientific_notation: false, shift: 1});
  }
  const update_connectivity_delta = (X) => spectral_connectivity_matrices.update(0, fill_matrix(X))
  const update_connectivity_theta = (X) => spectral_connectivity_matrices.update(1, fill_matrix(X))
  const update_connectivity_alpha = (X) => spectral_connectivity_matrices.update(2, fill_matrix(X))
  const update_connectivity_beta = (X) => spectral_connectivity_matrices.update(3, fill_matrix(X))
  const update_connectivity_gamma = (X) => spectral_connectivity_matrices.update(4, fill_matrix(X))
  const update_connectivity_arrows = (X) => {
    //connectivity_arrows.update(X)
    connectivity_arrows.update_all(X)
    const ranges = getMinMaxInMatrix(X);
    connectivity_arrows_scale.update_range(ranges.max, ranges.min, {to_scientific_notation: true, shift: 0});
  }
  const update_timeseries = (X) => timeseries.update_all(X)
  

  //
  
  //
  return {app,
    update_connectivity,
    update_lag_dependency,
    update_connectivity_delta,
    update_connectivity_theta, 
    update_connectivity_alpha,
    update_connectivity_beta,
    update_connectivity_gamma,
    update_connectivity_arrows,
    update_timeseries,
  };
}
