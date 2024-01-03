'use strict'

// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}

function createCell(type = SKY, gameObject = null) {
    return {
        type: type,
        gameObject: gameObject,
    }
}

function getElCell(pos) {
    return document.querySelector(`[data-i='${pos.i}'][data-j='${pos.j}']`)
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}