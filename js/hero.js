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
        isShieldOn: false,
        shieldCount: 3,
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
            fasterLaser()
            break;
        case 'KeyZ':
            shieldHero()
            break;
    }
}

function shoot() {
    if (gHero.isShoot) return
    setLaser()
    var laserPos = { i: gHero.pos.i, j: gHero.pos.j }
    gIntervalLaser = setInterval(() => {
        laserPos.i--
        gHero.isShoot = true
        if (isAlien(laserPos) || laserPos.i === 0 ||
            gBoard[laserPos.i][laserPos.j].gameObject === ROCK ||
            gBoard[laserPos.i][laserPos.j].type === BUNKER) {
            clearInterval(gIntervalLaser)
            gHero.isShoot = false
            if (isAlien(laserPos)) {
                handleAlienHit(laserPos)
            } else if (gBoard[laserPos.i][laserPos.j].type === BUNKER) {
                handleBunkerHit(laserPos)
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
        LASER = '<img src="img/fast_laser.png">'
        gHero.hasFasterLaser = false
    } else {
        LASER_SPEED = 80
        LASER = '<img src="img/laser.png">'
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

function blowUpNegs() {
    if (!gHero.isShoot) return
    renderCellExplosion(gLaserPos, EXPLOSION1)
    for (var i = gLaserPos.i - 1; i <= gLaserPos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length - 1) continue
        for (var j = gLaserPos.j - 1; j <= gLaserPos.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (isAlien({ i, j })) {
                handleAlienHit({ i, j })
                renderCellExplosion({ i, j }, EXPLOSION2)
            }
        }
    }
    clearInterval(gIntervalLaser)
    gHero.isShoot = false
}

function shieldHero() {
    if (gHero.isShieldOn || gHero.shieldCount === 0) return
    gHero.isShieldOn = true
    HERO = '<img src="img/shield2.png">'
    updateCell(gHero.pos, HERO)
    gHero.shieldCount--
    renderShieldsCount()

    setTimeout(() => {
        gHero.isShieldOn = false
        HERO = '<img src="img/hero3.png">'
        updateCell(gHero.pos, HERO)
    }, 5000)
}

function renderCellExplosion(pos, explosion) {
    var elCell = getElCell(pos)
    elCell.innerHTML = explosion
    setTimeout(() => elCell.innerHTML = null, 4000)
}

function renderHeroLives() {
    const elLives = document.querySelector('.lives')
    elLives.innerHTML = HERO.repeat(gHero.lives)
}

function renderFasterLaserCount() {
    const elSpan = document.querySelector('.fast-laser span')
    elSpan.innerHTML = '🔥'.repeat(gHero.fasterLaserCount)
}

function renderShieldsCount() {
    const elSpan = document.querySelector('.shield span')
    elSpan.innerHTML = '🛡️'.repeat(gHero.shieldCount)
}
