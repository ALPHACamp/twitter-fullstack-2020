/* for input word count */
const TEXT_INPUT_ClASS = '.text-input'
const TEXT_INPUT_LENGTH_DISPLAY_CLASS = '.input-length'

// 檢查是否在sign up頁
const isSignUp = document.querySelector('#sign-up-form')
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
  // sign up 頁不想要直接顯示出來
  if (!isSignUp) {
    const currentLength = inputObject.value.length
    const displayDiv = inputObject.nextElementSibling.querySelector(TEXT_INPUT_LENGTH_DISPLAY_CLASS)
    const maxLength = Number(inputObject.getAttribute('maxlength'))
    displayDiv.textContent = `${currentLength}/${maxLength}`
  }
}
