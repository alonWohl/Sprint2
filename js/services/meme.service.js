'use strict'

const MEME_STORAGE_KEY = 'MEME'
const IMG_STORAGE_KEY = 'IMAGE'
const EDITED_IMG_STORAGE_KEY = 'EDITED_IMAGES'

const FONTS = [
  'impact',
  'arial',
  'times new roman',
  'courier new',
  'verdana',
  'georgia',
  'poppins',
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
const KEY_WORDS = ['funny', 'cat', 'sad', 'happy', 'akward', 'bad']
const keywordsMap = {
  funny: 20,
  cat: 15,
  sad: 25,
  happy: 13,
  akward: 30,
  bad: 15,
}

const STICKERS = ['😃', '😍', '🤯', '😂', '❤️', '😎', '😡', '🥺', '🤩', '🙃']

let gLinePos = { x: 50, y: 0 }
let gImgs = []
let gMeme = {}
let gCurrFont = 'Impact'

_createImgs()

function getMeme() {
  return gMeme
}

function getImgs(filter) {
  if (filter)
    return gImgs.filter((img) =>
      img.keywords.some((keyword) =>
        keyword.toLowerCase().includes(filter.toLowerCase())
      )
    )
  return gImgs
}

function getFonts() {
  return FONTS
}

function getStickers() {
  return STICKERS
}

function getKeyWordsMap() {
  return keywordsMap
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

function addEmoji(txt) {
  const newEmoji = _createLine({ txt })
  gMeme.lines.push(newEmoji)
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
  txt,
  size = 40,
  align = 'left',
  strokeStyle = '#000000',
  fillStyle = '#ffffff',
} = {}) {
  gLinePos.x += 10
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

function _createImgs() {
  for (let i = 1; i < 19; i++) {
    const img = _createImg(i)
    gImgs.push(img)
  }
}

function _createImg(i) {
  return {
    id: i,
    url: `img/${i}.jpg`,
    keywords: getRandomKeyWords(KEY_WORDS),
  }
}

function switchLine() {
  gMeme.selectedLineIdx = (gMeme.selectedLineIdx + 1) % gMeme.lines.length
}

function setMeme(img) {
  let lines
  lines = [_createLine(DEFAULT_LINE)]

  let memeImg = getImgByUrl(img.getAttribute('src'))

  gLinePos = { x: 50, y: 0 }
  gMeme = {
    selectedImgId: memeImg.id,
    selectedLineIdx: 0,
    lines,
  }
}

function loadMeme(meme) {
  gMeme = {
    selectedImgId: meme.selectedImgId,
    selectedLineIdx: meme.selectedLineIdx,
    lines: structuredClone(meme.lines),
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

function getRandomKeyWords(keywords) {
  const copyArray = [...keywords]

  const numberOfWords = getRandomInt(1, keywords.length)
  const randomWords = []

  for (let i = 0; i < numberOfWords; i++) {
    if (copyArray.length === 0) break

    const randomIndex = getRandomIndex(copyArray)
    randomWords.push(copyArray.splice(randomIndex, 1)[0])
  }

  return randomWords
}

function updateKeyWordMap(keyword, count) {
  keywordsMap[keyword] = count
}

function saveMeme(meme, img, annotatedImg) {
  const memes = loadFromStorage(MEME_STORAGE_KEY) || []
  const imgs = loadFromStorage(IMG_STORAGE_KEY) || []
  const editedImgs = loadFromStorage(EDITED_IMG_STORAGE_KEY) || []

  memes.push(meme)
  imgs.push(img)
  editedImgs.push(annotatedImg)

  saveToStorage(MEME_STORAGE_KEY, memes)
  saveToStorage(IMG_STORAGE_KEY, imgs)
  saveToStorage(EDITED_IMG_STORAGE_KEY, editedImgs)
}

function deleteSaved(idx) {
  const memes = loadFromStorage(MEME_STORAGE_KEY) || [];
  const imgs = loadFromStorage(IMG_STORAGE_KEY) || [];
  const editedImgs = loadFromStorage(EDITED_IMG_STORAGE_KEY) || [];

  memes.splice(idx, 1);
  imgs.splice(idx, 1);
  editedImgs.splice(idx, 1);

  saveToStorage(MEME_STORAGE_KEY, memes);
  saveToStorage(IMG_STORAGE_KEY, imgs);
  saveToStorage(EDITED_IMG_STORAGE_KEY, editedImgs);
}

function getLoadedMemes() {
  return loadFromStorage(MEME_STORAGE_KEY) || [];
}

function getLoadedImgs() {
  return loadFromStorage(IMG_STORAGE_KEY) || [];
}

function getloadedEditedImgs() {
  return loadFromStorage(EDITED_IMG_STORAGE_KEY) || [];
}