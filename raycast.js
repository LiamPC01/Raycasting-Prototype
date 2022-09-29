const TILE_SIZE = 64;
const MAP_NUM_ROWS = 11;
const MAP_NUM_COLS = 15;

const WINDOW_WIDTH = MAP_NUM_COLS * TILE_SIZE;
const WINDOW_HEIGHT = MAP_NUM_ROWS * TILE_SIZE;

const FOV_ANGLE = 60 * (Math.PI / 180) // 60 degrees converted to radians

const WALL_STRIP_WIDTH = 10;
const NUM_RAYS = WINDOW_WIDTH / WALL_STRIP_WIDTH;

const MINIMAP_SCALE_FACTOR = 0.2;

class Map {
    constructor() {
        this.grid = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
            [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 1],
            [1, 3, 3, 3, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 3, 3, 3, 3, 3, 0, 0, 0, 2, 2, 2, 2, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
    }
    hasWallAt(x, y) {
        if (x < 0 || x > WINDOW_WIDTH || y < 0 || y > WINDOW_HEIGHT) {
            return true;
        }
        var mapGridIndexX = Math.floor(x / TILE_SIZE);
        var mapGridIndexY = Math.floor(y / TILE_SIZE);
        return this.grid[mapGridIndexY][mapGridIndexX] != 0;

    }
    getWallContentAt(x, y) {
        if (x < 0 || x > WINDOW_WIDTH || y < 0 || y > WINDOW_HEIGHT) {
            return 0;
        }
        var mapGridIndexX = Math.floor(x / TILE_SIZE);
        var mapGridIndexY = Math.floor(y / TILE_SIZE);
        return this.grid[mapGridIndexY][mapGridIndexX];
    }
    render() { // renders from left to right then goes down a row
        for (var i = 0; i < MAP_NUM_ROWS; i++) {
            for (var j = 0; j < MAP_NUM_COLS; j++) {
                var tileX = j * TILE_SIZE;
                var tileY = i * TILE_SIZE;
                var tileColour = "#222";
                if (this.grid[i[j] == 1]) {
                    tileColour = "#222";
                } else if (this.grid[i][j] == 0) {
                    tileColour = "#fff";
                } else if (this.grid[i][j] == 'r') {
                    tileColour = "red";
                } else if (this.grid[i][j] == 'g') {
                    tileColour = "green";
                } else if (this.grid[i][j] == 'b') {
                    tileColour = "blue";
                }
                stroke("#222");
                fill(tileColour);
                rect(
                    MINIMAP_SCALE_FACTOR * tileX,
                    MINIMAP_SCALE_FACTOR * tileY,
                    MINIMAP_SCALE_FACTOR * TILE_SIZE,
                    MINIMAP_SCALE_FACTOR * TILE_SIZE
                );
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
        circle(
            MINIMAP_SCALE_FACTOR * this.x,
            MINIMAP_SCALE_FACTOR * this.y,
            MINIMAP_SCALE_FACTOR * this.radius
        );

        stroke("blue");
        line( // creates a line and rotates where the player is facing
            MINIMAP_SCALE_FACTOR * this.x,
            MINIMAP_SCALE_FACTOR * this.y,
            // adjacent is along the x-axis, opposite is up the y-axis, hypotenuse is accross both(30)
            // CAH: if cos(rotationAngle) = adj / 30 then adj = cos(rotationAngle) * 30
            MINIMAP_SCALE_FACTOR * (this.x + Math.cos(this.rotationAngle) * 30),
            // SOH: if sin(rotationAngle) = opp / 30 then opp = sin(rotationAngle) * 30
            MINIMAP_SCALE_FACTOR * (this.y + Math.sin(this.rotationAngle) * 30)

        );
    }
}

class Ray {
    constructor(rayAngle) {
        this.rayAngle = normalizeAngle(rayAngle); // keep angle between 0-2 PI
        this.wallHitX = 0;
        this.wallHitY = 0;
        this.distance = 0;
        this.wasHitVertical = false;
        this.hitWallColour = 0;

        this.isRayFacingDown = this.rayAngle > 0 && this.rayAngle < Math.PI;
        this.isRayFacingUp = !this.isRayFacingDown;

        this.isRayFacingRight = this.rayAngle < 0.5 * Math.PI || this.rayAngle > 1.5 * Math.PI;
        this.isRayFacingLeft = !this.isRayFacingRight;
    }
    cast() {
        var xintercept, yintercept;
        var xstep, ystep;

        //////////////////////////////////////
        // HORIZONTAL Ray-grid intersection //
        //////////////////////////////////////
        var foundHorzWallHit = false;
        var horzWallHitX = 0;
        var horzWallHitY = 0;
        var horzWallColour = 0;

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

        // increment xstep and ystep until we find a wall
        while (nextHorzTouchX >= 0 && nextHorzTouchY <= WINDOW_WIDTH && nextHorzTouchY >= 0 && nextHorzTouchY <= WINDOW_HEIGHT) {
            var wallGridContent = grid.getWallContentAt(
                nextHorzTouchX,
                nextHorzTouchY + (this.isRayFacingUp ? -1 : 0) // if ray is facing up, force one pixel up so we are inside a grid cell
            );
            if (wallGridContent != 0) {
                foundHorzWallHit = true;
                horzWallHitX = nextHorzTouchX;
                horzWallHitY = nextHorzTouchY;
                horzWallColour = wallGridContent;
                break;
            } else {
                nextHorzTouchX += xstep;
                nextHorzTouchY += ystep;
            }
        }

        //////////////////////////////////////
        // VERTICAL Ray-grid intersection //
        //////////////////////////////////////

        var foundVertWallHit = false;
        var vertWallHitX = 0;
        var vertWallHitY = 0;
        var vertWallColour = 0;

        // Find the x-coordinate of the closest vertical grid intersection
        xintercept = Math.floor(player.x / TILE_SIZE) * TILE_SIZE;
        xintercept += this.isRayFacingRight ? TILE_SIZE : 0;

        // Find the y-coordinate of the closest vertical grid intersection
        yintercept = player.y + (xintercept - player.x) * Math.tan(this.rayAngle);

        // Calculate the increment xstep and ystep
        xstep = TILE_SIZE;
        xstep *= this.isRayFacingLeft ? -1 : 1;

        ystep = TILE_SIZE * Math.tan(this.rayAngle);
        ystep *= (this.isRayFacingUp && ystep > 0) ? -1 : 1;
        ystep *= (this.isRayFacingDown && ystep < 0) ? -1 : 1;

        var nextVertTouchX = xintercept;
        var nextVertTouchY = yintercept;

        // increment xstep and ystep until we find a wall
        while (nextVertTouchX >= 0 && nextVertTouchY <= WINDOW_WIDTH && nextVertTouchY >= 0 && nextVertTouchY <= WINDOW_HEIGHT) {
            var wallGridContent = grid.getWallContentAt(
                nextVertTouchX + (this.isRayFacingLeft ? -1 : 0), // if ray is facing left, force one pixel left so we are inside a grid cell
                nextVertTouchY
            );
            if (wallGridContent != 0) {
                foundVertWallHit = true;
                vertWallHitX = nextVertTouchX;
                vertWallHitY = nextVertTouchY;
                vertWallColour = wallGridContent;
                break;
            } else {
                nextVertTouchX += xstep;
                nextVertTouchY += ystep;
            }
        }

        // Calculate both horizontal and vertical distances and choose the smallest value
        var horzHitDistance = (foundHorzWallHit)
            ? distanceBetweenPoints(player.x, player.y, horzWallHitX, horzWallHitY)
            : Number.MAX_VALUE;
        var vertHitDistance = (foundVertWallHit)
            ? distanceBetweenPoints(player.x, player.y, vertWallHitX, vertWallHitY)
            : Number.MAX_VALUE;

        // Only store the smallest of the distances
        if (vertHitDistance < horzHitDistance) {
            this.wallHitX = vertWallHitX;
            this.wallHitY = vertWallHitY;
            this.distance = vertHitDistance;
            this.hitWallColour = vertWallColour;
            this.wasHitVertical = true;
        } else {
            this.wallHitX = horzWallHitX;
            this.wallHitY = horzWallHitY;
            this.distance = horzHitDistance;
            this.hitWallColour = horzWallColour;
            this.wasHitVertical = false;
        }
    }
    render() {
        stroke("rgba(255, 0, 0, 1.0)");
        line(
            MINIMAP_SCALE_FACTOR * player.x,
            MINIMAP_SCALE_FACTOR * player.y,
            MINIMAP_SCALE_FACTOR * this.wallHitX,
            MINIMAP_SCALE_FACTOR * this.wallHitY

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
    // start at first ray by subtracting half of the FOV 
    var rayAngle = player.rotationAngle - (FOV_ANGLE / 2); // rotationAngle(middle line) - (FOV_ANGLE(last line) / 2) = first line 

    rays = [];

    // loop all columns casting the rays
    for (var col = 0; col < NUM_RAYS; col++) {
        var ray = new Ray(rayAngle);
        ray.cast();
        rays.push(ray);

        rayAngle += FOV_ANGLE / NUM_RAYS;

    }

}

function render3DProjectedWalls() {
    // loop every ray in the array of rays
    for (var i = 0; i < NUM_RAYS; i++) {
        var ray = rays[i];

        var correctWallDistance = ray.distance * Math.cos(ray.rayAngle - player.rotationAngle);

        // calculate the distance to the projection plane
        var distanceProjectionPlane = (WINDOW_WIDTH / 2) / Math.tan(FOV_ANGLE / 2);

        // projected wall height
        var wallStripHeight = (TILE_SIZE / correctWallDistance) * distanceProjectionPlane;

        // set a darker color if the wall is facing north-south
        var colourBrightness = ray.wasHitVertical ? 255 : 200;

        // set the correct color based on the wall hit grid content (1=Red, 2=Green, 3=Blue)
        var colourR = ray.hitWallColour == 1 ? colourBrightness : 25;
        var colourG = ray.hitWallColour == 2 ? colourBrightness : 25;
        var colourB = ray.hitWallColour == 3 ? colourBrightness : 25;
        var alpha = 1.0;

        fill("rgba(" + colourR + "," + colourG + "," + colourB + "," + alpha + ")")
        noStroke()
        rect(
            i * WALL_STRIP_WIDTH,
            (WINDOW_HEIGHT / 2) - (wallStripHeight / 2), // revise this
            WALL_STRIP_WIDTH,
            wallStripHeight
        );

    }

}

function normalizeAngle(angle) {
    angle = angle % (2 * Math.PI); // keeps angle less than 2 PI
    if (angle < 0) {
        angle = (2 * Math.PI) + angle; // keep angle positive
    }
    return angle;
}

function distanceBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function setup() {
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function update() {
    player.update();
    castAllRays();

}

function draw() {
    clear();
    update();

    render3DProjectedWalls();

    grid.render();
    for (ray of rays) { // render all rays in rays array;
        ray.render();
    }
    player.render();

}

