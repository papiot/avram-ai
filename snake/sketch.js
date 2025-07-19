const GameState = Object.freeze({
    MENU: "menu",
    GAME: "game",
    PAUSE: "pause"
})

const CellState = Object.freeze({
    EMPTY: 0,
    SNAKE: 1,
    FOOD: 2,
    WALL: 3
})

const SnakeDirection = Object.freeze({
    NORTH: 0,
    SOUTH: 1,
    EAST: 2,
    WEST: 3
})

const snakeHead = {
    x: 0,
    y: 0
}

const snakeTail = {
    x: 0,
    y: 0
}

const CANVAS_WIDHT = 800
const CANVAS_HEIGHT = 600

const MAX_X = 79
const MAX_Y = 55

let canvas

let startGameButton
let pauseGameButton
let endGameButton

let currentGameState
let stateChanged = true

let grid = Array(4560).fill(CellState.EMPTY)
let snakeDirection = SnakeDirection.SOUTH

let lastUpdateTime = 0
const updateInterval = 200 // 1s

function windowResized() {
    centerCanvas()
    updateButtonPosition(startGameButton)
}

function centerCanvas() {
    let x = (windowWidth - width) / 2
    let y = (windowHeight - height) / 2
    canvas.position(x, y)
}

function setup() {
    canvas = createCanvas(CANVAS_WIDHT, CANVAS_HEIGHT)
    centerCanvas()
    background(200)
    currentGameState = GameState.MENU

    drawGrid()

    // occupy(x,y)
    // occupy(0,0)
    //occupy(79,0)
    // occupy(0,1)
    // occupy(0,55)
    // occupy(79,55)

    // the snake at startup
    // this is the tail, initial direction is SOUTH
    occupy(40,23, CellState.SNAKE)
    snakeTail.x = 40
    snakeTail.y = 23

    occupy(40,24, CellState.SNAKE)
    occupy(40,25, CellState.SNAKE)
    
    // this is the head, initial direciton is SOUTH
    occupy(40,26, CellState.SNAKE)
    snakeHead.x = 40
    snakeHead.y = 26

    // Build wall on the sides
    // west and east side
    for (var i = 0; i < 56; i++) {
        occupy(0,i, CellState.WALL)
        occupy(79,i, CellState.WALL)
    }

    // south and north side
    for (var i = 0; i < 80; i++) {
        occupy(i, 0, CellState.WALL)
        occupy(i, 55, CellState.WALL)
    }

    // Food
    occupy(Math.floor(random(0, MAX_X+1)), Math.floor(random(0, MAX_Y+1)), CellState.FOOD)

    push()
        drawSnake()
    pop()

}
// 76 x 60 (width x height) (x, y)
function occupy(x, y, value) {
    grid[y * 80 + x] = value    
}

function drawSnake() {
    for (var i = 0; i < grid.length; i++) {
        const c = grid[i]
        // if (c === CellState.EMPTY) {
        //     continue
        // }

        const x = i % 80;
        const y = Math.floor(i / 80);
  
        const pixelX = x * 10;
        const pixelY = y * 10;
        
        if (c === CellState.SNAKE) {
            // Red for snake
            fill(255,0,0)
        }
        if (c === CellState.FOOD) {
            // Green for food
            fill(0,255,0)
        }
        if (c === CellState.WALL) {
            // Blue for wall
            fill(0,0,255)
        }
        if (c === CellState.EMPTY) {
            // make it empty
            fill(200,200,200)
        }

        square(pixelX, pixelY+40, 10)
    }
}

function keyPressed() {
    // Arrow keys (use keyCode)
    if (keyCode === LEFT_ARROW || key === 'a' || key === 'A') {
        if (snakeDirection !== SnakeDirection.EAST) {
            snakeDirection = SnakeDirection.WEST
        }
    }
    if (keyCode === RIGHT_ARROW || key === 'd' || key === 'D') {
        if (snakeDirection !== SnakeDirection.WEST) {
            snakeDirection = SnakeDirection.EAST
        }
    }
    if (keyCode === UP_ARROW || key === 'w' || key === 'W') {
        if (snakeDirection !== SnakeDirection.SOUTH) {
            snakeDirection = SnakeDirection.NORTH
        }
    }
    if (keyCode === DOWN_ARROW || key === 's' || key === 'S') {
        if (snakeDirection !== SnakeDirection.NORTH) {
            snakeDirection = SnakeDirection.SOUTH
        }
    }
}

function drawGrid() {
    // draw the grid
    push()
        strokeWeight(1)
        color(0,0,0)
        line(0, 40, canvas.width, 40)
        // 60 in width
        for (let i = 40; i <= 600; i+=10) {
            line(0, i, canvas.width, i)
        }

        // 76 in height
        for (let i = 0; i <= 800; i += 10) {
            line(i, 40, i, canvas.height)
        }
    pop()
}

function draw() {
    let currentTime = millis()
    if (currentTime - lastUpdateTime >= updateInterval) {
        updateCanvas()
        lastUpdateTime = currentTime
    }    
}

function coordsToIndex(x, y, width = 80) {
  return y * width + x;
}

function updateGrid() {
    // highlight next head
    let nextHeadX
    let nextHeadY
    if (snakeDirection === SnakeDirection.SOUTH) {
        nextHeadX = snakeHead.x
        nextHeadY = snakeHead.y + 1
        occupy(nextHeadX, nextHeadY, CellState.SNAKE)
    }
    if (snakeDirection === SnakeDirection.NORTH) {
        nextHeadX = snakeHead.x
        nextHeadY = snakeHead.y - 1
        occupy(nextHeadX, nextHeadY, CellState.SNAKE)
    }
    if (snakeDirection === SnakeDirection.EAST) {
        nextHeadX = snakeHead.x+1
        nextHeadY = snakeHead.y
        occupy(nextHeadX, nextHeadY, CellState.SNAKE)
    }
    if (snakeDirection === SnakeDirection.WEST) {
        nextHeadX = snakeHead.x-1
        nextHeadY = snakeHead.y
        occupy(nextHeadX, nextHeadY, CellState.SNAKE)
    }
    snakeHead.x = nextHeadX
    snakeHead.y = nextHeadY

    // Regardless of direction, remove the tail
    let nextTailX
    let nextTailY
    let index = 0

    // Check NORTH
    index = coordsToIndex(snakeTail.x, snakeTail.y-1)
    if (grid[index] === CellState.SNAKE) {
        nextTailX = snakeTail.x
        nextTailY = snakeTail.y-1
    }
    // Check SOUTH
    index = coordsToIndex(snakeTail.x, snakeTail.y+1)
    if (grid[index] === CellState.SNAKE) {
        nextTailX = snakeTail.x
        nextTailY = snakeTail.y+1
    }
    // Check WEST
    index = coordsToIndex(snakeTail.x-1, snakeTail.y)
    if (grid[index] === CellState.SNAKE) {
        nextTailX = snakeTail.x-1
        nextTailY = snakeTail.y
    }
    // Check EAST
    index = coordsToIndex(snakeTail.x+1, snakeTail.y)
    if (grid[index] === CellState.SNAKE) {
        nextTailX = snakeTail.x+1
        nextTailY = snakeTail.y
    }

    occupy(snakeTail.x, snakeTail.y, CellState.EMPTY)
    snakeTail.x = nextTailX
    snakeTail.y = nextTailY

    // turn off tail
}

function updateCanvas() {
    updateGrid()
    push()
        drawSnake()
    pop()
    console.log("tick...")
    if (stateChanged) {
        removeMenuButtons()
        if (currentGameState === GameState.MENU) {
            showStartButton()
        }
        if (currentGameState === GameState.GAME) {
            showPauseButton()
            showEndButton()
        }
        if (currentGameState === GameState.PAUSE) {
            showPauseButton()
            showEndButton()
            console.log("Game paused...")
        }
        stateChanged = false
    }
}

function removeMenuButtons() {
    if (startGameButton) {
        startGameButton.remove()
    }

    if (endGameButton) {
        endGameButton.remove()
    }

    if (pauseGameButton) {
        pauseGameButton.remove()
    }
}

function updateStartButton() {
    if (startGameButton) {
        startGameButton.style('left', canvas.position().x + 'px')
        startGameButton.style('top', canvas.position().y + 'px')
    }
}
function updateEndButton() {
    if (endGameButton) {
        endGameButton.style('left', canvas.position().x + 100 + 'px')
        endGameButton.style('top', canvas.position().y + 'px')
    }
}
function updatePauseButton() {
    if (pauseGameButton) {
        pauseGameButton.style('left', canvas.position().x + 50 + 'px')
        pauseGameButton.style('top', canvas.position().y + 'px')
    }
}

function showEndButton() {
    push()
        endGameButton = createButton("End Game")
        endGameButton.style('position', 'absolute');
        updateEndButton()
        endGameButton.mousePressed(() => {
            currentGameState = GameState.MENU
            stateChanged = true
        })
    pop()
}

function showPauseButton() {
    push()
        pauseGameButton = createButton("Pause Game")
        pauseGameButton.style('position', 'absolute');
        updatePauseButton()
        pauseGameButton.mousePressed(() => {
            currentGameState = GameState.PAUSE
            stateChanged = true
        })
    pop()
}

function showStartButton() {
    push()
        startGameButton = createButton("Start Game")
        startGameButton.style('position', 'absolute');
        updateStartButton()
        startGameButton.mousePressed(() => {
            currentGameState = GameState.GAME
            stateChanged = true
        })
    pop()
}