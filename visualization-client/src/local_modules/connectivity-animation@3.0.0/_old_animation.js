import Kefir from "kefir";
import jStat from "jstat";
import { dataprovider, random_connection, websocket_connection } from "./dataprovider";
import Konva from "konva";
import { rescaledEEGLocations2D } from "../opc-eeg-positions@1.0.0/eeg2D.js";

/*
const server_settings = {
	server: "localhost",
	port: 9120
};

const server_config = {
	"amplitude-factor": 1e-8,
	"lags": 4
};

const app_provider = dataprovider(websocket_connection(server_settings), server_config).subscribe(
	"channels", (v) => {
		console.log("ch:", v)
	}).subscribe(
	"timepoints", (v) => {
		console.log("t:", v)
	}).subscribe(
	"relevant-links", (v) => {
		console.log("c:", v)
	});

setTimeout(() => {
	app_provider.execute("stop");
}, 5000)
*/
///////////////////////////////////////////////////////////////////////////////
const settings = {
	animation: {
		brain_width: 300,
		brain_height: 400,
		brain_top: 10,
		brain_left: 10,
		brain_nodes_border_color: "#feeb77",
		brain_nodes_fill_color: "#650a5a",
		brain_nodes_radius: 2,
		//
		heatmap_size: 130,
		heatmap_top: 450,
		heatmap_left: 20,
		heatmap_separation_x: 20,
		heatmap_cmap: "viridis",
		//
		heatmap_cmap_levels: 20,
		heatmap_cmap_max: 10,
		heatmap_cmap_min: 0,
		heatmap_border_width: 0.1,
		heatmap_border_color: "#DDDDDD",
		//
		arrow_cmap: "RdBu",
		arrow_value_levels: 50,
		arrow_value_max: 5,
		arrow_value_min: -5,
		arrow_line_width_max: 10,
		arrow_line_width_min: 0.1,
	}
}

///////////////////////////////////////////////////////////////////////////////
const base_element = document.body;
//var params = { width: 1400, height: 1000, type: Two.Types.webgl};
//var params = { width: 1400, height: 1000, type: Two.Types.canvas};
var params = { width: 1400, height: 1000};
//window.Two = Two
//var app = new Two(params).appendTo(base_element);
window.Konva = Konva
var app = new Konva.Stage({
  container: 'app',
  width: params.width,
  height: params.height,
});

const locations = rescaledEEGLocations2D({
	width: settings.animation.brain_width,
	height: settings.animation.brain_height,
	top: settings.animation.brain_top,
	left: settings.animation.brain_left
}, true);

import { drawPointsEEG, drawMatrices, drawArrows } from "./basic_layout";

drawPointsEEG(locations, app, {
	border_color: settings.animation.brain_nodes_border_color,
	fill_color: settings.animation.brain_nodes_fill_color,
	radius: settings.animation.brain_nodes_radius
});

window.locations = locations

let M = 64;
//let matrix = [...Array(M)].map((v, i) => [...Array(M)].map((w, j) => i * j));
let matrix = [];
for(let i = 0; i < M; i++){
  for(let j = 0; j < M; j++){
    matrix.push([i, j, 0, i*j]);
  }
}
let matrix2 = [];
for(let i = 0; i < M; i++){
  for(let j = 0; j < M; j++){
    //matrix2.push([i, j, 0, 100-(i + j)]);
    matrix2.push([i, j, 0, 0]);
  }
}

const matrix_array = drawMatrices([matrix, matrix, matrix], app, null, {
	cmap: settings.animation.heatmap_cmap,
	cmap_levels: settings.animation.heatmap_cmap_levels,
	cmap_max: settings.animation.heatmap_cmap_max,
	cmap_min: settings.animation.heatmap_cmap_min,
	size: settings.animation.heatmap_size,
	pos_x: settings.animation.heatmap_left + 0,
	pos_y: settings.animation.heatmap_top + 0,
	shift_x: settings.animation.heatmap_separation_x,
	border_color: settings.animation.heatmap_border_color,
	border_width: settings.animation.heatmap_border_width,
});

//for (let i = 0; i < matrix_array.layouts.length; i++) {
//	app.add(matrix_array.layouts[i].layer);	
//}

window.jStat = jStat
const update_matrix = (matrix_array, app, M, k=1) => {
	let matrix2 = [];
	for(let i = 0; i < M; i++){
	  for(let j = 0; j < M; j++){
	    matrix2.push([i, j, 0, jStat.normal.sample(0, 50)]);
	  }
	}
  matrix_array.update(k, matrix2);
  matrix2 = null
  //app.update();
}

window.locations = locations

const create_links = (link_arrows, app,) => {
	const positions = Object.keys(locations).map((k, i) => [...locations[k], k])
	const number_links = 6;
	const links = [...Array(number_links)].map((v) => [
		Math.floor(jStat.uniform.sample(0, positions.length - 1)),
		Math.floor(jStat.uniform.sample(0, positions.length - 1)),
		-1,
		jStat.normal.sample(0, 2),
	])
	if(!link_arrows)
		link_arrows = drawArrows(links, positions, app, null, {
	    cmap: settings.animation.arrow_cmap,
	    value_levels: settings.animation.arrow_value_levels,
	    value_max: settings.animation.arrow_value_max,
	    value_min: settings.animation.arrow_value_min,
	    line_width_max: settings.animation.arrow_line_width_max,
	    line_width_min: settings.animation.arrow_line_width_min,
	  });
	else
		link_arrows.update_all(links)
return link_arrows;
}
let link_arrows = create_links(null, app);

setInterval(() => {
	update_matrix(matrix_array, app, M, 0);
	update_matrix(matrix_array, app, M, 1);
	update_matrix(matrix_array, app, M, 2);
	create_links(link_arrows, app)
}, 500)



