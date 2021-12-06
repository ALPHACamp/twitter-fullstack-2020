const coverInput = document.querySelector('#cover-input')
const coverWrapper = document.querySelector('#cover-wrapper')
const currentCover = document.querySelector('#current-cover')
const deleteCoverBtn = document.querySelector('#delete-cover-btn')


coverInput.addEventListener('change', (event) => {
  
  if (event.target.files.length !== 0) { 
    const src = URL.createObjectURL(event.target.files[0])
    let previewArea = document.createElement('div')
    previewArea.innerHTML = `
      <img src="${src}" class="cover" id="file-cover-preview">
    `
    if (!currentCover.classList.contains('hide')) {
      currentCover.classList.add('hide')
      deleteCoverBtn.classList.remove('hide')
    }
    if (coverWrapper.children.length > 1) {
      coverWrapper.lastElementChild.remove()
    }
    coverWrapper.appendChild(previewArea)
  }
})


deleteCoverBtn.addEventListener('click', (event) => {
  coverWrapper.lastElementChild.remove()
  currentCover.classList.remove('hide')
  deleteCoverBtn.classList.add('hide')
})