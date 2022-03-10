class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = TILE_SIZE/2; //size of the player
    this.rotationAngle = Math.PI / 2; //what angle the player is facing
    this.speed = TILE_SIZE/20; //movement speed
    this.Rotationspeed = deg2rad(2);

    this.isFacingDown = (this.rotationAngle > 0) && (this.rotationAngle < Math.PI);
    this.isFacingUp = !this.isFacingDown;
    this.isFacingRight = (this.rotationAngle < Math.PI/2) || (this.rotationAngle > (3*Math.PI/2));
    this.isFacingLeft = !this.isFacingRight;
    
    this.rays = [];//List of rays used for casting
  }

  walk(){ //Code for player movement
    
    //vars used to calculate nextstep
    let nextX;
    let nextY;
    
    if (cursors.up.isDown) { //up
      nextX = this.x + Math.cos(this.rotationAngle) * this.speed;
      nextY = this.y + Math.sin(this.rotationAngle) * this.speed;
      if (!this.playerCollide(nextX, nextY)) {
        this.x = nextX; this.y = nextY;
      }
      else if (!this.playerCollide(nextX, this.y)) {
        this.x = nextX;
      }
      else if (!this.playerCollide(this.x, nextY)) {
        this.y = nextY;
      }
    }

    if (cursors.down.isDown) { //down
      nextX = this.x - Math.cos(this.rotationAngle) * this.speed;
      nextY = this.y - Math.sin(this.rotationAngle) * this.speed;
      if (!this.playerCollide(nextX, nextY)) {
        this.x = nextX; this.y = nextY;
      }
      else if (!this.playerCollide(nextX, this.y)) {
        this.x = nextX;
      }
      else if (!this.playerCollide(this.x, nextY)) {
        this.y = nextY;
      }
    }

    if (cursors.left.isDown) { //left
      this.rotationAngle += -this.Rotationspeed;
    }

    if (cursors.right.isDown) { //right
      this.rotationAngle += this.Rotationspeed;
    }
  }

  playerCollide(x, y) {//Check for collision on next step
    if(grid.wallAtPos(x,y) || grid.wallAtPos(x ,y -1) || grid.wallAtPos(x ,y +1) || grid.wallAtPos(x -1,y) || grid.wallAtPos(x+1 ,y) == true){
      return true;
    }
    //return grid.wallAtPos(x, y); //Map method checks if wall in (x, y)
  }

  castRay(i) {//Fill player with ray objects used to draw walls
    //empty rays if full
    if (this.rays.length >= RAYCOUNT) {this.rays = [];}

    //set angle for ray
    let angle = this.rotationAngle - (FOV/2) + ((FOV/RAYCOUNT) * i);
    
    //add ray to the list of this.rays
    this.rays.push(new Ray(this.x, this.y, angle));

    //cast the ray
    this.rays[i].cast(this.x, this.y);
  }
}
