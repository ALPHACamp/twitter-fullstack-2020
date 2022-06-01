const chatHeader = document.getElementById('chat-header')
const chatContent = document.getElementById('chat-content')
const chatInput = document.getElementById('chat-input')
const chatForm = document.getElementById('chat-form')
const senderInput = document.getElementById('sender-input')
const receiverInput = document.getElementById('receiver-input')
const peopleGroup = document.getElementById('people-group')
//
chatForm.addEventListener('submit', function(e) {
    e.preventDefault()
    if (chatInput.value && receiverInput.value) {
        const message = {
            senderId:senderInput.value,
            receiverId:receiverInput.value,
            content:chatInput.value,
            date:new Date().toISOString()
        }
        socket.emit('post message',JSON.stringify(message))
        chatContent.innerHTML+=myMessage(chatInput.value)
        chatInput.value=''
    }
})
socket.on('get message', message => {
    const { senderId, receiverId, date, content } = JSON.parse(message)
    if(senderId===receiverInput.value){
        //直接把message塞進chatContent
        chatContent.innerHTML+=othersMessage(content)
    }
    else{
        //設定people group
        const chatUsers = document.getElementsByName('chat-user')
        let chatUser = null
        for(const user of chatUsers){
            if(user.dataset.userId===senderId){
                chatUser=user
                break
            }
        }
        if(chatUser){
            console.log(chatUser.querySelector('span').style.visibility)
            chatUser.querySelector('span').style.visibility='visible'
        }else{
            //add a new nav of this sender
        }

    }
})
function myMessage(message){
    return `<p class="text-end px-1">
        <span class="rounded-pill px-2 py-1 myMessage">${message}</span>
        </p>`
}
function othersMessage(message){
    return `<p class="text-start px-1">
        <span class="rounded-pill px-2 py-1 othersMessage">${message}</span>
        </p>`
}
function change(e){
    const { userId } = e.dataset
    //
    document.getElementById('chat-area').hidden=false
    e.querySelector('span').style.visibility='hidden'
    chatHeader.innerHTML = e.innerHTML
    receiverInput.value = userId
    chatContent.innerHTML=''
    //api chat history,
}