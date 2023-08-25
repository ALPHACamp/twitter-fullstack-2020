/* for user setting */
const USER_COVER = '#user-setting-cover'
const USER_COVER_INPUT = '#user-cover-input'
const USER_AVATAR_INPUT = '#user-avatar-input'
const USER_AVATAR = '#user-setting-avatar'
const REMOVE_COVER_INPUT = '#remove-cover-input'
/* for input word count */
const TEXT_INPUT_ClASS = '.text-input'
const TEXT_INPUT_LENGTH_DISPLAY_CLASS = '.input-length'
/* get original input src */
const originCover = document.querySelector(USER_COVER).src
/* user avatar upload in setting */
const userSettingAvatarInput = document.querySelector(USER_AVATAR_INPUT)
userSettingAvatarInput.addEventListener('change', event => { showPreview(event, USER_AVATAR) })

/* user cover upload in setting */
const userSettingCoverInput = document.querySelector(USER_COVER_INPUT)
userSettingCoverInput.addEventListener('change', event => { showPreview(event, USER_COVER) })
/* remove user setting cover input */
const removeUserSettingCoverInput = document.querySelector(REMOVE_COVER_INPUT)
removeUserSettingCoverInput.addEventListener('click', event => {
  event.stopPropagation() // 防止觸發label
  removeInput(event, USER_COVER_INPUT, USER_COVER)
})

function showPreview (event, id) {
  if (event && event.target.files.length > 0) {
    const src = URL.createObjectURL(event.target.files[0])
    const preview = document.querySelector(id)
    preview.src = src
    // preview.style.display = 'block'
  }
}

function removeInput (event, inputId, originCoverId) {
  if (!event) return
  const input = document.querySelector(inputId)
  const preview = document.querySelector(originCoverId)
  preview.src = originCover
  input.value = ''
}

const textInputs = document.querySelectorAll(TEXT_INPUT_ClASS)

textInputs.forEach(textInput => {
  showInputLengthWhenRender(textInput)
  textInput.addEventListener('input', event => {
    displayInputLength(event)
  })
})

function displayInputLength (event) {
  if (event.target.matches(TEXT_INPUT_ClASS)) {
    const currentLength = event.target.value.length
    const displayDiv = event.target.nextElementSibling.querySelector(TEXT_INPUT_LENGTH_DISPLAY_CLASS)
    const maxLength = Number(event.target.getAttribute('maxlength'))
    displayDiv.textContent = `${currentLength}/${maxLength}`
  }
}

function showInputLengthWhenRender (inputObject) {
  const currentLength = inputObject.value.length
  const displayDiv = inputObject.nextElementSibling.querySelector(TEXT_INPUT_LENGTH_DISPLAY_CLASS)
  const maxLength = Number(inputObject.getAttribute('maxlength'))
  displayDiv.textContent = `${currentLength}/${maxLength}`
}
/* user setting end */
