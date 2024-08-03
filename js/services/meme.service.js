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

function getCurrImg() {
  return getImgById(gMeme.selectedImgId)
}

function getCurrLine() {
  const {selectedLineIdx} = gMeme
  return  gMeme.lines[selectedLineIdx]
}

function setSelectedLine(lineIdx){
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

function setLineSize(val){
  if (!gMeme.lines.length) return
  const lineIdx = gMeme.selectedLineIdx
  gMeme.lines[lineIdx].size += val 
}

function addLine() {
  const newLine = _createLine(DEFAULT_LINE)
  gMeme.lines.push(newLine)
  gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function setLinePos(dx,dy){
  const {selectedLineIdx : lineIdx} = gMeme

  gMeme.lines[lineIdx].pos.x += dx
  gMeme.lines[lineIdx].pos.y += dy
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
    font: 'Arial',
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
