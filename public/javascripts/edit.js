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
    fetch(`http://localhost:3000/api/users/${userId}`, {
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
