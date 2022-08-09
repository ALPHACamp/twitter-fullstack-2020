const editUser = document.querySelector('#edit-user')
const saveUser = document.querySelector('#user-modal-save')

function showEditUserModal (data) {
  const modalForm = document.querySelector('#user-modal-form')
  const modalBanner = document.querySelector('#user-modal-banner')
  const modalAvatar = document.querySelector('#user-modal-avatar')
  const modalBody = document.querySelector('#user-modal-body')

  modalForm.action = `/api/users/${data.id}`
  modalBanner.style.background = `linear-gradient(0deg, rgba(23, 23, 37, 0.5), rgba(23, 23, 37, 0.5)), url(${data.banner})`
  modalAvatar.style.background = `linear-gradient(0deg, rgba(23, 23, 37, 0.5), rgba(23, 23, 37, 0.5)), url(${data.avatar})`
  modalBanner.style.backgroundSize = 'cover'
  modalAvatar.style.backgroundSize = 'cover'
  saveUser.dataset.id = data.id

  modalBody.innerHTML = `
    <div>
      <div class="form-floating">
        <input type="text" class="form-control input" id="modal-input-name" name="name" value="${data.name}" oninput="countWord(this)" maxlength="50">
        <label for="modal-input-name">名稱</label>
      </div>
      <div class="d-flex justify-content-end word-count">
        <span id="name-count">${data.name.length}</span>
        <span>/50</span>
      </div>
    </div>
    <div>
      <div class="form-floating">
        <textarea class="form-control input" style="height: 147px; resize: none;" id="modal-input-introduction"
          name="introduction" oninput="countWord(this)" maxlength="160">${data.introduction || ''}</textarea>
        <label for="modal-input-introduction">自我介紹</label>
      </div>
      <div class="d-flex justify-content-end word-count">
        <span id="introduction-count">${data.introduction?.length || 0}</span>
        <span>/160</span>
      </div>
    </div>
  `
}

function changeUser (user) {
  const banner = document.querySelector('.user-card .user-banner')
  const avatars = document.querySelectorAll('.user-avatar')
  const names = document.querySelectorAll('.user-name')
  const introduction = document.querySelector('.user-card .user-introduction')

  banner.src = user.banner || '/images/user-defaultBanner.png'
  avatars.forEach(avatar => {
    avatar.src = user.avatar
  })
  names.forEach(name => {
    name.innerHTML = user.name
  })
  introduction.innerHTML = user.introduction
}

function errorMessage (message) {
  const messages = document.querySelector('.messages')
  messages.innerHTML = `
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `
}

function countWord (data) {
  document.querySelector(`#${data.id}`)
    .parentElement
    .nextElementSibling
    .children[0].innerHTML = String(data.value.length)
}

function previewImage (data) {
  document.querySelector(`#${data.id}`)
    .parentElement
    .style.background = `linear-gradient(0deg, rgba(23, 23, 37, 0.5), rgba(23, 23, 37, 0.5)), url(${window.URL.createObjectURL(data.files[0])})`
}

function removeBanner () {
  const banner = document.querySelector('#banner')
  const removeChecked = document.querySelector('#remove-checked')

  banner.value = '' // 移除banner的file
  banner.parentElement.style.background = 'linear-gradient(0deg, rgba(23, 23, 37, 0.5), rgba(23, 23, 37, 0.5)), url("/images/user-defaultBanner.png")'
  removeChecked.checked = 'on'
}

editUser?.addEventListener('click', event => {
  axios(`/api/users/${event.target.dataset.id}`)
    .then(res => {
      if (res.data.status === 'error') {
        return errorMessage(res.data.message)
      }
      showEditUserModal(res.data)
    })
})

saveUser.addEventListener('click', event => {
  const banner = document.querySelector('#edit-user-modal #banner')
  const avatar = document.querySelector('#edit-user-modal #avatar')
  const name = document.querySelector('#edit-user-modal #modal-input-name')
  const introduction = document.querySelector('#edit-user-modal #modal-input-introduction')
  const removeChecked = document.querySelector('#remove-checked')

  const data = new FormData()
  data.append('banner', banner.files[0])
  data.append('avatar', avatar.files[0])
  data.append('name', name.value)
  data.append('introduction', introduction.value)
  if (removeChecked.value === 'on') {
    data.append('removeChecked', removeChecked.value)
  }

  axios
    .post(`/api/users/${event.target.dataset.id}`, data)
    .then(res => {
      if (res.data.status === 'error') {
        return errorMessage(res.data.message)
      }
      changeUser(res.data.user)
    })
})
