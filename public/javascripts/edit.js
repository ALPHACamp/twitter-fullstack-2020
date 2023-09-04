const coverAdd = document.getElementById('cover-add')
const avatarAdd = document.getElementById('avatar')
const coverPreview = document.getElementById('cover-preview')
const avatarPreview = document.getElementById('avatar-preview')
const coverDel = document.getElementById('cover-del')
const btnEdit = document.getElementById('btnEdit')
const Username = document.getElementById('name')
const introduction = document.getElementById('introduction')
const nameCount = document.getElementById('nameCount')
const introCount = document.getElementById('introCount')
const originalCover = coverPreview.src

coverAdd.addEventListener('change', function (event) {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = function (e) {
            coverPreview.src = e.target.result
        }
        reader.readAsDataURL(file)
    }
})
coverDel.addEventListener('click', function (event) {
    coverPreview.src = originalCover
})
avatarAdd.addEventListener('change', function (event) {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = function (e) {
            avatarPreview.src = e.target.result
        }
        reader.readAsDataURL(file)
    }
})

btnEdit.addEventListener('click', function (event) {
    const userId = event.target.getAttribute("data-user-id")
    const currentUrl = window.location.href //這會是 http://localhost:3000/users/2/tweets
    //把倒數第三個 / 之後的字串消除改成api需要的路由
    const parts = currentUrl.split('/')  
    parts.splice(-3, 3)
    const apiUrl = parts.join('/') + `/api/users/${userId}`
    fetch(apiUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(user => user.json())
        .then(user => {
            coverPreview.src = user.cover
            avatarPreview.src = user.avatar
            Username.value = user.name
            introduction.value = user.introduction
        })
})

introduction.addEventListener('input', function (event) {
    const charCount = introduction.value.length
    introCount.innerText = `${charCount}/160`
})

Username.addEventListener('input', function (event) {
    const charCount = Username.value.length
    nameCount.innerText = `${charCount}/50`
})
