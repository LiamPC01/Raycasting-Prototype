const TILE_SIZE = 32;
const MAP_NUM_ROWS = 11;
const MAP_NUM_COLS = 15;

const WINDOW_WIDTH = MAP_NUM_COLS * TILE_SIZE;
const WINDOW_HEIGHT = MAP_NUM_ROWS * TILE_SIZE;

const FOV_ANGLE = 60 * (Math.PI / 180) // 60 degrees converted to radians

const WALL_STRIP_WIDTH = 1;
const NUM_RAYS = WINDOW_WIDTH / WALL_STRIP_WIDTH;

class Map {
    constructor() {
        this.grid = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
    }
    render() { // renders from left to right then goes down a row
        for (var i = 0; i < MAP_NUM_ROWS; i++) {
            for (var j = 0; j < MAP_NUM_COLS; j++) {
                var tileX = j * TILE_SIZE;
                var tileY = i * TILE_SIZE;
                var tileColor = this.grid[i][j] == 1 ? "#222" : "#fff";
                stroke("#222");
                fill(tileColor);
                rect(tileX, tileY, TILE_SIZE, TILE_SIZE);
            }
        }
    }
    hasWallAt(x, y) {
        if (x < 0 || x > WINDOW_WIDTH || y < 0 || y > WINDOW_HEIGHT) {
            return true;
        }
        var mapGridIndexX = Math.floor(x / TILE_SIZE);
        var mapGridIndexY = Math.floor(y / TILE_SIZE);
        return this.grid[mapGridIndexY][mapGridIndexX] != 0;

    }
}

class Player {
    constructor() {
        this.x = WINDOW_WIDTH / 2; // Player start in middle of the map
        this.y = WINDOW_HEIGHT / 2;
        this.radius = 3; // Player size 
        this.turnDirection = 0; // -1 if left, +1 if right
        this.walkDirection = 0; // -1 if back, +1 if front
        this.rotationAngle = Math.PI / 2; // PI / 2 is -90 degrees(facing down) 
        this.moveSpeed = 2.0;
        this.rotationSpeed = 2 * (Math.PI / 180); //rotating 2 degrees per frame, converted to radians
    }
    update() {
        this.rotationAngle += this.turnDirection * this.rotationSpeed;

        var moveStep = this.walkDirection * this.moveSpeed; // 1, 0 or -1 * moveSpeed

        // Players location on the grid
        this.gridX = Math.floor(player.x / TILE_SIZE);
        this.gridY = Math.floor(player.y / TILE_SIZE);

        // Moves the player forward in direction theyre facing
        var newPlayerX = this.x + Math.cos(this.rotationAngle) * moveStep; // adjacent = cos(a) * hypotenuse
        var newPlayerY = this.y + Math.sin(this.rotationAngle) * moveStep; // oppsites = sin(a) * hypotenuse

        // Only set player collision if it is not colliding with map walls
        if (!grid.hasWallAt(newPlayerX, newPlayerY)) {
            this.x = newPlayerX;
            this.y = newPlayerY;
        }
    }
    render() {
        noStroke();
        fill("red");
        circle(this.x, this.y, this.radius);
        /*
        stroke("red");
        line( // creates a line and rotates where the player is facing
            this.x,
            this.y,
            // adjacent is along the x-axis, opposite is up the y-axis, hypotenuse is accross both(30)
            // CAH: if cos(rotationAngle) = adj / 30 then adj = cos(rotationAngle) * 30
            this.x + Math.cos(this.rotationAngle) * 30,
            // SOH: if sin(rotationAngle) = opp / 30 then opp = sin(rotationAngle) * 30
            this.y + Math.sin(this.rotationAngle) * 30
            
        );*/
    }
}

class Ray {
    constructor(rayAngle) {
        this.rayAngle = normalizeAngle(rayAngle); // keep angle between 0-2 PI
        this.wallHitX = 0;
        this.wallHitY = 0;
        this.distance = 0;

        this.isRayFacingDown = this.rayAngle > 0 && this.rayAngle < Math.PI;
        this.isRayFacingUp = !this.isRayFacingDown;

        this.isRayFacingRight = this.rayAngle < 0.5 * Math.PI || this.rayAngle > 1.5 * Math.PI;
        this.isRayFacingLeft = !this.isRayFacingRight;
    }
    cast(columnId) {
        var xintercept, yintercept;
        var xstep, ystep;

        // HORIZONTAL Ray-grid intersection
        var foundHorzWallHit = false;
        var wallHitX = 0;
        var wallHitY = 0;

        // Find the y-coordinate of the closest horizontal grid intersection
        yintercept = Math.floor(player.y / TILE_SIZE) * TILE_SIZE;
        yintercept += this.isRayFacingDown ? TILE_SIZE : 0;
        // Find the x-coordinate of the closest horizontal grid intersection
        xintercept = player.x + (yintercept - player.y) / Math.tan(this.rayAngle);

        // Calculate the increment xstep and ystep
        ystep = TILE_SIZE;
        ystep *= this.isRayFacingUp ? -1 : 1;

        xstep = TILE_SIZE / Math.tan(this.rayAngle);
        xstep *= (this.isRayFacingLeft && xstep > 0) ? -1 : 1;
        xstep *= (this.isRayFacingRight && xstep < 0) ? -1 : 1;

        var nextHorzTouchX = xintercept;
        var nextHorzTouchY = yintercept;

        if (this.isRayFacingUp) {
            nextHorzTouchY--;
        }
        
        // increment xstep and ystep until we find a wall
        while (nextHorzTouchX >= 0 && nextHorzTouchY <= WINDOW_WIDTH && nextHorzTouchY >= 0 && nextHorzTouchY <= WINDOW_HEIGHT) {
            if (grid.hasWallAt(nextHorzTouchX, nextHorzTouchY)) {
                foundHorzWallHit = true;
                wallHitX = nextHorzTouchX;
                wallHitY = nextHorzTouchY;

                stroke("red");
                line(player.x, player.y, wallHitX, wallHitY);

                break;
            } else {
                nextHorzTouchX += xstep;
                nextHorzTouchY += ystep;
            }
        }
    }
    render() {
        stroke("red");
        line(
            player.x,
            player.y,
            player.x + Math.cos(this.rayAngle) * 30, // 30 is len of line
            player.y + Math.sin(this.rayAngle) * 30

        );
    }

}

var grid = new Map();
var player = new Player();
var rays = [];

function keyPressed() {
    if (keyCode == UP_ARROW) {
        player.walkDirection = +1;
    } else if (keyCode == DOWN_ARROW) {
        player.walkDirection = -1;
    } else if (keyCode == RIGHT_ARROW) {
        player.turnDirection = +1;
    } else if (keyCode == LEFT_ARROW) {
        player.turnDirection = -1;
    }
}

function keyReleased() {
    if (keyCode == UP_ARROW) {
        player.walkDirection = 0;
    } else if (keyCode == DOWN_ARROW) {
        player.walkDirection = 0;
    } else if (keyCode == RIGHT_ARROW) {
        player.turnDirection = 0;
    } else if (keyCode == LEFT_ARROW) {
        player.turnDirection = 0;
    }
}

function castAllRays() {
    var columnId = 0;

    // start at first ray by subtracting half of the FOV 
    var rayAngle = player.rotationAngle - (FOV_ANGLE / 2); // rotationAngle(middle line) - (FOV_ANGLE(last line) / 2) = first line 

    rays = [];

    // loop all columns casting the rays
    //for (var i = 0; i < NUM_RAYS; i++)
    for (var i = 0; i < 1; i++) {
        var ray = new Ray(rayAngle);
        ray.cast(columnId);
        rays.push(ray);

        rayAngle += FOV_ANGLE / NUM_RAYS;

        columnId++;
    }

}

function normalizeAngle(angle) {
    angle = angle % (2 * Math.PI); // keeps angle less than 2 PI
    if (angle < 0) {
        angle = (2 * Math.PI) + angle; // keep angle positive
    }
    return angle;
}

function setup() {
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function update() {
    player.update();
    

}

function draw() {
    update();

    grid.render();
    
    for (ray of rays) { // render all rays in rays array;
        ray.render();
    }
    player.render();

    castAllRays();
}

