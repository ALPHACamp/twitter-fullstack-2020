const { user }= document.body.dataset
let socket = io({query:{name:user}});
let chatBlock = document.getElementById('chat-block')
let chatInput = document.getElementById('chat-input');
let chatForm = document.getElementById('chat-form')
chatForm.addEventListener('submit', function(e) {
e.preventDefault();
    if (chatInput.value) {
        let letter=JSON.stringify({
            to:'user3',
            from:user,
            content:chatInput.value
        }) 
        socket.emit('send message', letter);
        chatBlock.innerHTML+=`<div class="text-end">${chatInput.value}</div>`
        chatInput.value = '';
    }
});
socket.on('send letter',jsonletter=>{
    const {content, from, to} = JSON.parse(jsonletter)
    chatBlock.innerHTML+=`<div class="text-start">${content}</div>`
})