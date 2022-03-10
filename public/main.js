var DEVMODE = false //Set this to true for topdown view

//size of the grid/map and map layouts
const COLS = 30; 
const ROWS = 22; 
var TILE_SIZE = 40;
var WALL_WIDTH = 10;
var MAPDATA;

//size of the window/canvas
var WIDTH = TILE_SIZE * COLS;
var HEIGHT = TILE_SIZE * ROWS;

//Player vision
var FOV = deg2rad(60);
var RAYCOUNT = WIDTH / WALL_WIDTH;

//declare class variables
var map;
var player;

//declare global walls variable
var walls;

if (DEVMODE) { //declare variables for DEVMODE
  var rects;
  var playerTopDown;
  var playerLine;
  var rays;
}

var config = { //Initialize config for Phaser3 game engine
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};


var game = new Phaser.Game(config); //Create phaser3 game object
var cursors; // declare cursor keys variable


function preload () {//Phaser3 function that is used to load assets and init classes
  //Load cursor keys
  cursors = this.input.keyboard.createCursorKeys();
  
  //load jsonfiles in cache
  this.load.json('level', 'levels/levels.json');

  //Init classes
  player = new Player(WIDTH/4, HEIGHT/4); 
}


function create () {//Phaser3 function that is used to create all of the game objects
  
  //loading json from cache and smack it in the map that I now initialize here instead of in the preload
  MAPGRID = this.cache.json.get('level');
  grid = new Map(MAPGRID);
  
  //Draw Ceiling background once
  let ceiling = this.add.rectangle(0, 0, WIDTH,HEIGHT*0.67, "0x000055").setOrigin(0,0);

  //Draw Floor background once
  let ground = this.add.rectangle(0, HEIGHT*0.67, WIDTH,HEIGHT*0.33, "0x228822").setOrigin(0,0);
 
  
  //Create n* rectagles, * where n is the amount of rays (RAYCOUNT)
  walls = [];
  for (let i = 0; i < RAYCOUNT; i++) {
    walls.push(this.add.rectangle(WIDTH, HEIGHT, 50, 50, '0x000000').setOrigin(0,0));
  }

  if (DEVMODE) {//Create all the DEVMODE objects
    rects = [];
    for (let i = 0; i < grid.getWalls().length; i++) {
      let rect = this.add.rectangle(0, 0, TILE_SIZE, TILE_SIZE, '0x000000').setOrigin(0,0);
      rects.push(rect);
    }
    playerTopDown = this.add.ellipse(WIDTH/2, HEIGHT/2, TILE_SIZE/2, TILE_SIZE/2, "0xffffff");
    playerLine = this.add.line(10, 10, 0, 0, 50, 0);

    rays = [];
    for (let i = 0; i < RAYCOUNT; i++) {
      rays.push(this.add.line(10, 10, 0, 0, 50, 0));
    }
  } 
}

function update () {//Phaser3 function that is used to update the objects
  draw();
  if (DEVMODE) {drawTopDown();}
  player.walk();
}


function draw() {//Update and redraw game
  //Cast rays and draw walls
  for (let i = 0; i < RAYCOUNT; i++) {
    player.castRay(i);

    let wall = grid.drawWall(i);
    let r = wall[4]; 
    let g = wall[5]; 
    let b = wall[6]; 

    walls[i].setPosition(wall[0], wall[1]);
    walls[i].setDisplaySize(wall[2], wall[3]);
    walls[i].setFillStyle(dec2HexRGB(r, g, b));
  }
}

function drawTopDown() {//DEVMODE function to draw topdown view
  let walls = grid.getWalls(); 
  for (let i = 0; i < walls.length; i ++) { //Draw grid (Top down)
    let wall = walls[i];
    rects[i].setPosition(wall.x, wall.y);
    rects[i].setFillStyle(wall.color);
    rects[i].setStrokeStyle(1, 0x000000);
  }
  playerTopDown.setPosition(player.x, player.y);
  
  playerLine.setPosition(player.x, player.y).setOrigin(0,0);
  playerLine.setRotation(player.rotationAngle);
  playerLine.setStrokeStyle(1, 0x0000ff);

  // for (let i = 0; i < RAYCOUNT; i ++) { //note 6
  //   let ray = rays[i];
  //   ray.setPosition(player.x, player.y).setOrigin(0,0);
  //   ray.setTo(0, 0, player.rays[i].endX, player.rays[i].endY);
  //   ray.setRotation(player.rays[i].angle);
  //   ray.setStrokeStyle(1, 0xff00ff);
  // }
}

//NOTES//BUGS//

//4 implement mini map

//5 Make window class! (or scene.. or app,,,)

//6 Casting rays for DEV mode dont work :(
