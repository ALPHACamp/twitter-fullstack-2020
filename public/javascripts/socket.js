const socket = io()     // 建立 socket 通道
const socketForm = document.getElementById('socketForm')  // layouts/main.hbs 的 textarea id
const socketMsg = document.getElementById('socketMsg')    // layouts/main.hbs 的 Form id
let messages = document.getElementById('messages')
const onlineUserCounter = document.getElementById('onlineUserCounter') // 更新 上線人數
const onlineUserList = document.getElementById('onlineUserList')       // 更新 上線清單
const onlineUsers = []  // 儲存上線使用者人數之陣列

function getDateDiff(data) {
  // 時間轉換
  var timePublish = new Date(data);
  var timeNow = new Date();
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var month = day * 30;
  var diffValue = timeNow - timePublish;
  var diffMonth = diffValue / month;
  var diffWeek = diffValue / (7 * day);
  var diffDay = diffValue / day;
  var diffHour = diffValue / hour;
  var diffMinute = diffValue / minute;

  if (diffValue < 0) {
    alert("錯誤");
  }
  else if (diffMonth > 3) {
    result = timePublish.getFullYear() + "-";
    result += timePublish.getMonth() + "-";
    result += timePublish.getDate();
    alert(result);
  }
  else if (diffMonth > 1) {
    result = parseInt(diffMonth) + "月前";
  }
  else if (diffWeek > 1) {
    result = parseInt(diffWeek) + "周前";
  }
  else if (diffDay > 1) {
    result = parseInt(diffDay) + "天前";
  }
  else if (diffHour > 1) {
    result = parseInt(diffHour) + "小時前";
  }
  else if (diffMinute > 1) {
    result = parseInt(diffMinute) + "分鐘前";
  }
  else {
    result = "剛剛";
  }
  return result;

}
// 更新 上線使用者清單
function displayOnlineList(onlineUsersData) {
  onlineUserList.innerHTML = ''
  let onlineListHTML = ''
  onlineUsersData.forEach(function (user) {
    onlineListHTML += `
      <div class="d-flex align-items-center p-1 pt-2 ps-2"
    style="margin-bottom:1em;background-color:white;text-decoration:none;border-radius: 1em;width:20vw;height:auto;box-shadow:0 0 8px 3px #ccccccb3;">
    <a href="/users/${user.id}/tweets" style="">
      <img src="${user.avatar}"
        onerror="javascript:this.src='https://mir-s3-cdn-cf.behance.net/project_modules/1400_opt_1/37a04795636919.5ff053424df01.jpg';"
        style="border-radius: 0.7em;height: 9vh;width: 9vh;margin-left:0.4em;object-fit: cover;">
    </a>
    <div style="color:#313c4b;width:9vw" class="d-flex align-items-center justify-content-center p-2">
      <div class="d-flex flex-column m-1 ms-4" style="">
        <p class="m-0 fw-bolder">${user.name}</p>
        <p class="m-0" style="color: #313c4b6b;">${user.account}</p>
      </div>
    </div>
  </div>
  `
  })
  onlineUserList.innerHTML = onlineListHTML
}

// 當前上線人數
socket.on('onlineCount', onlineCount => {
  // DOM: 刷新頁面 上線人數
  onlineUserCounter.innerHTML = `在線使用者 ${onlineCount} 名`
})

// 取得上線使用者清單
socket.on('onlineUsers', onlineUsersData => {
  onlineUsers.push(onlineUsersData)
  // DOM: 刷新頁面 上線使用者清單
  displayOnlineList(onlineUsersData)
})

// 廣播訊息: xxx 進入/離開 聊天室
socket.on('broadcast', data => {
  // DOM: 留言區插入公告訊息
  let item = document.createElement('div')
  let htmlContent = `<div class="d-flex justify-content-center align-items-center"
          style="background-color: #313c4b0d;color: #313c4b9a;width: auto;border-radius:0.4em">
          <p class="m-1">${data}</p>
        </div>`
  item.innerHTML = htmlContent
  messages.insertBefore(item, messages.firstChild)
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
  let item = document.createElement('div')
  if (Number(socketForm.dataset.id) === data.id) {
    // 屬於自己的留言
    // DOM: 留言右半 HTML
    item.classList.add('d-flex', 'mb-3')
    let htmlContent = `
    <a href="/users/${data.id}/tweets" >
      <img src="${data.avatar}"
        onerror="javascript:this.src='https://mir-s3-cdn-cf.behance.net/project_modules/1400_opt_1/37a04795636919.5ff053424df01.jpg';"
        style="border-radius: 0.7em;height: 10vh;width: 10vh;object-fit: cover;">
        </a>
      <div style="color:#313c4b;width:25vw" class="ms-4">
        <div class="d-flex ">
          <p class="fs-5 me-3 mb-0"><strong>${data.name}</strong></p>
          <p class="mb-0" style="color: #313c4b84;margin-top:0.1em;">${data.account}</p>
          <p class="mb-0" style="color: #313c4b84;margin:0.42em 0 0 0.5em;font-size:smaller">${getDateDiff(data.createdAt)}</p>
        </div>
        <p class="mt-1 me-4"
          style="word-wrap:break-word;font-size: small;background-color: #ffd5724a;color: #313c4b;height:auto;border-radius: 0.7em;padding:1em;">
          ${data.msg}
        </p>
      </div>`

    item.innerHTML = htmlContent;
    messages.insertBefore(item, messages.firstChild)
  } else {
    // 屬於別人的留言
    // DOM: 留言左半 HTML
    item.classList.add('d-flex', 'flex-row-reverse', 'mb-3')
    let htmlContent = ` 
    <a href="/users/${data.id}/tweets">
          <img src="${data.avatar}"
            onerror="javascript:this.src='https://mir-s3-cdn-cf.behance.net/project_modules/1400_opt_1/37a04795636919.5ff053424df01.jpg';"
            style="border-radius: 0.7em;height: 10vh;width: 10vh;object-fit: cover;">
        </a>
        <div style="color:#313c4b;width:25vw" class="ms-4">
          <div class="d-flex ">
            <p class="fs-5 me-3 mb-0"><strong>${data.name}</strong></p>
            <p class="mb-0" style="color: #313c4b84;margin-top:0.1em;">${data.account}</p>
            <p class="mb-0" style="color: #313c4b84;margin:0.42em 0 0 0.5em;font-size:smaller">${getDateDiff(data.createdAt)}</p>
          </div>
          <p class="mt-1"
            style="word-wrap:break-word; font-size: small;color:white;background-color: #484848c6;height:auto;border-radius: 0.7em;padding:1em;">
            ${data.msg}
          </p>
        </div>`
    item.innerHTML = htmlContent;
    messages.insertBefore(item, messages.firstChild)
  }
})