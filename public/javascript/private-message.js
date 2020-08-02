$(function () {
  const socket = io()
  const mailForm = document.querySelector('#mail-form')
  const input = document.querySelector('#input')
  const mailContent = document.querySelector('.mail-main')
  const targetUserId = Number(location.pathname.slice(9, 20))

  // emit input message to socket
  mailForm.addEventListener('submit', event => {
    event.preventDefault()
    if (input.value.length === 0) { return false }
    const message = input.value
    socket.emit('sendPrvate', { message, receiverId: targetUserId })
    input.value = ''
    return false
  })

})
