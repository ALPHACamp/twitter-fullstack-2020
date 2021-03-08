const button = document.querySelector('#editUser')
const cover = document.querySelector('#cover')
const avatar = document.querySelector('#avatar')
const name = document.querySelector('#name')
const introduction = document.querySelector('#introduction')
const id = window.location.search.slice(1)
button.addEventListener('click', (event) => {
  axios.get(`/api/users/${id}`)
    .then((res) => {
      cover.innerHTML = `          <img class="card-img-top" src="${res.data.cover}" alt="Card image cap">
          <input type="file" name="cover" id="inputCover"> cover`
      avatar.innerHTML = `          <img class="card-img-top" src="${res.data.avatar}" alt="Card image cap">
          <input type="file" name="avatar" id="inputAvatar"> avatar
        `
      name.innerHTML = `          <label for="inputName" class="col-form-label">名稱:</label>
          <input type="text" class="form-control" name="name" value="${res.data.name}" id="inputName">`
      introduction.innerHTML = `
          <label for="inputIntroduction" class="col-form-label">自我介紹:</label>
          <textarea class="form-control" id="inputIntroduction" name="introduction">${res.data.introduction}</textarea>`
    })
    .catch((error) => {
      console.log(error)
    })
})
const save = document.querySelector('#save')
save.addEventListener('click', (event) => {
  const inputCover = document.querySelector('#inputCover').files[0]
  const inputAvatar = document.querySelector('#inputAvatar').files[0]
  const inputName = document.querySelector('#inputName').value
  const inputIntro = document.querySelector('#inputIntroduction').value
  if (inputIntro.length > 140 || !inputIntro.trim()) {
    return alert('自我介紹超過140個字或是空白')
  }
  if (inputName.length > 50 || !inputName.trim()) {
    return alert('名稱不能超過50字或空白')
  }
  const dataForm = new FormData()
  dataForm.append('cover', inputCover)
  dataForm.append('avatar', inputAvatar)
  dataForm.append('name', inputName)
  dataForm.append('introduction', inputIntro)
  let config = {
    headers: { "Content-Type": "multipart/form-data" }
  }
  axios.post(`/api/users/${id}`, dataForm, config)
    .then((res) => {
      window.location.reload()
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
})
