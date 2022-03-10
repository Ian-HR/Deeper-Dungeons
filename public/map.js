
class Map {
  constructor(gridMap) {
    this.grid = gridMap.maps[1].grid; //get it's data from 'levels/levels.json'
  }

  wallAtPos(x, y) { //returns true if there is a wall(1) at position x, y
    if (x < 0 || y < 0 || x > WIDTH || y > HEIGHT) {return true;}//Check for edge canvas

    let indexX = Math.floor(x / TILE_SIZE);
    let indexY = Math.floor(y / TILE_SIZE);

    return this.grid[indexY][indexX];
  }

  getWalls() {//get a list of all the walls, the position and the color (used in DEVMODE)
    let rects = [];
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        let x = j * TILE_SIZE;
        let y = i * TILE_SIZE;

        let color = this.grid[i][j] == 0 ? "0x228822" : "0x882222";
        rects.push({ x : x, y : y, color : color});
      }
    }
    return rects;
  }

  drawWall(i) { //returns a list that contains information on how to draw a wall for a given ray
    let ray = player.rays[i];

    let rayDistance = ray.length * Math.cos(ray.angle - player.rotationAngle); //Fixes Fisheye Bug //
    let projectionPlaneDistance = (WIDTH/2) / Math.tan(FOV/2);           //
    let wallHeight = (TILE_SIZE / rayDistance) * projectionPlaneDistance;////////////////
    
    let widthSq = WIDTH * WIDTH; //Calculates light intensity for distance
    let lengthSq = ray.length * ray.length;
    let distanceShade = map(lengthSq, 0 , widthSq, 255,150);

    let anleShade = ray.hitWasVer ? 200 : 195; //Calculates light for angle
    let shade = Math.sqrt(distanceShade * anleShade); //Mixes angle and distance shade

    let c = this.getWallColor(i, shade);
    
    return [i * WALL_WIDTH, WIDTH/2 - wallHeight/2, WALL_WIDTH, wallHeight, c[0], c[1], c[2]];
  }

  getWallColor(i, shade) {
    let ray = player.rays[i];
    let r, g, b;

    
    switch (ray.wallType) {
      case 1: //red wall
        r = map(shade, 170, 225, 100, 200); 
        g = map(shade, 170, 225, 0, 50); 
        b = map(shade, 170, 225, 0, 50);
        break;

      case 2: //green wall
        r = map(shade, 170, 225, 0, 50);  
        g = map(shade, 170, 225, 100, 200);
        b = map(shade, 170, 225, 0, 50);
        break;

      case 3: //blue wall
        r = map(shade, 170, 225, 0, 50);
        g = map(shade, 170, 225, 0, 50); 
        b = map(shade, 170, 225, 100, 200);
        break;

      default: //default to black if no case was met
        r = 0;
        g = 0;
        b = 0;
        break;
    }

    return [r,g,b];
  }
}

