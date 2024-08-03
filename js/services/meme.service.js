'use strict'

const DEFAULT_LINE = {
  txt: 'Add Text Here',
  size: 40,
  align: 'left',
  strokeStyle: '#000000',
  fillStyle: '#ffffff',
}
let gLinePos = { x: 50, y: 0 }

let gImgs = [
  { id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat'] },
  { id: 2, url: 'img/2.jpg', keywords: ['funny', 'cat'] },
]

let gMeme = {
  // selectedImgId: 1,
  // selectedLineIdx: 0,
  // lines: [{ txt: 'I sometimes eat Falafel', size: 20, color: 'red' }],
}

function getMeme() {
  return gMeme
}

function getImgs() {
  return gImgs
}

function getImgById(imgId) {
  return gImgs.find((img) => img.id === imgId)
}

function getImgByUrl(imgUrl) {
  return gImgs.find((img) => img.url === imgUrl)
}

function setImg() {
  return getImgById(gMeme.selectedImgId)
}

function setLineTxt(text) {
  if (!gMeme.lines.length) return
  resetSelectedLine()
  const lineIdx = gMeme.selectedLineIdx
  gMeme.lines[lineIdx].txt = text || 'Add Text Here'
}

function setLineFillStyle(color) {
  const lineIdx = gMeme.selectedLineIdx
  gMeme.lines[lineIdx].fillStyle = color
}
function setLineStrokeStyle(color) {
  const lineIdx = gMeme.selectedLineIdx
  gMeme.lines[lineIdx].strokeStyle = color
}

function addLine() {
  const newLine = _createLine(DEFAULT_LINE)
  gMeme.lines.push(newLine)
  gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function _createLine({
  txt = 'Add Text Here',
  size = 40,
  align = 'left',
  strokeStyle = '#000000',
  fillStyle = '#ffffff',
} = {}) {
  gLinePos.x += 50
  gLinePos.y += 50
  return {
    txt,
    size,
    // font: gCurrFont,
    align,
    strokeStyle,
    fillStyle,
    pos: { ...gLinePos },
  }
}

function switchLine() {
  gMeme.selectedLineIdx = (gMeme.selectedLineIdx + 1) % gMeme.lines.length
}

function setMeme(img) {
  let lines
  lines = [_createLine(DEFAULT_LINE)]

  let memeImg = getImgByUrl(img.getAttribute('src'))

  gMeme = {
    selectedImgId: memeImg.id,
    selectedLineIdx: 0,
    lines,
  }
}

function resetSelectedLine() {
  if (gMeme.selectedLineIdx === -1) {
    gMeme.selectedLineIdx = 0
  }
}
