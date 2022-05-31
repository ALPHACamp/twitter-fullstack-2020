//處理聊天事務
const chatContent = document.getElementById('chat-content')
const chatInput = document.getElementById('chat-input')
const chatForm = document.getElementById('chat-form')


chatForm.addEventListener('submit', function(e) {
    e.preventDefault()
    if (chatInput.value) {
        let letter=JSON.stringify({
            to,
            from:userId,
            content:chatInput.value
        }) 
        socket.emit('send message', letter)
        chatContent.innerHTML+=`<div class="text-end">${chatInput.value}</div>`
        chatInput.value = ''
    }
})

socket.on('send letter',jsonletter=>{
    const {content, from, to} = JSON.parse(jsonletter)
    chatContent.innerHTML+=`<div class="text-start">${content}</div>`
})
    
    
function chat(btn){
    const chatWith = btn.innerHTML
    if(chatWith===userId){console.log('不能與自己聊天')}
    else{
        chatHeader.innerHTML=chatWith
        chatContent.innerHTML=''
        to=chatWith
    }
}