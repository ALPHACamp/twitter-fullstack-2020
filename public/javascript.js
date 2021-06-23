const nameInput = document.querySelector('.username-input')
const nameInputCount = document.querySelector('.username-input-count')
const introText = document.querySelector('.introtext')
const introCount = document.querySelector('.introcount')

introText.addEventListener('keyup', () => {
  return introCount.innerHTML = introText.value.length
})
briefInput.addEventListener('keyup', () => {
  return briefInputCount.innerHTML = briefInput.value.length
})