const inputAccount = document.querySelector('input#account')
const inputName = document.querySelector('input#name')

const COLOR_CODE = {
  WARNING: '#FC5A5A',
  DARK: '#171725'
}

Array.from([inputAccount, inputName]).forEach(target => {
  target.addEventListener('input', (e) => {
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
