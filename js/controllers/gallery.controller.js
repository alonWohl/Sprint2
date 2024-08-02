'use strict'

function renderGallery() {
  const images = getImgs()
  const elGallery = document.querySelector('.gallery-container')

  let strHtml = images.map(
    ({ id, url, keywords }) => `
  <img src="${url}" 
  alt="${keywords.join(', ')}"
  class="gallery-img" onclick="onImgSelect(${id})">`)

  elGallery.innerHTML = strHtml.join('')
}


function onImgSelect(imgId){
  const elGallery = document.querySelector('.gallery-container')
  const elEditor =document.querySelector('.editor-container')
  
  elGallery.classList.add('hidden')
  elEditor.classList.remove('hidden')

  setImg(imgId)
  renderMeme()   
  
}