'use strict'

const LASER_SPEED = 80

var gHero
var gIntervalLaser

// creates the hero and place it on board
function createHero(board) {
    gHero = {
        pos: { i: 12, j: 5 },
        isShoot: false,
        score: 0
    }
    board[gHero.pos.i][gHero.pos.j].gameObject = HERO
}

// Move the hero right (1) or left (-1)
function moveHero(dir) {
    const i = gHero.pos.i
    const j = gHero.pos.j + dir
    if (j < 0 || j > gBoard[0].length - 1) return
    const nextPos = { i, j }
    updateCell(gHero.pos)
    gHero.pos.j = nextPos.j
    updateCell(gHero.pos, HERO)
}

// Handle game keys
function onKeyDown(ev) {
    console.log('ev:',ev)
    if (!gGame.isOn) return

    switch (ev.code) {
        case 'ArrowLeft':
            moveHero(-1)
            break;
        case 'ArrowRight':
            moveHero(1)
            break;
        case 'Space':
            shoot()
            break;

            // for self testing: 

            // case 'ShiftRight':
            //     console.log('pressed ShiftRight:')
            //     shiftBoardRight(gBoard, 0, 2)
            //     renderBoard(gBoard)
            //     break;
            // case 'Enter':
            //     console.log('pressed Enter:')
        //     shiftBoardLeft(gBoard, 0, 2)
        //     renderBoard(gBoard)
        //     break;
        // case 'ShiftLeft':
        //     console.log('pressed shitLeft:')
        //     shiftBoardDown(gBoard, 0, 2)
        //     renderBoard(gBoard)
        //     break;
        case 'Enter':
            moveAliens()
            break;
    }
}

// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot() {
    if (gHero.isShoot) return
    var laserPos = { i: gHero.pos.i - 1, j: gHero.pos.j }
    gIntervalLaser = setInterval(() => {
        gHero.isShoot = true
        laserPos.i--
        const isAlienHit = gBoard[laserPos.i][laserPos.j].gameObject === ALIEN
        if (isAlienHit || laserPos.i === 0 ) {
            clearInterval(gIntervalLaser)
            gHero.isShoot = false
            if (isAlienHit) {
                handleAlienHit(laserPos)
                return
            } 
        }
        blinkLaser(laserPos)
    }, 100)
}

// renders a LASER at specific cell for short time and removes it
function blinkLaser(pos) {
    updateCell(pos, LASER)
    setTimeout(updateCell, LASER_SPEED, pos)
}
