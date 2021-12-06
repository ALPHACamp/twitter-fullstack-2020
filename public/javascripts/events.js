const coverInput = document.querySelector('#cover-input')
const coverWrapper = document.querySelector('#cover-wrapper')
const currentCover = document.querySelector('#current-cover')
const deleteCoverBtn = document.querySelector('#delete-cover-btn')


coverInput.addEventListener('change', function showCoverPreview(event) {
  
  if (event.target.files.length !== 0) { 
    const src = URL.createObjectURL(event.target.files[0])
    let previewArea = document.createElement('div')
    previewArea.innerHTML = `
      <img src="${src}" class="cover" id="file-cover-preview">
    `
    // 若是初次選擇檔案，要先隱藏使用者封面，並加上刪除按鈕
    if (!currentCover.classList.contains('hide')) {
      currentCover.classList.add('hide')
      deleteCoverBtn.classList.remove('hide')
    }
    //　若是重複選擇檔案，先把前一個選擇的圖片移除
    if (coverWrapper.children.length > 1) {
      coverWrapper.lastElementChild.remove()
    }
    coverWrapper.appendChild(previewArea)
  }
})


deleteCoverBtn.addEventListener('click', function deleteCoverPreview() {
  coverInput.value =""
  coverWrapper.lastElementChild.remove()
  currentCover.classList.remove('hide')
  deleteCoverBtn.classList.add('hide')
})