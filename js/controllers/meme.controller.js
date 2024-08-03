'use strict'

let gElCanvas
let gCtx
let gElImg

function openEditor() {
  const elGallery = document.querySelector('.gallery-container')
  const elEditor = document.querySelector('.editor-container')
  gElCanvas = document.querySelector('canvas')
  gCtx = gElCanvas.getContext('2d')

  gElImg = null
  elGallery.classList.add('hidden')
  elEditor.classList.remove('hidden')

  renderMeme()
  resetInputs()
}

function renderMeme() {
  const meme = getMeme()

  if (!gElImg) {
    const { url } = setImg()
    gElImg = getElImg(url)
    gElImg.onload = () => renderImage(meme)
  } else {
    renderImage(meme)
  }
}

function renderImage(meme) {
  gCtx.drawImage(gElImg, 0, 0, gElCanvas.width, gElCanvas.height)
  drawText(meme.lines)
}

function getElImg(url) {
  const img = new Image()
  img.src = url
  img.alt = 'image'
  return img
}

function drawText(lines) {
  lines.forEach((line) => {
    const { x, y } = line.pos
    gCtx.strokeStyle = line.strokeStyle
    gCtx.fillStyle = line.fillStyle
    gCtx.textAlign = line.align
    gCtx.font = `${line.size}px Arial `

    gCtx.fillText(line.txt, x, y)
    gCtx.strokeText(line.txt, x, y)
  })
}

function onSetLineTxt(text) {
  setLineTxt(text.value)
  renderMeme()
}

function onSetFillColor(color) {
  setLineFillStyle(color.value)
  renderMeme()
}
function onSetStrokeColor(color) {
  setLineStrokeStyle(color.value)
  renderMeme()
}

function onSwitchLine(){
  switchLine()
  updateEditorInputs()
  renderMeme()
}

function onAddLine() {
  const elTextInput = document.querySelector('#memeTxt')
  elTextInput.value =''
  addLine()
  renderMeme()
}


function updateEditorInputs() {
  const meme = getMeme()
  const currLine = meme.lines[meme.selectedLineIdx] || {}

  const elTextInput = document.querySelector('#memeTxt')
  const elStrokePicker = document.querySelector('#strokePicker')
  const elFillPicker = document.querySelector('#fillPicker')

  elTextInput.value = currLine.txt || ''
  elStrokePicker.value = currLine.strokeStyle || '#000000'
  elFillPicker.value = currLine.fillStyle || '#FFFFFF'
}

function onToggleGallery() {
  const elGallery = document.querySelector('.gallery-container')
  const elEditor = document.querySelector('.editor-container')
  gElImg = null

  elGallery.classList.remove('hidden')
  elEditor.classList.add('hidden')
}

function downloadImg(elLink) {
  const imgContent = gElCanvas.toDataURL('image/jpeg')
  elLink.href = imgContent
}


function resetInputs(){
  const elTextInput = document.querySelector('#memeTxt')
  elTextInput.value = ''
  updateEditorInputs()

}