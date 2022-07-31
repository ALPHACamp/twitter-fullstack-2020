const editUser = document.querySelector('#edit-user')

function showEditUserModal (data) {
  const modalForm = document.querySelector('#user-modal-form')
  const modalBanner = document.querySelector('#user-modal-banner')
  const modalAvatar = document.querySelector('#user-modal-avatar')
  const modalBody = document.querySelector('#user-modal-body')

  modalForm.action = `/api/users/${data.id}`
  modalBanner.style.background = `linear-gradient(0deg, rgba(23, 23, 37, 0.5), rgba(23, 23, 37, 0.5)), url(${data.banner})`
  modalAvatar.style.background = `linear-gradient(0deg, rgba(23, 23, 37, 0.5), rgba(23, 23, 37, 0.5)), url(${data.avatar})`

  modalBody.innerHTML = `
    <div>
      <div class="input input-name">
        <label class="form-label" for="modal-input-name">名稱</label>
        <input type="text" class="form-control" id="modal-input-name" name="name" value="${data.name}" oninput="countWord(this)" maxlength="50">
      </div>
      <div class="d-flex justify-content-end word-count">
        <span id="name-count"></span>
        <span>/50</span>
      </div>
    </div>
    <div>
      <div class="input input-introduction">
        <label class="form-label" for="modal-input-introduction">自我介紹</label>
        <textarea class="form-control" style="height: 147px; resize: none;" id="modal-input-introduction"
          name="introduction" oninput="countWord(this)" maxlength="160">${data.introduction}</textarea>
      </div>
      <div class="d-flex justify-content-end word-count">
        <span id="introduction-count"></span>
        <span>/160</span>
      </div>
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

editUser.addEventListener('click', event => {
  axios(`/api/users/${event.target.dataset.id}`)
    .then(res => {
      showEditUserModal(res.data)
    })
})
