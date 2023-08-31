const coverAdd = document.getElementById('cover-add')
const avatarAdd = document.getElementById('avatar')
const coverPreview = document.getElementById('cover-preview')
const avatarPreview = document.getElementById('avatar-preview')
const coverDel = document.getElementById('cover-del')
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