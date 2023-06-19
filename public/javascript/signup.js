const pwdBtn = document.querySelector('.pwd-eye')
const pwdInput = document.querySelector('.pwd-btn-input')
const pwdEyeImg = document.querySelector('.pwd-eye-img')
const checkPwdBtn = document.querySelector('.check-pwd-eye')
const checkPwdInput = document.querySelector('.check-pwd-btn-input')
const checkPwdEyeImg = document.querySelector('.check-pwd-eye-img')

pwdBtn.addEventListener('click', e => {
  if (e.target.classList.contains('close-eye')) {
    e.target.classList.remove('close-eye')
    e.target.classList.add('open-eye')
    pwdInput.setAttribute('type', 'text')
    pwdEyeImg.setAttribute('src', '/images/eye.svg')
    e.stopPropagation()
    e.preventDefault()
  } else {
    e.target.classList.remove('open-eye')
    e.target.classList.add('close-eye')
    pwdInput.setAttribute('type', 'password')
    pwdEyeImg.setAttribute('src', '/images/eye-slash.svg')
    e.stopPropagation()
    e.preventDefault()
  }
})

checkPwdBtn.addEventListener('click', e => {
  if (e.target.classList.contains('close-eye')) {
    e.target.classList.remove('close-eye')
    e.target.classList.add('open-eye')
    checkPwdInput.setAttribute('type', 'text')
    checkPwdEyeImg.setAttribute('src', '/images/eye.svg')
    e.stopPropagation()
    e.preventDefault()
  } else {
    e.target.classList.remove('open-eye')
    e.target.classList.add('close-eye')
    checkPwdInput.setAttribute('type', 'password')
    checkPwdEyeImg.setAttribute('src', '/images/eye-slash.svg')
    e.stopPropagation()
    e.preventDefault()
  }
})
