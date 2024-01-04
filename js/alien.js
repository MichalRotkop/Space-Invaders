'use strict'

var ALIEN_SPEED = 500
var gIntervalAliens
var gIntervalRock
var gIntervalAliensShoot

var gAliensTopRowIdx
var gAliensBottomRowIdx

var gIsAlienFreeze = true
var gIsAlienDirRight = false

function createAliens(board) {
    const startIdx = Math.floor((board.length - ALIEN_ROW_LENGTH) / 2)
    const alienLength = startIdx + ALIEN_ROW_LENGTH

    for (var i = 0; i < ALIEN_ROW_COUNT; i++) {
        for (var j = startIdx; j < alienLength; j++) {
            if (i === 0) board[i][j].gameObject = ALIEN1
            else if (i === 1) board[i][j].gameObject = ALIEN2
            else board[i][j].gameObject = ALIEN3
            gGame.alienCount++
        }
    }
}

function handleAlienHit(pos) {
    updateCell(pos)
    gGame.alienCount--
    gHero.score += 10
    renderScore()
    if (isLastAlienInRow()) gAliensBottomRowIdx--
    if (gGame.alienCount === 0) gameOver()
}

function shiftBoardRight(board, fromI, toI) {
    if (gIsAlienFreeze) return
    gIsAlienDirRight = true
    for (var i = fromI; i <= toI; i++) {
        for (var j = board[0].length - 1; j >= 0; j--) {

            var leftCellGameObject = (j === 0) ? null : board[i][j - 1].gameObject
            var leftCellPos = { i, j: j - 1 }

            if (leftCellGameObject === LASER) leftCellGameObject = null

            if (board[i][j].gameObject === LASER) {
                if (!leftCellGameObject) continue
                else if (isAlien({ leftCellPos })) {
                    leftCellGameObject = null
                    handleAlienHit({ i, j })
                }
            }
            board[i][j].gameObject = leftCellGameObject

            var curRowLastCellPos = { i, j: gBoard[i].length - 1 }
            if (isAlien(curRowLastCellPos)) {
                clearInterval(gIntervalAliens)
                moveAliens(shiftBoardDown)
            }
        }
    }
}

function isAlien(pos) {
    var res = gBoard[pos.i][pos.j].gameObject === ALIEN1
        || gBoard[pos.i][pos.j].gameObject === ALIEN2
        || gBoard[pos.i][pos.j].gameObject === ALIEN3
    return res
}

function shiftBoardLeft(board, fromI, toI) {
    if (gIsAlienFreeze) return

    gIsAlienDirRight = false
    for (var i = fromI; i <= toI; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var rightCellGameObject = (j === board[0].length - 1) ? null : board[i][j + 1].gameObject
            var rightCellPos = { i, j: j + 1 }
            if (rightCellGameObject === LASER) rightCellGameObject = null

            if (board[i][j].gameObject === LASER) {
                if (!rightCellGameObject) continue
                else if (isAlien(rightCellPos)) {
                    rightCellGameObject = null
                    handleAlienHit({ i, j })
                }
            }
            board[i][j].gameObject = rightCellGameObject

            var curRowFirstCellPos = { i, j: 0 }
            if (isAlien(curRowFirstCellPos)) {
                clearInterval(gIntervalAliens)
                moveAliens(shiftBoardDown)
            }
        }
    }
}

function shiftBoardDown(board, fromI, toI) {
    if (gIsAlienFreeze) return

    clearInterval(gIntervalAliens)
    for (var i = toI + 1; i >= fromI; i--) {
        for (var j = 0; j < board[0].length; j++) {
            var topCellGameObject = (i === 0) ? null : board[i - 1][j].gameObject
            var topCellPos = { i: i - 1, j }
            if (topCellGameObject === LASER) topCellGameObject = null

            if (board[i][j].gameObject === LASER) {
                if (!topCellGameObject) continue
                else if (isAlien(topCellPos)) {
                    topCellGameObject = null
                    handleAlienHit({ i, j })
                }
            }
            board[i][j].gameObject = topCellGameObject

            if (isAlien({ i, j }) && i === board.length - 2) {
                gameOver()
            }
        }
    }
    if (!gGame.isOn) return
    gAliensTopRowIdx++
    gAliensBottomRowIdx++

    var funcName = gIsAlienDirRight ? shiftBoardLeft : shiftBoardRight
    moveAliens(funcName)
}

function isLastAlienInRow() {
    for (var j = 0; j < gBoard[0].length; j++) {
        if (isAlien({ i: gAliensBottomRowIdx, j })) return false
    }
    return true
}

function isAlien(pos) {
    var res = gBoard[pos.i][pos.j].gameObject === ALIEN1
        || gBoard[pos.i][pos.j].gameObject === ALIEN2
        || gBoard[pos.i][pos.j].gameObject === ALIEN3
    return res
}

function moveAliens(func) {
    gIntervalAliens = setInterval(() => {
        func(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
        renderBoard(gBoard)
    }, ALIEN_SPEED)
}

function throwRock() {
    if (!gGame.isOn) return
    var rockPos = getRandomAlienPos()

    gIntervalRock = setInterval(() => {
        if (!rockPos) return
        rockPos.i++
        if (isAlien(rockPos)) return
        if (gBoard[rockPos.i][rockPos.j].gameObject === HERO
            || gBoard[rockPos.i][rockPos.j].gameObject === LASER
            || rockPos.i === (gBoard.length - 2)) {
            clearInterval(gIntervalRock)
            if (gBoard[rockPos.i][rockPos.j].gameObject === HERO) {
                onRockHitsHero()
                if (gHero.lives === 0) {
                    gameOver()
                    return
                }
            }
        }
        blinkWeapon(rockPos, ROCK)
    }, 100)
}

function onRockHitsHero() {
    gHero.lives--
    renderHeroLives()
    gIsAlienFreeze = true
    gGame.isOn = false
    clearInterval(gIntervalAliensShoot)
    if (gHero.lives === 0) {
        return
    }

    setTimeout(() => {
        updateCell(gHero.pos, HERO)
        gGame.isOn = true
        gIsAlienFreeze = false
        gIntervalAliensShoot = setInterval(throwRock, 2000)
    }, 2000)
}

function getRandomAlienPos() {
    var armedAliens = []
    for (var j = 0; j < gBoard[0].length; j++) {
        var currPos = { i: gAliensBottomRowIdx, j }
        if (isAlien(currPos)) {
            armedAliens.push(currPos)
        } else {
            for (var i = gAliensBottomRowIdx - 1; i >= 0; i--) {
                if (isAlien({ i, j })) {
                    armedAliens.push({ i, j })
                    break
                }
            }
        }
    }
    var randIdx = getRandomInt(0, armedAliens.length)
    return armedAliens[randIdx]
}




