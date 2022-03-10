let r = "255";
let g = "255";
let b = "255";



function dec2HexRGB(r, g, b) {
  let rX = parseInt(r).toString(16);
  let gX = parseInt(g).toString(16);
  let bX = parseInt(b).toString(16);

  return `0x${rX}${gX}${bX}`;
}



hexcol = dec2HexRGB(r, g, b)
console.log(hexcol);