const socket = io()     // 建立 socket 通道
const socketForm = document.getElementById('socketForm')  // layouts/main.hbs 的 textarea id
const socketMsg = document.getElementById('socketMsg')    // layouts/main.hbs 的 Form id
const onlineUsers = []  // 儲存上線使用者人數之陣列

// 當前上線人數
socket.on('onlineCount', onlineCount => {
  console.log('Front get onlineCount', onlineCount)
  // DOM: 刷新頁面 上線人數
})

// 取得上線使用者清單
socket.on('onlineUsers', onlineUsersData => {
  onlineUsers.push(onlineUsersData)
  console.log('Online User List', onlineUsers)
  // DOM: 刷新頁面 上線使用者清單
})

// 廣播訊息: xxx 進入/離開 聊天室
socket.on('broadcast', data => {
  console.log('公告: ', data)
  // DOM: 留言區插入公告訊息
})

// 監聽發送留言
socketForm.addEventListener('submit', event => {
  // 停止 submit 動作
  event.preventDefault()
  // socketForm 帶出 登入使用者的 id, socketMsg 帶出 留言內容
  socket.emit('chat message', { id: socketForm.dataset.id, msg: socketMsg.value })
  // 清空 留言內容
  socketMsg.value = ''
  // 跳出 submit
  return false
})

// 添加顯示留言
socket.on('chat message', data => {
  console.log(socketForm.dataset.id)
  console.log('留言資訊', data)
  if (Number(socketForm.dataset.id) === data.id) {
    // 屬於自己的留言
    // DOM: 留言右半 HTML
    console.log('我的')
  } else {
    // 屬於別人的留言
    // DOM: 留言左半 HTML
    console.log('別人的')
  }
})