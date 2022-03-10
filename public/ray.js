class Ray {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;

    this.angle = normalizeAngle(angle);

    this.endX = 0;
    this.endY = 0;

    this.length = 0;

    this.wallType = 0;
    
    //check if the ray collision was vertical
    this.hitWasVer = false;

    //Ray Directions
    this.isFacingDown = (this.angle > 0) && (this.angle < Math.PI);
    this.isFacingUp = !this.isFacingDown;
    this.isFacingRight = (this.angle < Math.PI/2) || (this.angle > (3*Math.PI/2));
    this.isFacingLeft = !this.isFacingRight;
  }

  cast(playerX, playerY) {//casts ray to calculate its length and end position
    let forHorizontal = true; //intercept function check for horizontal intersection of vertical

    //declare variables for the closest wallhit, assigns them with max value
    let closestHor = { x : Number.MAX_VALUE, y : Number.MAX_VALUE};
    let closestVer = { x : Number.MAX_VALUE, y : Number.MAX_VALUE};

    //set closest points if found
    let hor = this.intercept(playerX, playerY, TILE_SIZE, forHorizontal);
    if (hor) {closestHor = hor;}
    let ver = this.intercept(playerX, playerY, TILE_SIZE, !forHorizontal);
    if (ver) {closestVer = ver;}

    //check distance between player and points
    let distanceToHor = distanceBetweenPoints(this.x, this.y, closestHor.x, closestHor.y) 
    let distanceToVer = distanceBetweenPoints(this.x, this.y, closestVer.x, closestVer.y)

    //check for closest point and sets length and end points
    this.hitWasVer = distanceToHor < distanceToVer ? false : true;
    this.endX = distanceToHor < distanceToVer ? closestHor.x : closestVer.x;
    this.endY = distanceToHor < distanceToVer ? closestHor.y : closestVer.y; 
    this.length = distanceToHor < distanceToVer ? distanceToHor : distanceToVer;
    this.wallType = distanceToHor < distanceToVer ? closestHor.type : closestVer.type;
  }


  intercept(playerX, playerY, TILE_SIZE, forHorizontal) { // Finds and returns the closest collision for Horizontal XOR Vertical intersections.
    let xIntercept, yIntercept;//points for intersection
    let deltaX, deltaY;//DISTANCE to next intercept point
    let wallHit, wallHitY, wallHitX;//wallhit position
    let nextXIntercept, nextYIntercept;//next intercept points
    let wallType; //Used to store walltype if hit

    wallHit = false;
    wallHitY, wallHitX = 0;

    //set closest intersection
    yIntercept = forHorizontal ? Math.floor(playerY / TILE_SIZE) * TILE_SIZE : Math.floor(playerX / TILE_SIZE) * TILE_SIZE; 
    yIntercept += forHorizontal ? (this.isFacingDown ? TILE_SIZE : 0) : (this.isFacingRight ? TILE_SIZE : 0);
    xIntercept = forHorizontal ? playerX + ((yIntercept -  playerY) / Math.tan(this.angle)) : playerY + ((yIntercept -  playerX) * Math.tan(this.angle));

    //Calculate distance in between intersections
    deltaY = TILE_SIZE;
    deltaY *= forHorizontal ? (this.isFacingUp ? -1 : 1) : (this.isFacingLeft ? -1 : 1);
    deltaX = forHorizontal ? TILE_SIZE / Math.tan(this.angle) : TILE_SIZE * Math.tan(this.angle);
    deltaX *= forHorizontal ? (this.isFacingLeft && deltaX > 0 ? -1 : 1) : (this.isFacingUp && deltaX > 0 ? -1 : 1);
    deltaX *= forHorizontal ? (this.isFacingRight && deltaX < 0 ? -1 : 1) : (this.isFacingDown && deltaX < 0 ? -1 : 1);
    
    //Set next step
    nextXIntercept = forHorizontal ? xIntercept : yIntercept;
    nextYIntercept = forHorizontal ? yIntercept : xIntercept;

    //loop to check all interception and return position on wallhit
    while (nextXIntercept > 0 && nextXIntercept <= WIDTH && nextYIntercept > 0 && nextYIntercept <= HEIGHT) {
      wallType = this.rayCollide(nextXIntercept - (!forHorizontal && this.isFacingLeft ? 1 : 0), nextYIntercept - (forHorizontal && this.isFacingUp ? 1 : 0))
      if (wallType != 0){
        wallHitX = nextXIntercept; 
        wallHitY = nextYIntercept; 
        return { x : wallHitX, y : wallHitY, type : wallType};
      }
      else {
        nextXIntercept += forHorizontal ? deltaX : deltaY ; nextYIntercept += forHorizontal ? deltaY : deltaX;
      }
    }
  }

  rayCollide(x, y) {//Check for collision with wall
    return grid.wallAtPos(x, y); //Map method checks if wall in (x, y)
  }
}