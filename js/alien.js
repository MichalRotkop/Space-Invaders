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
        for (var j = board[0].length - 1; j >= 0; j--) {
            var LeftCellGameObject = (j === 0) ? null : board[i][j - 1].gameObject
            if (LeftCellGameObject === LASER) LeftCellGameObject = null

            if (board[i][j].gameObject === LASER) {
                if (!LeftCellGameObject) continue
                else if (LeftCellGameObject === ALIEN) {
                    LeftCellGameObject = null
                    handleAlienHit({ i, j })
                }
            }
            board[i][j].gameObject = LeftCellGameObject
        }
    }
}

function shiftBoardLeft(board, fromI, toI) {
    for (var i = fromI; i <= toI; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var rightCellGameObject = (j === board[0].length - 1) ? null : board[i][j + 1].gameObject
            if (rightCellGameObject === LASER) rightCellGameObject = null

            if (board[i][j].gameObject === LASER) {
                if (!rightCellGameObject) continue // ?
                else if (rightCellGameObject === ALIEN) {
                    rightCellGameObject = null
                    handleAlienHit({ i, j })
                }
            }
            board[i][j].gameObject = rightCellGameObject
        }
    }
}

function shiftBoardDown(board, fromI, toI) {
    for (var i = toI + 1; i >= fromI; i--) {
        for (var j = 0; j < board[0].length; j++) {
            var topCellGameObject = (i === 0) ? null : board[i - 1][j].gameObject
            if (topCellGameObject === LASER) topCellGameObject = null

            if (board[i][j].gameObject === LASER) {
                if (!topCellGameObject) continue
                else if (topCellGameObject === ALIEN) {
                    topCellGameObject = null
                    handleAlienHit({ i, j })
                }
            }
            board[i][j].gameObject = topCellGameObject
        }
    }
    gAliensTopRowIdx++
    gAliensBottomRowIdx++
}

function isLastAlienInRow() {

}

// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops

function moveAliens() {
    // still in progress

    for (var i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
        var curRowLastCell = gBoard[i][gBoard[i].length - 1]
        if (curRowLastCell.gameObject === ALIEN) clearInterval(rightInterval)
        var rightInterval = setInterval(() => {
            shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
            renderBoard(gBoard)
        }, ALIEN_SPEED)
    }

    // shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
    // shiftBoardLeft(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)

}