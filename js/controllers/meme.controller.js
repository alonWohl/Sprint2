'use strict'

let gElCanvas
let gCtx

function onInit() {
  gElCanvas = document.querySelector('canvas')
  gCtx = gElCanvas.getContext('2d')
  renderMeme()
}

function renderMeme() {
  let img = new Image()
  img.src = `/img/1.jpg`

  img.onload = function () {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)

    gCtx.font = '50px Arial'
    gCtx.textAlign = 'center'
    gCtx.fillStyle = 'white'

    let txt = 'hello world'
    
    gCtx.fillText(txt, gElCanvas.width/2 ,100 )
    gCtx.strokeText(txt, gElCanvas.width/2 ,100 )
}


}
