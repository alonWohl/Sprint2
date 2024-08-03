'use strict'

const FONTS = [
  'arial',
  'times new roman',
  'courier new',
  'verdana',
  'georgia',
  'poppins',
  'impact',
  'trebuchet ms',
  'garamond',
  'tahoma',
  'brush script mt',
]

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

let gMeme = {}
let gCurrFont = 'arial'

function getMeme() {
  return gMeme
}

function getImgs() {
  return gImgs
}

function getFonts() {
  return FONTS
}

function getImgById(imgId) {
  return gImgs.find((img) => img.id === imgId)
}

function getImgByUrl(imgUrl) {
  return gImgs.find((img) => img.url === imgUrl)
}

function getCurrImg() {
  return getImgById(gMeme.selectedImgId)
}

function getCurrLine() {
  const lineIdx = gMeme.selectedLineIdx
  return gMeme.lines[lineIdx]
}

function setSelectedLine(lineIdx) {
  gMeme.selectedLineIdx = lineIdx
}

function setLineTxt(text) {
  if (!gMeme.lines.length) return
  resetSelectedLine()
  const lineIdx = gMeme.selectedLineIdx
  gMeme.lines[lineIdx].txt = text || 'Add Text Here'
}

function setLineFillStyle(color) {
  if (!gMeme.lines.length) return
  resetSelectedLine()
  const lineIdx = gMeme.selectedLineIdx
  gMeme.lines[lineIdx].fillStyle = color
}
function setLineStrokeStyle(color) {
  if (!gMeme.lines.length) return
  resetSelectedLine()
  const lineIdx = gMeme.selectedLineIdx
  gMeme.lines[lineIdx].strokeStyle = color
}

function setLineSize(val) {
  if (!gMeme.lines.length) return
  resetSelectedLine()
  const lineIdx = gMeme.selectedLineIdx
  gMeme.lines[lineIdx].size += val
}

function addLine() {
  const newLine = _createLine(DEFAULT_LINE)
  gMeme.lines.push(newLine)
  gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function removeLine() {
  if (gMeme.selectedLineIdx === -1) return
  gMeme.lines.splice(gMeme.selectedLineIdx, 1)
  gMeme.selectedLineIdx--
}

function setLinePos(dx, dy) {
  const { selectedLineIdx: lineIdx } = gMeme

  gMeme.lines[lineIdx].pos.x += dx
  gMeme.lines[lineIdx].pos.y += dy
}

function setFontFamily(font) {
  gCurrFont = font
  if (!gMeme.lines.length) return
  resetSelectedLine()
  const lineIdx = gMeme.selectedLineIdx
  gMeme.lines[lineIdx].font = font
}

function setLineAlign(align) {
  if (!gMeme.lines.length) return
  resetSelectedLine()
  const selectedLineIdx = gMeme.selectedLineIdx
  gMeme.lines[selectedLineIdx].align = align
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
    font: gCurrFont,
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

function setLineEmpty() {
  gMeme.selectedLineIdx = -1
}
