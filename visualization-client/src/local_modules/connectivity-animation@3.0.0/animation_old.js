import Kefir from "kefir";
import jStat from "jstat";
import { dataprovider, random_connection, websocket_connection } from "./dataprovider";
import Konva from "konva";
import { rescaledEEGLocations2D } from "../opc-eeg-positions@1.0.0/eeg2D.js";

Konva.showWarnings = false;

///////////////////////////////////////////////////////////////////////////////
const settings = {
  animation: {
    brain_width: 300,
    brain_height: 400,
    brain_top: 50,
    brain_left: 20,
    brain_nodes_border_color: "#feeb77",
    brain_nodes_fill_color: "#650a5a",
    brain_nodes_radius: 2,
    //
    mainmap_size: 350,
    mainmap_top: 50,
    mainmap_left: 850,
    mainmap_cmap: "viridis",
    mainmap_cmap_levels: 20,
    mainmap_cmap_max: 1,
    mainmap_cmap_min: -1,
    mainmap_border_width: 0.1,
    mainmap_border_color: "#DDDDDD",
    mainmap_label_color: "#000000",
    mainmap_number_links: 6,
    //
    lagmap_size: 200,
    lagmap_top: 440,
    lagmap_left: 910,
    lagmap_cmap: "RdBu",
    lagmap_cmap_levels: 20,
    lagmap_cmap_max: 10,
    lagmap_cmap_min: 0,
    lagmap_border_width: 0.1,
    lagmap_border_color: "#DDDDDD",
    lagmap_label_color: "#000000",
    //
    minimap_size: 130,
    minimap_top: 550,
    minimap_left: 20,
    minimap_separation_x: 30,
    minimap_cmap: "viridis",
    minimap_cmap_levels: 20,
    minimap_cmap_max: 1,
    minimap_cmap_min: -1,
    minimap_border_width: 0.1,
    minimap_border_color: "#DDDDDD",
    minimap_label_color: "#000000",
    //
    arrow_cmap: "RdBu",
    arrow_value_levels: 20,
    arrow_value_max: 0.01,
    arrow_value_min: -0.01,
    arrow_line_width_max: 2,
    arrow_line_width_min: 0.1,
    //
    timeseries_cmap: "phase",
    timeseries_max_points: 100,
    timeseries_scale_y: 1e8,
    timeseries_pos_x: 300,
    timeseries_pos_y: 50,
    timeseries_width: 500,
    timeseries_height: 450,
    timeseries_line_width: 1,
    timeseries_alpha: 1,
    timeseries_spline_tension: 0, // reduce memory load from ~150MB/110%CPU to 85MB/90%CPU
    //
  }
}

///////////////////////////////////////////////////////////////////////////////
import {draw_animation, random_point, random_matrix, random_links} from "./eeg_layout";


///////////////////////////////////////////////////////////////////////////////

const server_settings = {
  server: "localhost",
  port: 9120
};

const server_config = {
  "amplitude-factor": 1e-8,
  "lags": 5,
  //"batch": 2,
  "batch-general-pdc": 5,
  "batch-region-pdc": 10,
  "batch-connectivity": 5,
  "batch-link-arrows": 10,
  "batch-timeseries": 1,
  "sampling-frequency": 200,
  "pdc-number-evaluation-points": 20,
  "max-representative-values": 100,
};

settings.animation.mainmap_number_links = server_config["max-representative-values"];

let channels = null;
let animation = null;
/*
let counters = {
  arrows: 0,
  connectivity: 5,
  connectivity_lags: 8,
  connectivity_delta: 2,
  connectivity_theta: 4,
  connectivity_alpha: 5,
  connectivity_beta: 6,
  connectivity_gamma: 8,
}
let period = {
  arrows: 20,
  connectivity: 20,
  connectivity_lags: 20,
  connectivity_delta: 31,
  connectivity_theta: 31,
  connectivity_alpha: 31,
  connectivity_beta: 31,
  connectivity_gamma: 31,
}*/

let counters = {
  arrows: 0,
  connectivity: 0,
  connectivity_lags: 0,
  connectivity_delta: 0,
  connectivity_theta: 0,
  connectivity_alpha: 0,
  connectivity_beta: 0,
  connectivity_gamma: 0,
}
let period = {
  arrows: 1,
  connectivity: 1,
  connectivity_lags: 1,
  connectivity_delta: 1,
  connectivity_theta: 1,
  connectivity_alpha: 1,
  connectivity_beta: 1,
  connectivity_gamma: 1,
}

const app_provider = dataprovider(websocket_connection(server_settings), server_config).subscribe(
  "channels", (v) => {
    channels = v;
    console.log(channels)
    animation = draw_animation(document.getElementById("app"), {width: 1300, height: 700}, settings, channels);
  }).subscribe(
  "timepoints", (v) => {
    document.title = `<<T>> ${Math.min(...v)} ${Math.max(...v)}`
    if(animation) animation.update_timeseries(v)
  }).subscribe(
  "maximum-values", (v) => {
    document.title = "<<MV>>" + v.length.toString() + "," + v[0].length.toString()
    //console.log("MM", v.length.toString() + "," + v[0].length.toString())
    if(animation){
      if(counters.connectivity % period.connectivity == 0 || counters.connectivity < 10){
        animation.update_connectivity(v)
      }
      counters.connectivity = (counters.connectivity + 1) % period.connectivity

      if(counters.connectivity_delta % period.connectivity_delta == 0 || counters.connectivity_delta < 10){
        animation.update_connectivity_delta(v)
      }
      counters.connectivity_delta = (counters.connectivity_delta + 1) % period.connectivity_delta

      if(counters.connectivity_theta % period.connectivity_theta == 0 || counters.connectivity_theta < 10){
        animation.update_connectivity_theta(v)
      }
      counters.connectivity_theta = (counters.connectivity_theta + 1) % period.connectivity_theta

      if(counters.connectivity_alpha % period.connectivity_alpha == 0 || counters.connectivity_alpha < 10){
        animation.update_connectivity_alpha(v)
      }
      counters.connectivity_alpha = (counters.connectivity_alpha + 1) % period.connectivity_alpha
      
      if(counters.connectivity_beta % period.connectivity_beta == 0 || counters.connectivity_beta < 10){
        animation.update_connectivity_beta(v)
      }
      counters.connectivity_beta = (counters.connectivity_beta + 1) % period.connectivity_beta
      
      if(counters.connectivity_gamma % period.connectivity_gamma == 0 || counters.connectivity_gamma < 10){
        animation.update_connectivity_gamma(v)
      }
      counters.connectivity_gamma = (counters.connectivity_gamma + 1) % period.connectivity_gamma
    }
  }).subscribe(
  "maximum-lags", (v) => {
    document.title = "<<ML>>" + v.length.toString() + "," + v[0].length.toString()
    if(animation){
      if(counters.connectivity_lags % period.connectivity_lags == 0){
        animation.update_lag_dependency(v)
      }
      counters.connectivity_lags = (counters.connectivity_lags + 1) % period.connectivity_lags
    }
  }).subscribe(
  "relevant-links", (v) => {
    document.title = "<<RL>>" + v.length.toString() + "," + v[0].length.toString()
    //console.log("SS", v.length.toString() + "," + v[0].length.toString())
    if(animation) animation.update_connectivity_arrows(v)
  });

setTimeout(() => {
  app_provider.execute("stop");
}, 80000)


/*
const _channels = ["Nz","Iz","Cz","T9","T10","NFpz","Fpz","AFpz","AFz","AFFz","Fz","FFCz","FCz","FCCz","CCPz","CPz","CPPz","Pz","PPOz","POz",
"POOz","Oz","OIz","N2h","N2","AFp10","AF10","AFF10","F10","FFT10","FT10","FTT10","TTP10","TP10","TPP10","P10","PPO10",
"PO10","POO10","I2","I2h","N1h","N1","AFp9","AF9","AFF9","F9","FFT9","FT9","FTT9","TTP9","TP9","TPP9","P9","PPO9","PO9",
"POO9","I1","I1h","T9h","T7","T7h","C5","C5h","C3","C3h","C1","C1h","C2h","C2","C4h","C4","C6h","C6","T8h","T8","T10h",
"NFp2h","NFp2","AFp10h","AF10h","AFF10h","F10h","FFT10h","FT10h","FTT10h","TTP10h","TP10h","TPP10h","P10h","PPO10h",
"PO10h","POO10h","OI2","OI2h","NFp1h","NFp1","AFp9h","AF9h","AFF9h","F9h","FFT9h","FT9h","FTT9h","TTP9h","TP9h","TPP9h",
"P9h","PPO9h","PO9h","POO9h","OI1","OI1h","Fp2h","Fp2","AFp8","AF8","AFF8","F8","FFT8","FT8","FTT8","TTP8","TP8","TPP8",
"P8","PPO8","PO8","POO8","O2","O2h","Fp1h","Fp1","AFp7","AF7","AFF7","F7","FFT7","FT7","FTT7","TTP7","TP7","TPP7","P7",
"PPO7","PO7","POO7","O1","O1h","AFp7h","AFp5","AFp5h","AFp3","AFp3h","AFp1","AFp1h","AFp2h","AFp2","AFp4h","AFp4","AFp6h",
"AFp6","AFp8h","AF7h","AF5","AF5h","AF3","AF3h","AF1","AF1h","AF2h","AF2","AF4h","AF4","AF6h","AF6","AF8h","AFF7h","AFF5",
"AFF5h","AFF3","AFF3h","AFF1","AFF1h","AFF2h","AFF2","AFF4h","AFF4","AFF6h","AFF6","AFF8h","F7h","F5","F5h","F3","F3h",
"F1","F1h","F2h","F2","F4h","F4","F6h","F6","F8h","FFT7h","FFC5","FFC5h","FFC3","FFC3h","FFC1","FFC1h","FFC2h","FFC2",
"FFC4h","FFC4","FFC6h","FFC6","FFT8h","FT7h","FC5","FC5h","FC3","FC3h","FC1","FC1h","FC2h","FC2","FC4h","FC4","FC6h",
"FC6","FT8h","FTT7h","FCC5","FCC5h","FCC3","FCC3h","FCC1","FCC1h","FCC2h","FCC2","FCC4h","FCC4","FCC6h","FCC6","FTT8h",
"TTP7h","CCP5","CCP5h","CCP3","CCP3h","CCP1","CCP1h","CCP2h","CCP2","CCP4h","CCP4","CCP6h","CCP6","TTP8h","TP7h","CP5",
"CP5h","CP3","CP3h","CP1","CP1h","CP2h","CP2","CP4h","CP4","CP6h","CP6","TP8h","TPP7h","CPP5","CPP5h","CPP3","CPP3h",
"CPP1","CPP1h","CPP2h","CPP2","CPP4h","CPP4","CPP6h","CPP6","TPP8h","P7h","P5","P5h","P3","P3h","P1","P1h","P2h","P2",
"P4h","P4","P6h","P6","P8h","PPO7h","PPO5","PPO5h","PPO3","PPO3h","PPO1","PPO1h","PPO2h","PPO2","PPO4h","PPO4","PPO6h",
"PPO6","PPO8h","PO7h","PO5","PO5h","PO3","PO3h","PO1","PO1h","PO2h","PO2","PO4h","PO4","PO6h","PO6","PO8h","POO7h",
"POO5","POO5h","POO3","POO3h","POO1","POO1h","POO2h","POO2","POO4h","POO4","POO6h","POO6","POO8h"].slice(0, 64);
const __channels = ["O2", "O1", "F3", "F4"];
const c3hannels = ["O2", "O1", "F3", "F4", "C5", "C6", "AF7", "AF8"];
const channels = ["Fp1", "Fpz", "Fp2", "AF7", "AF3", "AF4", "AF8", "F7", "F5", "F3", "F1", "Fz", "F2", "F4", "F6", "F8", "FT7", "FC5", "FC3", "FC1", "FCz", "FC2", "FC4", "FC6", "FT8", "T7", "C5", "C3", "C1", "Cz", "C2", "C4", "C6", "T8", "TP7", "CP5", "CP3", "CP1", "CPz", "CP2", "CP4", "CP6", "TP8", "P7", "P5", "P3", "P1", "Pz", "P2", "P4", "P6", "P8", "PO7", "PO3", "Poz", "PO4", "PO8", "O1", "Oz", "O2", "TP9", "TP10"];
window.eeg = rescaledEEGLocations2D({
    width: 100,
    height: 100,
    top: 0,
    left: 0,
  }, true);
window.ch =channels
const animation = draw_animation(document.getElementById("app"), {width: 1300, height: 700}, settings, channels);

setInterval(() => {
  animation.update_timeseries(random_point(channels.length))
  animation.update_connectivity_delta(random_matrix(channels.length))
  animation.update_connectivity_theta(random_matrix(channels.length))
  animation.update_connectivity_alpha(random_matrix(channels.length))
  animation.update_connectivity_beta(random_matrix(channels.length))
  animation.update_connectivity_gamma(random_matrix(channels.length))
  animation.update_connectivity(random_matrix(channels.length))
  animation.update_lag_dependency(random_matrix(channels.length))
  animation.update_connectivity_arrows(random_links(channels.length, settings.animation.mainmap_number_links))
}, 100)

*/



