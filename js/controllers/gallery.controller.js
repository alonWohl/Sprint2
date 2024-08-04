'use strict'

let gGalleryRendered = false

function onInit() {
  document.querySelector('.gallery-container').classList.remove('hidden')
  document.querySelector('.filter-section').classList.remove('hidden')
  document.querySelector('.gallery-btn').classList.add('hidden')
  document.querySelector('.editor-page').classList.add('hidden')


  if (!gGalleryRendered) renderGallery()
  renderKeywordsSize()
}

function renderGallery(filter) {
  const images = getImgs(filter)
  const elGallery = document.querySelector('.gallery-container')

  let strHtml = images.map(
    ({ id, url, keywords }) => `
  <img src="${url}" 
  alt="${keywords.join(', ')}"
  class="gallery-img" onclick="onImgSelect(this)">`
  )

  elGallery.innerHTML = strHtml.join('')
  gGalleryRendered = true
}

function onImgSelect(elImg) {
  setMeme(elImg)
  openEditor()
}

function updateKeyWordSize(keyword) {
  const keywordMap = getKeyWordsMap()
  if (keywordMap[keyword] !== undefined) {
    updateKeyWordMap(keyword, keywordMap[keyword] + 1)
  } else {
    updateKeyWordMap(keyword, 1)
  }
  renderKeywordsSize()
}

function renderKeywordsSize() {
  const keywordMap = getKeyWordsMap()
  const elKeywordsBtns = document.querySelectorAll(
    '.key-words-container button'
  )
  elKeywordsBtns.forEach((button) => {
    const keyword = button.innerText.toLowerCase()
    button.style.fontSize = keywordMap[keyword] * 0.05 + 'em'
  })
}

function onClickedKeyword(keyword) {
  const elSearchInput = document.querySelector('.search-meme')
  elSearchInput.value = keyword
  onSearchMeme(keyword)
}
function onSearchMeme(keyword) {
  renderGallery(keyword)
  updateKeyWordSize(keyword)
}
