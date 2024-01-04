'use strict'

var LASER_SPEED = 80
var gHero
var gIntervalLaser
var gLaserPos = null

function createHero(board) {
    gHero = {
        pos: { i: 12, j: 5 },
        isShoot: false,
        score: 0,
        fasterLaserCount: 3,
        hasFasterLaser: false,
        lives: 3
    }
    board[gHero.pos.i][gHero.pos.j].gameObject = HERO
}

function moveHero(dir) {
    const i = gHero.pos.i
    const j = gHero.pos.j + dir
    if (j < 0 || j > gBoard[0].length - 1) return
    const nextPos = { i, j }
    if (gBoard[nextPos.i][nextPos.j].gameObject === CANDY) {
        gHero.score += 50
        renderScore()
        gIsAlienFreeze = true
        setTimeout(() => gIsAlienFreeze = false, 5000)

    }
    updateCell(gHero.pos)
    gHero.pos.j = nextPos.j
    updateCell(gHero.pos, HERO)
}

function onKeyDown(ev) {
    // console.log('ev:', ev)
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
        case 'KeyN':
            blowUpNegs()
            break;
        case 'KeyX':
            fasterLaser() // show laser Mark
            break;

        // for self testing: 
        // case 'KeyF':
        //     gIsAlienFreeze = true
        //     break;
        // case 'KeyU':
        //     gIsAlienFreeze = false
        //     break;
    }
}

function shoot() {
    if (gHero.isShoot) return
    setLaser()
    var laserPos = { i: gHero.pos.i, j: gHero.pos.j }
    gIntervalLaser = setInterval(() => {
        laserPos.i--
        gHero.isShoot = true
        if (isAlien(laserPos) || laserPos.i === 0 || gBoard[laserPos.i][laserPos.j].gameObject === ROCK) {
            clearInterval(gIntervalLaser)
            gHero.isShoot = false
            if (isAlien(laserPos)) {
                handleAlienHit(laserPos)
            }
            return
        }
        gLaserPos = laserPos
        blinkWeapon(laserPos)
    }, LASER_SPEED)
}

function setLaser() {
    if (gHero.hasFasterLaser) {
        LASER_SPEED = 40
        LASER = '🔥'
        gHero.hasFasterLaser = false
    } else {
        LASER_SPEED = 80
        LASER = '🔷'
    }
}

function fasterLaser() {
    if (gHero.fasterLaserCount === 0) return
    gHero.hasFasterLaser = true
    gHero.fasterLaserCount--
    renderFasterLaserCount()
}

function blinkWeapon(pos, weapon = LASER) {
    updateCell(pos, weapon)
    setTimeout(updateCell, LASER_SPEED - 20, pos)
}

function blowUpNegs() { // show explosion
    if (!gHero.isShoot) return
    for (var i = gLaserPos.i - 1; i <= gLaserPos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length - 1) continue
        for (var j = gLaserPos.j - 1; j <= gLaserPos.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (isAlien({i,j})) {
                handleAlienHit({ i, j })
            }
        }
    }
    clearInterval(gIntervalLaser)
    gHero.isShoot = false
}

function renderHeroLives() {
    const elLives = document.querySelector('.lives')
    elLives.innerHTML = HERO.repeat(gHero.lives)
}
function renderFasterLaserCount() {
    const elSpan = document.querySelector('.fast-laser span')
    elSpan.innerHTML = '🔥'.repeat(gHero.fasterLaserCount)
}
