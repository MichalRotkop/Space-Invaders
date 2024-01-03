'use strict'

const BOARD_SIZE = 14
var ALIEN_ROW_LENGTH = 8
var ALIEN_ROW_COUNT = 3
const HERO = '🛸'
const ALIEN1 = '👾'
const ALIEN2 = '👻'
const ALIEN3 = '👽'


var LASER = '🔷'
var ROCK = '🔶'
const CANDY = '🍬'

const SKY = 'SKY'
const EARTH = 'EARTH'

var gIntervalCandy
var gCandyTimeout

// Matrix of cell objects. e.g.: {type: SKY, gameObject: ALIEN}

var gBoard
var gGame = {
    isOn: false,
    alienCount: 0,
    fasterLaserCount: 3,
}

// Called when game loads

function init() {
    gGame.alienCount = 0
    gGame.fasterLaserCount = 3
    gBoard = createBoard(BOARD_SIZE)
    createHero(gBoard)
    gHero.score = 0
    gAliensTopRowIdx = 0
    gAliensBottomRowIdx = ALIEN_ROW_COUNT - 1
    gIsAlienFreeze = false
    // console.table(gBoard)
    createAliens(gBoard)
    renderBoard(gBoard)
    renderScore()
}

function startGame() {
    init()
    // see if toggle or hide/show fits better
    hideGameOverModal()
    gGame.isOn = true
    moveAliens(shiftBoardRight)
    gIntervalAliensShoot = setInterval(throwRock, getRandomInt(600, 3000))
    gIntervalCandy = setInterval(addCandy, 10000)
}

// Create and returns the board with aliens on top, ground at bottom
// use the functions: createCell, createHero, createAliens

function createBoard(size) {
    const board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = (i === size - 1) ? createCell(EARTH) : createCell()
        }
    }
    return board
}

function setLevel(elBtn) {
    if (elBtn.innerText === 'Easy') {
        ALIEN_ROW_LENGTH = 8
        ALIEN_ROW_COUNT = 3
        ALIEN_SPEED = 500
    } else if (elBtn.innerText === 'Normal') {
        ALIEN_ROW_LENGTH = 8
        ALIEN_ROW_COUNT = 4
        ALIEN_SPEED = 450
    } else {
        ALIEN_ROW_LENGTH = 10
        ALIEN_ROW_COUNT = 5
        ALIEN_SPEED = 400
    }
    init()
}

// Render the board as a <table> to the page
function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var className = currCell.type
            strHTML += `<td class="${className}"
                        data-i="${i}" data-j="${j}">`

            strHTML += (currCell.gameObject) ? `${currCell.gameObject}</td>` : `</td>`
        }
        strHTML += '</tr>'
    }
    const elTbody = document.querySelector('tbody')
    elTbody.innerHTML = strHTML
}

function addCandy() {
    var jRandomIdx = getRandomInt(0, gBoard[0].length)
    while (gHero.pos.j === jRandomIdx) {
        jRandomIdx = getRandomInt(0, gBoard[0].length)
    }
    var candyPos = { i: gBoard.length - 2, j: jRandomIdx }
    updateCell(candyPos, CANDY)
    gCandyTimeout = setTimeout(() => {
        if (gBoard[candyPos.i][candyPos.j].gameObject === HERO) return
        else updateCell(candyPos)
    }, 5000)
}

function gameOver() {
    gGame.isOn = false
    clearInterval(gIntervalAliens)
    clearInterval(gIntervalAliensShoot)
    clearInterval(gIntervalCandy)
    showGameOverModal()

}

function hideGameOverModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.add('hidden')
}
function showGameOverModal() {
    const elModal = document.querySelector('.modal')
    elModal.querySelector('.restart').innerText = 'Restart'
    elModal.querySelector('h2').innerHTML = (gGame.alienCount === 0) ? 'You Win!' : 'You Lost!'
    elModal.classList.remove('hidden')
}

function renderScore() {
    const elScore = document.querySelector('.score')
    elScore.innerHTML = gHero.score
}

// position such as: {i: 2, j: 7}

function updateCell(pos, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject
    var elCell = getElCell(pos)
    elCell.innerHTML = gameObject || ''
}