const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const DEFAULT_COLOUR = 'rgb(200,0,0)'

const SHOOT_WAIT = 10

canvas.setAttribute("height",`${window.innerHeight}`)
canvas.setAttribute("width",`${window.innerWidth}`)