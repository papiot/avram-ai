const GameState = Object.freeze({
    MENU: "menu",
    GAME: "game",
    PAUSE: "pause"
})

const CANVAS_WIDHT = 800
const CANVAS_HEIGHT = 600

let canvas

let startGameButton
let pauseGameButton
let endGameButton

let currentGameState
let stateChanged = true

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

}

function drawGrid() {
    // draw the grid
    push()
        strokeWeight(1)
        color(0,0,0)
        line(0, 40, canvas.width, 40)
        for (let i = 40; i <= 600; i+=10) {
            line(0, i, canvas.width, i)
        }

        for (let i = 0; i <= 800; i += 10) {
            line(i, 40, i, canvas.height)
        }
    pop()
}

function draw() {
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