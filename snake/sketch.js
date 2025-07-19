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