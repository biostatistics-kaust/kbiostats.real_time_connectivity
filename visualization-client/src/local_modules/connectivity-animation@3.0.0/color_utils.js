import colormap from "colormap";

export const to_bin_hex = (hex_string) => {
  if (Number.isSafeInteger(hex_string))
    return hex_string;
  if (hex_string.startsWith("#"))
    hex_string = hex_string.substr(1);
  return parseInt(hex_string, 16);
}
window.colormap = colormap
export const color_scale = (cmap, { levels = 20, max = 100, min = -100 }) => {
  const true_cmap = cmap.replace(/_r$/, "")
  //levels -= 1
  if(levels < 6){
    levels = 10 * levels;
  }
  //max += (max - min) * 0.1
  //min -= (max - min) * 0.1
  let my_colormap = colormap({
    colormap: true_cmap,
    nshades: levels,
    format: 'hex'
  });
  console.log("===========")
  console.log(my_colormap)
  if(cmap.endsWith("_r")){
    my_colormap = my_colormap.reverse();
  }
  console.log(my_colormap)
  const getInt = (v) => {
    v = getScale(v);
    return to_bin_hex(my_colormap[v]);
  }
  const getHex = (v) => {
    v = getScale(v);
    return my_colormap[v];
  }
  const getScale = (v) => {
    return Math.max(0, Math.min(levels - 1, 
      Math.floor(levels * (v - min) / (max - min))
     ));
    //v = Math.max(0, Math.min(levels - 1, Math.ceil(levels * (v - min) / (max - min))));
    v = Math.ceil((levels - 1) * (v - min) / (max - min));
    return v;
  }
  return {getInt, getHex, getScale};
}
window.color_scale = color_scale

