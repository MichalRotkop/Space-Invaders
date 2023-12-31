'use strict'

const ALIEN_SPEED = 500
var gIntervalAliens

// The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row
var gAliensTopRowIdx
var gAliensBottomRowIdx

var gIsAlienFreeze = true

function createAliens(board) {
    const startIdx = Math.floor((board.length - ALIEN_ROW_LENGTH) / 2)
    const alienLength = startIdx + ALIEN_ROW_LENGTH

    for (var i = 0; i < ALIEN_ROW_COUNT; i++) {
        for (var j = startIdx; j < alienLength; j++) {
            board[i][j].gameObject = ALIEN
            gGame.alienCount++
        }
    }
    board[0][13].gameObject = ALIEN
    board[0][0].gameObject = ALIEN
}

function handleAlienHit(pos) {
    updateCell(pos)
    gGame.alienCount--
    gHero.score += 10
    renderScore()
    if (gGame.alienCount === 0) gameOver()
}

function shiftBoardRight(board, fromI, toI) {
    for (var i = fromI; i <= toI; i++) {
        for (var j = board[0].length - 2; j >= 0; j--) {
            if (board[i][j].gameObject === LASER) {
                board[i][j].gameObject = null
                if (board[i][j - 1].gameObject === ALIEN) handleAlienHit({ i, j })
            }
            board[i][j + 1].gameObject = board[i][j].gameObject
            board[i][j].gameObject = (j === 0) ? null : board[i][j - 1].gameObject
        }
    }
}

function shiftBoardLeft(board, fromI, toI) {
    for (var i = fromI; i <= toI; i++) {
        for (var j = 1; j < board[0].length; j++) {
            if (board[i][j].gameObject === LASER) {
                board[i][j].gameObject = null
                if (board[i][j + 1].gameObject === ALIEN) handleAlienHit({ i, j })
            }
            board[i][j - 1].gameObject = board[i][j].gameObject
            board[i][j].gameObject = (j === gBoard[0].length - 1) ? null : board[i][j + 1].gameObject
        }
    }
}

function shiftBoardDown(board, fromI, toI) { // 0, 2
    for (var i = toI; i >= fromI; i--) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i + 1][j].gameObject === LASER) {
                board[i][j].gameObject = null
                // if (board[i][j].gameObject === ALIEN) handleAlienHit({ i, j })

            }
            board[i + 1][j].gameObject = board[i][j].gameObject
            board[i][j].gameObject = (i === 0) ? null : board[i - 1][j].gameObject
        }
    }
}

// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops

function moveAliens() {

}