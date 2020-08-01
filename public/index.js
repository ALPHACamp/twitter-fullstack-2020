(function () {
  const socket = io().connect('http://localhost')
  const sendBtn = document.getElementById('send-message')
  const messageList = document.getElementById('message-list')
  const message = document.getElementById('message')

  // 廣播加入的使用者及在線人數
  socket.on('attend', (attend) => {
    messageList.innerHTML += `<li>${attend.socket.id} 已連線！, 在線人數: ${attend.connectionsLength}</li>`
  })

  // 按下按鈕呼叫 Server side 的 emit send 動作
  sendBtn.addEventListener('click', (e) => {
    e.preventDefault()
    socket.emit('send', message.value)
    message.value = null
  })

  // Server side 的 emit send 呼叫 Client side 的 showMsg
  socket.on('showMsg', (msg) => {
    messageList.innerHTML += `<li>${msg}</li>`
  })
})()

function wordsTotal () {
  const total = document.getElementById('userInput').value.length
  if (total > 140) { document.getElementById('display').innerHTML = `<span style="color:red;">${total}/140</span>` } else {
    document.getElementById('display').innerHTML = `<span>${total}/140</span>`
  }
}
function wordsTotal_btn () {
  const total = document.getElementById('userInput_btn').value.length
  if (total > 140) { document.getElementById('display_btn').innerHTML = `<span style="color:red;">${total}/140</span>` } else {
    document.getElementById('display_btn').innerHTML = `<span>${total}/140</span>`
  }
}
