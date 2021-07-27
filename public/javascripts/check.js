
const socket = io()
const account = document.getElementById('account')
const accounthelp = document.getElementById('accountHelp')

account.addEventListener('keyup', (e) => {
  if (account.value) {
    socket.emit('checkaccount', { input: account.value })
  }
})

socket.on('checkno', (data) => {
  accounthelp.style.color = 'red'
  accounthelp.textContent = data.msg
})
socket.on('checkyes', (data) => {
  accounthelp.style.color = 'green'
  accounthelp.textContent = data.msg
})