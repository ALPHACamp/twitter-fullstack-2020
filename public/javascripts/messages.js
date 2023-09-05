const remind = document.getElementById('alert')
remind.style.animation = 'toHidden 10s ease-in'
setTimeout(() => {
  remind.style.animation = null
  remind.style.display = 'none'
  remind.style.height = '0'
}, 4000)
