/* for user setting */
const USER_COVER = '#user-setting-cover'
const USER_COVER_INPUT = '#user-cover-input'
const USER_AVATAR_INPUT = '#user-avatar-input'
const USER_AVATAR = '#user-setting-avatar'
const REMOVE_COVER_INPUT = '#remove-cover-input'

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
