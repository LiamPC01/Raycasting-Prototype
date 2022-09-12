const TILE_SIZE = 32;
const MAP_NUM_ROWS = 11;
const MAP_NUM_COLS = 15;

const WINDOW_WIDTH = MAP_NUM_COLS * TILE_SIZE;
const WINDOW_HEIGHT = MAP_NUM_ROWS * TILE_SIZE;

const FOV_ANGLE = 60 * (Math.PI / 180) // 60 degrees in radians

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
    render() { // renders from left to right then goes down, repeat
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
        this.rotationAngle = Math.PI / 2; // PI is 180 degrees(facing left) / 2 is -90(facing down) 0(facing right)
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

        if (!grid.hasWallAt(newPlayerX, newPlayerY)) {
            this.x = newPlayerX;
            this.y = newPlayerY;
        }
    }
    render() {
        noStroke();
        fill("red");
        circle(this.x, this.y, this.radius);
        stroke("red");
        line( // creates a line and rotates where the player is facing
            this.x,
            this.y,
            // adjacent is along the x-axis, opposite is up the y-axis, hypotenuse is accross both(30)
            // CAH: if cos(rotationAngle) = adj / 30 then adj = cos(rotationAngle) * 30
            this.x + Math.cos(this.rotationAngle) * 30, // cos for adjacent
            // SOH: if sin(rotationAngle) = opp / 30 then opp = sin(rotationAngle) * 30
            this.y + Math.sin(this.rotationAngle) * 30 // sin for opposite

        );
    }
}

class Ray {
    constructor(rayAngle) {
        this.rayAngle = rayAngle;
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
    hitDetection() {
        // is the ray going down or up?
        console.log("rayAngle = " + this.rayAngle);
        var distToAboveY = player.y % TILE_SIZE; // remainder is distance to tile above
        var distToBelowY = TILE_SIZE - distToAboveY;
        var interceptY = player.y - distToAboveY; 

        var distToX = distToAboveY / Math.tan(this.rayAngle); // toa, distToX is adj, distToAboveY is opp
        var interceptX = player.x + distToX;

        //console.log("player(" + Math.floor(player.x) + "," + Math.floor(player.y) + ")");
        //console.log("intercept(" + Math.floor(interceptX) + "," + Math.floor(interceptY) + ")");
       
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

    // start first ray subtracting half of the FOV
    var rayAngle = player.rotationAngle - (FOV_ANGLE / 2); // rotationAngle(middle line) - (FOV_ANGLE(last line) / 2) = first line 

    rays = [];

    // loop all columns casting the rays
    //for (var i = 0; i < NUM_RAYS; i++)
    for (var i = 0; i < 1; i++) {
        var ray = new Ray(rayAngle);
        // ray.cast()
        rays.push(ray);

        rayAngle += FOV_ANGLE / NUM_RAYS;

        columnId++;

    }
    //HERE
    ray.hitDetection();
}

function setup() {
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function update() {
    player.update();
    castAllRays();
}

function draw() {
    update();

    grid.render();
    player.render();
    for (ray of rays) { // render all rays in rays array;
        ray.render();
    }
}

