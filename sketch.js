var Action = {
    DOWN: 2,
    MOVED: 1,
    UP: 0
};

var rows = 4;
var columns = 3;
var tiles = [];
var prevMouseX = 0;
var prevMouseY = 0;
var deg = [0, 2, 5, 7, 9];
var baseNote = 48;

function setup() {
    for (let i = 0; i < columns; i++){ 
        for (let j = 0; j < rows; j++) {
            let tile = {
                down: false,
                row: j,
                column: i,
                r: random(256),
                g: random(256),
                b: random(256),
                osc: new p5.SqrOsc
            };
            let octave = Math.trunc(tiles.length / deg.length);
            let note = baseNote + deg[tiles.length % deg.length] + octave * 12;
            tile.osc.freq(midiToFreq(note));
            tiles.push(tile);
        }
    };
    createCanvas(windowWidth, windowHeight);
    background(255);
    stroke(255);
}

function draw() {
    clear();
    let tileWidth = windowWidth / rows;
    let tileHeight = windowHeight / columns;

    for (let i = 0; i < tiles.length; i++) {
        let tile = tiles[i];
        fill(tile.r, tile.g, tile.b, tile.down ? 255 : 128);
        rect(tile.row * tileWidth, tile.column * tileHeight, tileWidth, tileHeight);
    };
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(222);
};

function touchStarted() {
    processInput(Action.DOWN);
}

function touchMoved() {
    processInput(Action.MOVED);
}

function touchEnded() {
    processInput(Action.UP);
}

function processInput(action) {
    if (touches.length) {
        for (let i in touches) {
            let touch = touches[i];
            if (action == Action.MOVED) {
                checkMovedInput(touch.x, touch.y, touch.px, touch.py);
            } else {
                activateTile(touch.x, touch.y, action);
            }
            touch.px = touch.x;
            touch.py = youch.y;
        };
    } else {
        if (action == Action.MOVED) {
            checkMovedInput(mouseX, mouseY, prevMouseX, prevMouseY);
        } else {
            activateTile(mouseX, mouseY, action);
        }
        prevMouseX = mouseX;
        prevMouseY = mouseY;
    }
}

function activateTile(x, y, activate) {
    let tileWidth = windowWidth / rows;
    let tileHeight = windowHeight / columns;

    let col = Math.trunc(x / tileWidth);
    let row = Math.trunc(y / tileHeight);

    let index = row * columns + col + row;
    let tile = tiles[index];
    activate ? tile.osc.start() : tile.osc.stop();
    tile.down = activate;
}

function checkMovedInput(x, y, px, py) {
    let tileWidth = windowWidth / rows;
    let tileHeight = windowHeight / columns;

    let pCol = Math.trunc(px / tileWidth);
    let pRow = Math.trunc(py / tileHeight);
    let col = Math.trunc(x / tileWidth);
    let row = Math.trunc(y / tileHeight);

    let index = row * columns + col + row;
    let pindex = pRow * columns + pCol + pRow;
    tiles[pindex].down = true;

    if (pindex != index) {
        tiles[pindex].down = false;
        tiles[pindex].osc.stop();
        tiles[index].osc.start();
    }
}

