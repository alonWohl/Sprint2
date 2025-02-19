'use strict'

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']
const CLICK_MARGIN = 10

let gElCanvas
let gCtx
let gElImg
let gStartPos = {}
let slideIndex


let gIsListenersAdded = false,
  gIsMouseDown = false,
  gIsRotate = false,
  gIsDrag = false

function openEditor() {
  document.body.classList.remove('menu-open')
  document.querySelector('.gallery-btn').classList.remove('hidden')
  document.querySelector('.filter-section').classList.add('hidden')

  document.querySelector('.meme-gallery-page').classList.add('hidden')
  document.querySelector('.saved-memes-page').classList.add('hidden')
  document.querySelector('.editor-page').classList.remove('hidden')

  gElImg = null
  gElCanvas = document.querySelector('canvas')
  gCtx = gElCanvas.getContext('2d')
  gCtx.lineWidth = '3'
  slideIndex = 0

  renderFonts()
  renderStickers()
  renderMeme()
  resetInputs()

  if (!gIsListenersAdded) addCanvasEventListeners()
  onResizeCanvas()
}

function addCanvasEventListeners() {
  window.addEventListener('resize',onResizeCanvas)
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
  gElCanvas.height =
    (gElImg.naturalHeight / gElImg.naturalWidth) * gElCanvas.width
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

  if (clickedLineIdx === -1) {
    setLineEmpty()
    renderMeme()
    return
  }

  ev.preventDefault()
  onSetSelectedLine(clickedLineIdx)
  renderMeme()

  gIsDrag = true
  gStartPos = { x: pos.x, y: pos.y }
}

function onMove(ev) {
  if (!gIsMouseDown || !gIsDrag) return

  const pos = getEvPos(ev)
  const dx = pos.x - gStartPos.x
  const dy = pos.y - gStartPos.y

  gStartPos = { x: pos.x, y: pos.y }
  setLinePos(dx, dy)
  renderMeme()
}

function onUp() {
  gIsDrag = false
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

  const textWidth = gCtx.measureText(line.txt).width
  if (line.align === 'center') {
    x -= textWidth / 2
  } else if (line.align === 'right') {
    x -= textWidth
  }

  x -= CLICK_MARGIN
  gCtx.font = `${line.size}px ${line.font}`
  gCtx.beginPath()
  gCtx.rect(x, y, textWidth + CLICK_MARGIN * 2, line.size + CLICK_MARGIN)
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
  const elTextInput = document.querySelector('.meme-text-input')
  elTextInput.value = ''
  elTextInput.focus()
  addLine()
  renderMeme()
}

function onRemoveLine() {
  const elTextInput = document.querySelector('.meme-text-input')
  elTextInput.value = ''
  removeLine()
  renderMeme()
}

function onChangeFontSize(val) {
  setLineSize(val)
  renderMeme()
}

function updateEditorInputs() {
  const meme = getMeme()
  const currLine = meme.lines[meme.selectedLineIdx] || {}

  const elTextInput = document.querySelector('.meme-text-input')
  const elStrokePicker = document.querySelector('#strokePicker')
  const elFillPicker = document.querySelector('#fillPicker')


  elTextInput.value = currLine.txt || ''
  elStrokePicker.value = currLine.strokeStyle || '#000000'
  elFillPicker.value = currLine.fillStyle || '#FFFFFF'
  
}

function downloadImg(elLink) {
  setLineEmpty()
  renderMeme()
  const imgContent = gElCanvas.toDataURL('image/jpeg')
  elLink.href = imgContent
}

function resetInputs() {
  const elTextInput = document.querySelector('.meme-text-input')
  elTextInput.value = ''
  updateEditorInputs()
}

function renderFonts() {
  const fonts = getFonts()
  const elFontSelect = document.querySelector('#fontFamily')

  const options = fonts
    .map(
      (font) => `<option value"${font}">${font.toLocaleUpperCase()}</option>`
    )
    .join('')
  elFontSelect.innerHTML = options
}

function onSetFontFamily(font) {
  setFontFamily(font.value)
  renderMeme()
}
function onSetLineAlign(alignment) {
  setLineAlign(alignment)
  renderMeme()
}

function onResizeCanvas() {
  const elContainer = document.querySelector('.meme-canvas')
  gElCanvas.width = Math.min(elContainer.clientWidth - 10,500)
  renderMeme()
}

function renderStickers() {
  const elStickerContainer = document.querySelector('.stickers-slideshow')
  const stickers = getStickers()

  let stickersHtml = stickers
    .map(
      (sticker) =>
        `<div class="sticker">
     <div class="emoji" onclick="onAddEmoji(this)">${sticker}</div>
     </div>`
    )
    .join('')
  elStickerContainer.innerHTML = stickersHtml
}

function plusSlides(n) {
  showSlides((slideIndex += n))
}
function showSlides(n) {
  let slides = document.querySelectorAll('.sticker')
  if (n > slides.length - 3) {
    slideIndex = 0
  }
  if (n < 0) {
    slideIndex = slides.length - 3
  }
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.transform = `translateX(-${slideIndex * 33.33}%)`
  }
}

function onAddEmoji(sticker) {
  const emoji = sticker.innerText
  addEmoji(emoji)
  renderMeme()
}

function onSaveMeme() {
  setLineEmpty()
  renderMeme()

  const meme = getMeme()
  const currImg = getCurrImg()
  const imgData = gElCanvas.toDataURL('image/jpeg')
  saveMeme(meme, currImg, imgData)

  const savedModal = document.querySelector('.save-confirmation-modal')
  savedModal.classList.add('shown')

  setTimeout(() => {
    savedModal.classList.remove('shown')
  }, 2000)
}

function onShareMeme() {
  setLineEmpty()
  renderMeme()

  const imgData = gElCanvas.toDataURL('image/jpeg')
  const blob = dataURItoBlob(imgData)
  const file = new File([blob], 'meme.jpg', { type: 'image/jpeg' })

  if (navigator.share) {
    navigator
      .share({
        title: 'Check out this meme!',
        text: 'I made this meme, check it out!',
        files: [file],
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error))
  } else {
    // Fallback for unsupported browsers
    const shareUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = shareUrl
    link.download = 'meme.jpg'
    link.click()
    URL.revokeObjectURL(shareUrl)
    alert(
      'Web Share API is not supported in your browser. The meme has been downloaded instead.'
    )
  }
}

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1])
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mimeString })
}
