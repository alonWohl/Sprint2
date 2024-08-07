'use strict'

function onSavedInit() {
  document.body.classList.remove('menu-open');
  document.querySelector('.saved-memes-page').classList.remove('hidden')
  document.querySelector('.meme-gallery-page').classList.add('hidden')
  document.querySelector('.editor-page').classList.add('hidden')
  document.querySelector('.gallery-btn').classList.remove('hidden')
  document.querySelector('.filter-section').classList.remove('hidden')
  document.querySelector('.saved-btn').classList.add('hidden')

  renderSaved()
}

function renderSaved() {
  const loadedImgs = getLoadedImgs()
  const loadEditedImgs = getloadedEditedImgs()
  const savedItemsHTML = loadEditedImgs
    .map(
      (img, index) =>
        `<article class="meme-list-image">
            <img src="${img}" alt="${loadedImgs[index].keywords[0]} meme" 
            data-index="${index}" onclick="onLoadFromSaved(this)" />
            <button data-index="${index}" class="delete-saved-button" onclick="onDeleteSaved(this)">Delete</button>
        </article>`
    )
    .join('')

  const savedMemesContainer = document.querySelector('.saved-memes-container')
  savedMemesContainer.innerHTML = savedItemsHTML
}

function onLoadFromSaved(elImg) {
  const loadedMemes = getLoadedMemes()
  const selectedMeme = loadedMemes[elImg.dataset.index]
  loadMeme(selectedMeme)
  openMemeEditor()
}

function onDeleteSaved(elImg) {
  const index = elImg.dataset.index
  deleteSaved(index)
  renderSaved()
}
