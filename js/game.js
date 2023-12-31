'use strict'

const BOARD_SIZE = 14
const ALIEN_ROW_LENGTH = 8
const ALIEN_ROW_COUNT = 3
const HERO = '🛸'
const ALIEN = '👽'
const LASER = '❗'

const SKY = 'SKY'
const EARTH = 'EARTH'

// Matrix of cell objects. e.g.: {type: SKY, gameObject: ALIEN}

var gBoard
var gGame = {
    isOn: false,
    alienCount: 0
}

// Called when game loads

function init() {
    // later on no start game, only menu
    startGame()
    
}

function startGame() {

    // see if toggle or hide/show fits better
    hideGameOverModal()
    gGame.isOn = true
    gBoard = createBoard(BOARD_SIZE)
    createHero(gBoard)
    gHero.score = 0
    createAliens(gBoard)
    console.table(gBoard)
    renderBoard(gBoard)
    renderScore()
    // start alien interval

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

function gameOver() {
    gGame.isOn = false
    showGameOverModal()
}

function hideGameOverModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.add('hidden')
}
function showGameOverModal() {
    const elModal = document.querySelector('.modal')
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