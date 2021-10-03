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

// 抓取name字數

function getNameInputLength() {
  const input = document.getElementById('name')
  const log = document.getElementById('nameHelp')
  input.addEventListener('input', updateValue)
  function updateValue(e) {
    log.innerText = `${e.target.value.length}/50`
  }
}

// 抓introduction字數
function getIntroInputLength() {
  const input = document.getElementById('introduction')
  const log = document.getElementById('introHelp')
  input.addEventListener('input', updateValue)
  function updateValue(e) {
    log.innerText = `${e.target.value.length}/160`
  }
}
