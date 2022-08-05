const inputAccount = document.querySelector('input#account')
const inputName = document.querySelector('input#name')
const inputPassword = document.querySelector('input#password')
const inputCheckPassword = document.querySelector('input#checkPassword')
const msgCheckPassword = document.querySelector('span.checkPassword-msg')

const COLOR_CODE = {
  WARNING: '#FC5A5A',
  DARK: '#171725',
  GREEN: '#82C43C'
}

const RESULT_MESSAGE = {
  UNIQUE_ACCOUNT: {
    MESSAGE: '帳號可以使用',
    COLOR: COLOR_CODE.GREEN
  },
  DUPLICATED_ACCOUNT: {
    MESSAGE: '請使用另一個帳號',
    COLOR: COLOR_CODE.WARNING
  }
}

// add event listeners
inputPassword.addEventListener('input', verifyPassword)
inputCheckPassword.addEventListener('input', verifyPassword)

inputAccount.addEventListener('focusout', checkAccount)

Array.from([inputAccount, inputName]).forEach(target => {
  const currentCount = target.value.length
  const countSpan = getCountElement(target)
  countSpan.innerHTML = currentCount

  target.addEventListener('input', () => {
    const currentCount = target.value.length
    const countSpan = getCountElement(target)
    countSpan.innerHTML = currentCount
    if (currentCount === 50) {
      highlightCount(countSpan, true)
    }
    if (currentCount === 49) {
      highlightCount(countSpan, false)
    }
  })
})

// function declaration

function getCountElement (targetElement) {
  return targetElement.nextElementSibling.nextElementSibling.querySelector('span.current-word-count')
}

function highlightCount (targetElement, highlight = true) {
  const COUNT_DIV = targetElement.parentElement
  const INPUT_DIV = COUNT_DIV.parentElement
  if (highlight) {
    COUNT_DIV.style.color = COLOR_CODE.WARNING
    INPUT_DIV.style.color = COLOR_CODE.WARNING
    return
  }
  COUNT_DIV.style.color = COLOR_CODE.DARK
  INPUT_DIV.style.color = COLOR_CODE.DARK
}

function verifyPassword () {
  if (inputPassword.value.length === 0 && inputCheckPassword.value.length === 0) {
    msgCheckPassword.textContent = ''
    return
  }
  if (inputPassword.value.length > 0 && inputCheckPassword.value.length > 0) {
    if (inputPassword.value !== inputCheckPassword.value) {
      msgCheckPassword.textContent = '請確保輸入一致的密碼'
      msgCheckPassword.style.color = COLOR_CODE.WARNING
      return
    }
    msgCheckPassword.textContent = '密碼驗證成功'
    msgCheckPassword.style.color = COLOR_CODE.GREEN
  }
}

function checkAccount (e) {
  const account = inputAccount.value.trim()
  if (account.length > 0) {
    return axios
      .get(`/api/users/checkAccount/${account}`)
      .then(res => {
        if (res.data.status === 'error') displayError(res)
        if (res.data.result === 'unique-account') displayCheckResult(RESULT_MESSAGE.UNIQUE_ACCOUNT)
        if (res.data.result === 'duplicated-account') displayCheckResult(RESULT_MESSAGE.DUPLICATED_ACCOUNT)
      })
      .catch(displayError)
  }
  displayCheckResult()
}

function displayError (err) {
  const messages = document.querySelector('div.messages')
  messages.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          ${err.message}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `
}

function displayCheckResult (RESULT = { MESSAGE: '', COLOR: COLOR_CODE.DARK }) {
  const msgContainer = document.querySelector('span.check-account-result')
  msgContainer.textContent = RESULT.MESSAGE
  msgContainer.style.color = RESULT.COLOR
}
