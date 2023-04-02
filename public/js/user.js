// 創建formData, 為了之後POST時的資料
const formData = new FormData()

const editUserBtn = document.querySelector('.edit-user-btn')
const formSubmit = document.querySelector('.form-submit')
const editModalContainer = document.querySelector('.edit-container')
const editModalClose = document.querySelector('.edit-modal-close')
const coverageImage = document.querySelector('.edit-coverage-image')
const avatarImage = document.querySelector('.edit-avatar-image')
// cropper
const avatarModalContainer = document.querySelector('.avatar-cropper-container')
const coverageModalContainer = document.querySelector('.coverage-cropper-container')
const avatarModalClose = document.querySelector('.avatar-modal-close')
const coverageModalClose = document.querySelector('.coverage-modal-close')
const upload_avatar_img = document.querySelector('#upload_avatar_img')
const upload_coverage_img = document.querySelector('#upload_coverage_img')
const modalCoverageDelete = document.querySelector('.modal-coverage-delete')
const cropped_avatar_img = document.querySelector('#croppedAvatar')
const cropped_coverage_img = document.querySelector('#croppedCoverage')
const avatarCropperSubmit = document.querySelector('.avatar-cropper-submit')
const coverageCropperSubmit = document.querySelector('.coverage-cropper-submit')
const avatarimageCropField = document.querySelector('#avatarTailoringImg')
const coverageimageCropField = document.querySelector('#coverageTailoringImg')
const avatarImagePreview = document.querySelector('.avatar-image-preview')
const coverageImagePreview = document.querySelector('.coverage-image-preview')
// 監聽輸入字數
const userName = document.querySelector('.edit-user-name')
const userIntroduction = document.querySelector('.edit-user-introduction')
const nameWord = document.querySelector('.name-word')
const introductionWord = document.querySelector('.introduction-word')
const nameWordWarning = document.querySelector('.name-word-warning')
const introductionWordWarning = document.querySelector('.introduction-word-warning')
userName.addEventListener('input', (event) => {
  const count = event.target.value.trim().length
  if (count > 50) {
    nameWordWarning.innerHTML = `<span style="color:red">字數超過上限</span>`
    userName.classList.add('is-invalid')
  }
  else {
    nameWordWarning.innerHTML = ""
    userName.classList.remove('is-invalid')
  }

  if (count === 0) {
    nameWordWarning.innerHTML = `<span style="color:red">名稱不可為空</span>`
    userName.classList.add('is-null')
  }
  else if (count>0){
    introductionWordWarning.innerHTML = ""
    userName.classList.remove('is-null')
  }

  
  nameWord.innerHTML = count
})
userIntroduction.addEventListener('input', (event) => {
  const count = event.target.value.trim().length
  if (count > 160) {
    introductionWordWarning.innerHTML = `<span style="color:red">字數超過上限</span>`
    userIntroduction.classList.add('is-invalid')
  }
  else {
    introductionWordWarning.innerHTML = ""
    userName.classList.remove('is-invalid')
  }
  introductionWord.innerHTML = count
})




// 點擊"編輯個人資料""
editUserBtn.addEventListener('click', function getUserDataRenderPage() {
  axios.get(`/api/users/${editUserBtn.id}`) //will change to users/id(id will select by DOM)
    .then(function (response) {
      // 1.handle success
      if (response.data) {
        coverageImage.style.backgroundImage = `url('${response.data.coverage}')` || 'none'
        avatarImage.style.backgroundImage = `url('${response.data.avatar}')` || 'none'
        userName.value = `${response.data.name}`
        userIntroduction.value = response.data.introduction !== null ? `${response.data.introduction}` : ""
        document.querySelector('.post-user-edit').action = `/api/users/${response.data.id}`
        nameWord.innerHTML = response.data.name !== null ? response.data.name.trim().length : 0
        introductionWord.innerHTML = response.data.introduction !== null ? response.data.introduction.trim().length : 0
      } else { throw new Error('Data Type Incorrect') }
    })

    .then(function () {
      // 3.always executed
      blockScroll()
      fadeIn(editModalContainer, 'flex')
    })
    .catch(function (error) {
      // 2.handle error
      console.log(error)
    })
})

// 關閉"編輯個人資料""
editModalClose.addEventListener('click', function closeUserData() {
  // 當關閉modal時刪除所有form data
  formData.delete('croppedAvatar')
  formData.delete('croppedCoverage')
  formData.delete('name')
  formData.delete('introduction')
  userName.classList.remove('is-invalid')
  userIntroduction.classList.remove('is-invalid')
  nameWordWarning.innerHTML = ""
  introductionWordWarning.innerHTML = ""
  fadeOut(editModalContainer)
  unblockScroll()
})

// 點擊儲存
formSubmit.addEventListener('click', function sendEditData(event) {
  event.preventDefault() // 防止預設的送出
  // 若字數超出上限，防止表單送出

  if (userName.classList.contains('is-null')) {
    postNotification('red', '名稱不可為空！', 'top')
    shakeModal()
  } else if (userName.classList.contains('is-invalid') || userIntroduction.classList.contains('is-invalid')) {
    postNotification('red', '字數超出上限！', 'top')
    shakeModal()
  } else {
    formData.append('name', document.querySelector("input[name='name']").value)
    formData.append('introduction', document.querySelector("textarea[name='introduction']").value)
    // show form Data
    // for (var pair of formData.entries()) {
    //   console.log(pair[0] + ', ' + pair[1]);
    // }
    axios.post(`/api/users/${editUserBtn.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }) //will change to users/id(id will select by DOM)
      .then(function () {
        // 3.always executed
        formData.delete('croppedAvatar')
        formData.delete('croppedCoverage')
        formData.delete('name')
        formData.delete('introduction')

        fadeOut(editModalContainer)
        setTimeout(function () {
          postNotification('green', '修改成功', 'top');
          setTimeout(function () {
            location.reload(true)
          }, 1300);
        }, 700);

        unblockScroll()
      })
      .catch(function (error) {
        // 2.handle error
        console.log(error)
      })
  }
})

// Cropper.js >> For圖片裁切
// 設定avatar crop物件屬性
const avatarCrop = new Cropper(avatarimageCropField, {
  viewMode: 3,
  aspectRatio: 1,  // 預設比例
  guides: false,   // 裁剪框的虛線(九宮格)
  autoCropArea: 0.5, // 0-1之間的數值，定義自動剪裁區域的大小，預設0.8
  dragMode: 'move', // 拖曳模式 crop(Default,新增裁剪框) / move(移動裁剪框&圖片) / none(無動作)
  cropBoxResizable: true, // 是否有裁剪框調整四邊八點
  movable: true, // 是否允許移動圖片
  zoomable: true, // 是否允許縮放圖片大小
  rotatable: true,   // 是否允許旋轉圖片
  zoomOnWheel: true, // 是否允許通過滑鼠滾輪來縮放圖片
  zoomOnTouch: true, // 是否允許通過觸控移動來縮放圖片
})

// 監聽avatar圖片上傳事件
upload_avatar_img.addEventListener('change', function avatarImageToCropper() {
  formData.delete('croppedAvatar') //每次開啟時刪除原有的form Data值
  let file = this.files[0]
  if (file) {
    let reader = new FileReader()
    // load >> 將傳入的圖檔載入crop物件
    reader.onload = function (e) {
      let imgSrc = e.target.result
      avatarimageCropField.src = imgSrc
      avatarCrop.replace(imgSrc, false)
      // 開啟裁切圖片modal
      fadeIn(avatarModalContainer, 'flex')
    }
    reader.onerror = function () {
      console.log('error')
    }
    reader.readAsDataURL(file)
  }
})

// 關閉avatar crop畫面
avatarModalClose.addEventListener('click', function closeAvatarCropper() {
  fadeOut(avatarModalContainer)
})

// 送出avatar crop
avatarCropperSubmit.addEventListener('click', function submitAvatarCropper() {
  const cvs = avatarCrop.getCroppedCanvas()
  const context = cvs.getContext('2d')
  let base64 = cvs.toDataURL('image/jpeg') //轉為jpeg base64
  // https://stackoverflow.com/questions/20512887/imgur-image-uploading-will-not-work-with-base64-data 在上傳前記得把前綴 replace
  // cvs.toBlob((blob) => {
  //   formData.append('croppedAvatar', blob)
  //   console.log(blob)
  // })
  let img = new Image()
  img.src = base64
  img.onload = function () {
    const imgNewSize = 150
    const imgNewWidth = 300
    const imgNewHeight = 300
    let newImg
    // 使用 canvas 調整圖片寬高
    cvs.width = imgNewWidth
    cvs.height = imgNewHeight
    context.clearRect(0, 0, imgNewWidth, imgNewHeight)
    // 調整圖片尺寸
    context.drawImage(img, 0, 0, imgNewWidth, imgNewHeight)
    let compressRatio = 102
    do {
      compressRatio -= 2
      newImg = cvs.toDataURL("image/jpeg", compressRatio / 100)
    } while (Math.round(0.75 * newImg.length / 1000) > imgNewSize)
    // console.log(newImg)
    // 設定預覽圖片
    avatarImagePreview.style.backgroundImage = `url('${newImg}')`
    // 將dataURL傳入input name="croppedAvatar"
    cropped_avatar_img.value = newImg
    formData.append('croppedAvatar', newImg.replace("data:image/jpeg;base64,", ""))
  }
  fadeOut(avatarModalContainer)
})

// 設定coverage crop物件屬性
const coverageCrop = new Cropper(coverageimageCropField, {
  viewMode: 3,
  aspectRatio: 3.195,  // 預設比例
  guides: false,   // 裁剪框的虛線(九宮格)
  autoCropArea: 1, // 0-1之間的數值，定義自動剪裁區域的大小，預設0.8
  dragMode: 'move', // 拖曳模式 crop(Default,新增裁剪框) / move(移動裁剪框&圖片) / none(無動作)
  cropBoxResizable: true, // 是否有裁剪框調整四邊八點
  movable: true, // 是否允許移動圖片
  zoomable: true, // 是否允許縮放圖片大小
  rotatable: false,   // 是否允許旋轉圖片
  zoomOnWheel: true, // 是否允許通過滑鼠滾輪來縮放圖片
  zoomOnTouch: true, // 是否允許通過觸控移動來縮放圖片
})

// 監聽coverage圖片上傳事件
upload_coverage_img.addEventListener('change', function coverageImageToCropper() {
  formData.delete('croppedCoverage') //每次開啟時刪除原有的form Data值
  let file = this.files[0]
  if (file) {
    let reader = new FileReader()
    // load >> 將傳入的圖檔載入crop物件
    reader.onload = function (e) {
      let imgSrc = e.target.result
      coverageimageCropField.src = imgSrc
      coverageCrop.replace(imgSrc, false)
      // 開啟裁切圖片modal
      fadeIn(coverageModalContainer, 'flex')
    }
    reader.onerror = function () {
      console.log('error')
    }
    reader.readAsDataURL(file)
  }
})

// 關閉coverage crop畫面
coverageModalClose.addEventListener('click', function closeCoverageCropper() {
  fadeOut(coverageModalContainer)
})

// 送出coverage crop
coverageCropperSubmit.addEventListener('click', function submitCoverageCropper() {
  const cvs = coverageCrop.getCroppedCanvas()
  const context = cvs.getContext('2d')
  let base64 = cvs.toDataURL('image/jpeg')
  // cvs.toBlob((blob) => {
  //   formData.append('croppedCoverage', blob)
  // })
  let img = new Image()
  img.src = base64
  img.onload = function () {
    const imgNewSize = 150
    const imgNewWidth = 852
    const imgNewHeight = 267
    let newImg
    // 使用 canvas 調整圖片寬高
    cvs.width = imgNewWidth
    cvs.height = imgNewHeight
    context.clearRect(0, 0, imgNewWidth, imgNewHeight)
    // 調整圖片尺寸
    context.drawImage(img, 0, 0, imgNewWidth, imgNewHeight)
    let compressRatio = 102
    do {
      compressRatio -= 2
      newImg = cvs.toDataURL("image/jpeg", compressRatio / 100)
    } while (Math.round(0.75 * newImg.length / 1000) > imgNewSize)
    // console.log(newImg)
    // 設定預覽圖片
    coverageImagePreview.style.backgroundImage = `url('${newImg}')`
    // 將dataURL傳入input name="croppedAvatar"
    cropped_coverage_img.value = newImg
    formData.append('croppedCoverage', newImg.replace("data:image/jpeg;base64,", ""))
  }
  fadeOut(coverageModalContainer)
})

// 移除上傳的coverage
modalCoverageDelete.addEventListener('click', function removeUploadCoverage() {
  coverageImagePreview.style.backgroundImage = ""
  cropped_coverage_img.value = "" //清除為空；送出資料時若為空，則保留原圖
})


// shake modal
function shakeModal() {
  document.querySelector('.edit-container .cus-modal').classList.add('modal-shake')
  setTimeout(() => {
    document.querySelector('.edit-container .cus-modal').classList.remove('modal-shake')
  }, 300)
}

// fadeIn,...
function fadeIn(element, display, duration = 300) {

  element.style.opacity = element.style.opacity || 0
  element.style.display = display
  element.style.visibility = "visible"

  let opacity = parseFloat(element.style.opacity) || 0
  const timer = setInterval(function () {
    opacity += 20 / duration
    if (opacity >= 1) {
      clearInterval(timer)
      opacity = 1
    }
    element.style.opacity = opacity
    console.log(opacity)
  }, 20)

}

function fadeOut(element, duration = 400) {
  let opacity = 1
  const timer = setInterval(function () {
    opacity -= 20 / duration
    if (opacity <= 0) {
      clearInterval(timer)
      opacity = 0
      element.style.display = "none"
      element.style.visibility = "hidden"
      if (element === editModalContainer) { //若關閉的是主要編輯畫面
        avatarImagePreview.style.backgroundImage = ""
        coverageImagePreview.style.backgroundImage = ""
      }
    }
    element.style.opacity = opacity
  }, 20)
}

function blockScroll() {
  // document.body.style.overflow = 'hidden'
  document.querySelector('.middle').classList.add('modal-open')
}

function unblockScroll() {
  // document.body.style.overflow = null;
  document.querySelector('.middle').classList.remove('modal-open')
}