const alert = document.querySelector('.alert')
const useScrolling = document.querySelector('.useScrolling')
const useOpacity = document.querySelector('.useOpacity')

if (alert && useScrolling) {
  let msg = alert.innerText + '　　　　　　　　　　　　　　　　　　'
  const textShift = () => {
    msg = msg.substring(2, msg.length) + msg.substring(0, 2)
    alert.innerText = msg
    setTimeout(textShift, 300)
  }
  textShift()
}

if (alert && useOpacity) {
  setTimeout(() => { 
    useOpacity.classList.add('alertMessage')
    useOpacity.addEventListener('animationend', event => { 
      event.target.classList.remove('alertMessage')
      useOpacity.remove() 
    }, { once: true })
  }, 2000)
}


