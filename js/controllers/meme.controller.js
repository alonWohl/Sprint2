'use strict'

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']
const CLICK_MARGIN = 10

let gElCanvas
let gCtx
let gElImg

let gIsListenersAdded = false,
  gIsMouseDown = false,
  gIsRotate = false,
  gIsDrag = false

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

  if (!gIsListenersAdded) addCanvasEventListeners()
}

function addCanvasEventListeners() {
  gElCanvas.addEventListener('mousedown', onDown)
  gElCanvas.addEventListener('mousemove', onMove)
  gElCanvas.addEventListener('mouseup', onUp)
  gElCanvas.addEventListener('touchstart', onDown)
  gElCanvas.addEventListener('touchmove', onMove)
  gElCanvas.addEventListener('touchend', onUp)

  document.addEventListener('mousedown', () => (gIsMouseDown = true))
  document.addEventListener('mouseup', () => (gIsMouseDown = false))
  document.addEventListener('touchstart', () => (gIsMouseDown = true))
  document.addEventListener('touchend', () => (gIsMouseDown = false))

  gIsListenersAdded = true
}

function renderMeme() {
  const meme = getMeme()

  if (!gElImg) {
    const { url } = getCurrImg()
    gElImg = getElImg(url)
    gElImg.onload = () => renderImage(meme)
  } else {
    renderImage(meme)
  }
}

function renderImage(meme) {
  gCtx.drawImage(gElImg, 0, 0, gElCanvas.width, gElCanvas.height)
  drawText(meme.lines)

  const line = getCurrLine()
  if (line) drawFrame(line)
}

function getElImg(url) {
  const img = new Image()
  img.src = url
  img.alt = 'image'
  return img
}

function onDown(ev) {
  const pos = getEvPos(ev)
  const clickedLineIdx = findClickedLineIdx(pos)

  ev.preventDefault()
  onSetSelectedLine(clickedLineIdx)
  renderMeme()
}

function onMove(ev) {
  // console.log("🚀 ~ onMove ~ ev:", ev)
}
function onUp(ev) {
  // console.log("🚀 ~ onUp ~ ev:", ev)
}

function getEvPos(ev) {
  let pos = { x: ev.offsetX, y: ev.offsetY }

  if (TOUCH_EVS.includes(ev.type)) {
    ev = ev.changedTouches[0]
    pos = {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
    }
  }

  return pos
}

function findClickedLineIdx(pos) {
  const meme = getMeme()

  return meme.lines.findIndex((line) => {
    gCtx.save()
    gCtx.font = `${line.size}px ${line.font}`
    const textWidth = gCtx.measureText(line.txt).width

    let { x, y } = line.pos
    let endX = x + textWidth
    let startY = y - line.size

    if (line.align === 'center') {
      x -= textWidth / 2
      endX -= textWidth / 2
    } else if (line.align === 'right') {
      x -= textWidth
      endX -= textWidth
    }

    x -= CLICK_MARGIN
    endX += CLICK_MARGIN
    startY -= CLICK_MARGIN
    y += CLICK_MARGIN

    gCtx.restore()

    return pos.x > x && pos.x < endX && pos.y > startY && pos.y < y
  })
}

function drawFrame(line) {
  gCtx.save()
  gCtx.lineWidth = 3
  gCtx.strokeStyle = 'red'

  let { x, y } = line.pos
  y -= line.size
  if (line.align === 'center') {
    x -= textWidth / 2
  } else if (line.align === 'right') {
    x -= textWidth
  }

  const textWidth = gCtx.measureText(line.txt).width

  gCtx.beginPath()
  gCtx.rect(x, y, textWidth + CLICK_MARGIN *2 , line.size + CLICK_MARGIN)
  gCtx.stroke()
  gCtx.restore()
}

function drawText(lines) {
  lines.forEach((line) => {
    const { x, y } = line.pos
    gCtx.strokeStyle = line.strokeStyle
    gCtx.fillStyle = line.fillStyle
    gCtx.textAlign = line.align
    gCtx.font = `${line.size}px ${line.font} `

    gCtx.fillText(line.txt, x, y)
    gCtx.strokeText(line.txt, x, y)
  })
}

function onSetSelectedLine(lineIdx) {
  setSelectedLine(lineIdx)
  const currLine = getCurrLine()

  if (currLine.txt !== 'Add Text Here') {
    document.querySelector('.meme-text-input').value = currLine.txt
  }

  updateEditorInputs()
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

function onSwitchLine() {
  switchLine()
  updateEditorInputs()
  renderMeme()
}

function onAddLine() {
  const elTextInput = document.querySelector('#memeTxt')
  elTextInput.value = ''
  addLine()
  renderMeme()
}

function onChangeFontSize(val) {
  setLineSize(val)
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

function resetInputs() {
  const elTextInput = document.querySelector('#memeTxt')
  elTextInput.value = ''
  updateEditorInputs()
}
