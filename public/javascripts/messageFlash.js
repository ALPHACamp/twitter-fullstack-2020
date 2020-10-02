const alert = document.querySelector('.alert')

if (alert) {

  let msg = alert.innerText + '　　　　　　　　　　　　　　　　　　'
  const textShift = () => {
    msg = msg.substring(2, msg.length) + msg.substring(0, 2)
    alert.innerText = msg
    setTimeout(textShift, 300)
  }
  textShift()
  // setTimeout(() => { 
  //   alert.classList.add('alertMessage')
  //   alert.addEventListener('animationend', event => { 
  //     // event.target.classList.remove('alertMessage')
  //     // alert.remove() 
  //   }, { once: true })
  // }, 2000)
}




