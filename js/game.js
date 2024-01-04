'use strict'

const BOARD_SIZE = 14
var ALIEN_ROW_LENGTH = 8
var ALIEN_ROW_COUNT = 3

const HERO = '<img src="img/hero.png">'
const ALIEN1 = '<img src="img/alien1.png">'
const ALIEN2 = '<img src="img/alien2.png">'
const ALIEN3 = '<img src="img/alien3.png">'

const SKY = 'SKY'
const EARTH = 'EARTH'

var LASER = '🔷'
var ROCK = '🔶'
const CANDY = '🍬'

var gIntervalCandy
var gCandyTimeout

var gBoard
var gGame = {
    isOn: false,
    alienCount: 0,
}

function init() {
    gGame.alienCount = 0
    gBoard = createBoard(BOARD_SIZE)
    createHero(gBoard)
    gHero.fasterLaserCount = 3
    gHero.score = 0
    gHero.lives = 3
    gHero.fasterLaserCount = 3
    gAliensTopRowIdx = 0
    gAliensBottomRowIdx = ALIEN_ROW_COUNT - 1
    gIsAlienFreeze = true
    createAliens(gBoard)
    renderBoard(gBoard)
    renderScore()
    renderFasterLaserCount()
    renderHeroLives()
}

function startGame() {
    init()
    hideGameOverModal()
    gGame.isOn = true
    gIsAlienFreeze = false
    moveAliens(shiftBoardRight)
    gIntervalAliensShoot = setInterval(throwRock,2000)
    gIntervalCandy = setInterval(addCandy, 10000)
}

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
    cleanLevelBtnsColor()
    elBtn.classList.add('chosen')
    elBtn.style.backgroundColor = '#814f78'
    init()
}

function cleanLevelBtnsColor() {
    var elBtns = document.querySelectorAll('.levels button')
    for (var i = 0; i < elBtns.length; i++) {
        elBtns[i].style.backgroundColor = '#9cc9c5'
    }
}

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
    clearInterval(gIntervalRock)
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

function updateCell(pos, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject
    var elCell = getElCell(pos)
    elCell.innerHTML = gameObject || ''
}