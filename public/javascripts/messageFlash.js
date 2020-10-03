const alert = document.querySelector('.alert')
const adminOpacity = document.querySelector('.adminOpacity')

if (alert && !adminOpacity) {
  let msg = alert.innerText + '　　　　　　　　　　　　　　　　　　'
  const textShift = () => {
    msg = msg.substring(2, msg.length) + msg.substring(0, 2)
    alert.innerText = msg
    setTimeout(textShift, 300)
  }
  textShift()
}

if (alert && adminOpacity) {
  setTimeout(() => { 
    adminOpacity.classList.add('alertMessage')
    adminOpacity.addEventListener('animationend', event => { 
      event.target.classList.remove('alertMessage')
      adminOpacity.remove() 
    }, { once: true })
  }, 2000)
}




