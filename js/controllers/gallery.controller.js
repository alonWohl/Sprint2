'use strict'

let gGalleryRendered =false

function onInit() {

  if (!gGalleryRendered) renderGallery()
}

function renderGallery() {
  const images = getImgs()
  const elGallery = document.querySelector('.gallery-container')

  let strHtml = images.map(
    ({ id, url, keywords }) => `
  <img src="${url}" 
  alt="${keywords.join(', ')}"
  class="gallery-img" onclick="onImgSelect(this)">`)

  elGallery.innerHTML = strHtml.join('')
  gGalleryRendered = true
}


function onImgSelect(elImg){
  setMeme(elImg)
  openEditor()
  
}