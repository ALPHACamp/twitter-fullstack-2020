// cover圖片預覽效果
function readURL(input) {
  if (input.files && input.files[0]) {
    let reader = new FileReader()

    reader.onload = function (e) {
      $('#cover-placeholder').attr('src', e.target.result)
    }
    reader.readAsDataURL(input.files[0])
  }
}

// avatar圖片預覽效果
function readAvatar(input) {
  if (input.files && input.files[0]) {
    let reader = new FileReader()

    reader.onload = function (e) {
      $('#avatar-placeholder').attr('src', e.target.result)
    }
    reader.readAsDataURL(input.files[0])
  }
}

window.setTimeout(function () {
  $('.flash').remove()
}, 2000)