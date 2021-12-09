const userId = 2

document.querySelector('#editProfile-btn').addEventListener('click', function (e) {
  axios
    .get(`/api/users/${userId}`)
    .then((response) => {
      document.querySelector('#editProfile-input-name').value = response.data.name
      document.querySelector('#editProfile-textarea-introduction').value = response.data.introduction
    })
    .catch((error) => {
      console.log(error)
    })
})

document.querySelector('#editProfile-button-save').addEventListener('click', function (e) {
  axios
    .post(`/api/users/${userId}`, {
      name: document.querySelector('#editProfile-input-name').value,
      introduction: document.querySelector('#editProfile-textarea-introduction').value,
    })
    .then((response) => {
      if (response.data.status === 'success') {
        window.location.href = `/users/${userId}/tweets`
      }
    })
    .catch((error) => console.log(error))
})

document.querySelector('#avatar').addEventListener(
  'change',
  function (e) {
    var file = this.files[0]
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400) {
        const response = JSON.parse(xhr.responseText)
        document.querySelector('.editProfile-avatar').src = response.message
      }
    }
    var formData = new FormData()
    formData.append('avatar', file)
    xhr.open('POST', `/api/users/${userId}/avatar`, true)
    xhr.send(formData)
    this.value = '' //使選擇相同檔案也會觸發onchange
  },
  true
)

document.querySelector('#cover').addEventListener(
  'change',
  function (e) {
    var file = this.files[0]
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400) {
        const response = JSON.parse(xhr.responseText)
        document.querySelector('.editProfile-cover').src = response.message
      }
    }
    var formData = new FormData()
    formData.append('cover', file)
    xhr.open('POST', `/api/users/${userId}/cover`, true)
    xhr.send(formData)
    this.value = '' //使選擇相同檔案也會觸發onchange
  },
  true
)

document.querySelector('#deleteCover').addEventListener('click', function (e) {
  axios
    .post(`/api/users/${userId}/deleteCover`)
    .then((response) => {
      if (response.data.status === 'success') {
        document.querySelector('.editProfile-cover').src = ''
      }
    })
    .catch((error) => console.log(error))
})
