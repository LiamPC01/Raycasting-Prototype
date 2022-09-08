const TILE_SIZE = 32;
const MAP_NUM_ROWS = 11;
const MAP_NUM_COLS = 15;

const WINDOW_WIDTH = MAP_NUM_COLS * TILE_SIZE;
const WINDOW_HEIGHT = MAP_NUM_ROWS * TILE_SIZE;

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
}

class Player {
    constructor() {
        this.x = WINDOW_WIDTH / 2; // Player start in middle of the map
        this.y = WINDOW_HEIGHT / 2;
        this.radius = 3; // Player size 
        this.turnDirection = 0; // -1 if left, +1 if right
        this.walkDirection = 0; // -1 if back, +1 if front
        this.rotationAngle = Math.PI / 2;
        this.moveSpeed = 2.0;
        this.rotationSpeed = 2 * (Math.PI / 180); //rotating 2 degrees per frame, converted to radians
    }
    update() {
        this.rotationAngle += this.turnDirection * this.rotationSpeed;

        // Moves the player forward in the direction theyre facing
        var moveStep = this.walkDirection * this.moveSpeed;

        // Players location on the grid
        this.gridX = Math.floor(player.x / TILE_SIZE);
        this.gridY = Math.floor(player.y / TILE_SIZE);

        // Check for walls around player
        if (grid.grid[this.gridY - 1][this.gridX] == 1) { // Wall above
            let wallY = (this.gridY) * TILE_SIZE; // gridx * tile_size = coords of wall
            let distToWall = player.y - wallY; 
            if (distToWall <= (player.radius + 1)) { 
                player.y += player.radius;
            }
        }
        if (grid.grid[this.gridY][this.gridX] == 1) { // Wall below
            let wallY = this.gridY * TILE_SIZE; // gridx * tile_size = coords of wall
            let distToWall = player.y - wallY; 
            if (distToWall <= (player.radius + 1)) { 
                player.y -= player.radius;
            }
        }
        if (grid.grid[this.gridY][this.gridX - 1] == 1) { // Wall to left
            let wallX = this.gridX * TILE_SIZE; // gridx * tile_size = coords of wall
            let distToWall = player.x - wallX; 
            if (distToWall <= (player.radius + 1)) { 
                player.x += player.radius;
            }
        }
        if (grid.grid[this.gridY][this.gridX + 1] == 1) { // Wall to right
            let wallX = (this.gridX + 1) * TILE_SIZE; // gridx * tile_size = coords of wall
            let distToWall = wallX - player.x; 
            if (distToWall <= (player.radius + 1)) { 
                player.x -= player.radius;
            }

        }

        // Moves the player forward in direction theyre facing
        this.x += Math.cos(this.rotationAngle) * moveStep; // adjacent = cos(a) * hypotenuse
        this.y += Math.sin(this.rotationAngle) * moveStep; // oppsites = sin(a) * hypotenuse


        // Check if overlapping
        if (grid.grid[this.gridY][this.gridX] != 0) {
            //console.log("Player overlapping");
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

var grid = new Map();
var player = new Player();

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

function setup() {
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function update() {
    player.update();

}

function draw() {
    update();
    grid.render();
    player.render();
}

