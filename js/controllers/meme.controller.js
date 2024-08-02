'use strict'

let gElCanvas
let gCtx

function onInit() {
  gElCanvas = document.querySelector('canvas')
  gCtx = gElCanvas.getContext('2d')
  renderMeme()
  renderGallery()
}

function renderMeme() {
  let { selectedImgId: imgId, lines } = getMeme()
  let img = new Image()
  img.src = `/img/${imgId}.jpg`

  img.onload = function () {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)

    lines.forEach(({txt,size,color}) => {
      gCtx.font = `${size}px Arial`
      gCtx.textAlign = 'center'
      gCtx.fillStyle = `${color}`

      gCtx.fillText(txt, gElCanvas.width / 2, 100)
      gCtx.strokeText(txt, gElCanvas.width / 2, 100)
    })
  }
}


function setLineTxt(text){
  let {selectedLineIdx,lines} = getMeme()
  lines[selectedLineIdx].txt =text
  renderMeme()
}


function setLineColor(color){
  let {selectedLineIdx,lines} = getMeme()
  lines[selectedLineIdx].color = color
  renderMeme()
}

function onToggleGallery(){
  const elGallery = document.querySelector('.gallery-container')
  const elEditor = document.querySelector('.editor-container')

  elGallery.classList.remove('hidden')
  elEditor.classList.add('hidden')
}

function downloadImg(elLink) {
  const imgContent = gElCanvas.toDataURL('image/jpeg') 
  elLink.href = imgContent
}

