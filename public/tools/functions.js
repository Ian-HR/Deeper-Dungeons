function deg2rad(degrees) { //Converts degrees to radians
  let radians = degrees * (Math.PI / 180.0);
  return radians;
}

function rad2deg(radians) { //Concerts radians to degrees
  let degrees = radians / (Math.PI / 180.0);
  return degrees;
}

function normalizeAngle(a) { //Normalizes an angle
  a = a % (2 * Math.PI);
  return a < 0 ? (2 * Math.PI) + a : a;
}

function  distanceBetweenPoints(x1, y1, x2, y2) { //Calculates te distance between 2 points (x,y),(x,y)
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function map(v, start1, stop1, start2, stop2,) { //Maps the value and it's range to a new range
  return ((v - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

function dec2HexRGB(r, g, b) { //concert 8bit colors to hexa color code
  let rX = parseInt(r).toString(16);
  let gX = parseInt(g).toString(16);
  let bX = parseInt(b).toString(16);
  if (rX.length < 2) {rX = "0" + rX};
  if (gX.length < 2) {gX = "0" + gX};
  if (bX.length < 2) {bX = "0" + bX};
  return `0x${rX}${gX}${bX}`;
}

