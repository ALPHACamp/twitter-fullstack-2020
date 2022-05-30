const body = document.body
let socket = io({query:{name:body.dataset.user}});
let chatBlock = document.getElementById('chat-block')
let chatInput = document.getElementById('chat-input');
let chatForm = document.getElementById('chat-form')
chatForm.addEventListener('submit', function(e) {
e.preventDefault();
    if (chatInput.value) {
        let letter=JSON.stringify({
            to:'user3',
            from:'user1',
            content:chatInput.value
        }) 
        socket.emit('send message', letter);
        chatBlock.innerHTML+='自己:'+chatInput.value+'<br/>'
        chatInput.value = '';
    }
});
socket.on('send letter',jsonletter=>{
    const {content} = JSON.parse(jsonletter)
    console.log(content)
    chatBlock.innerHTML+='別人:'+content+'<br/>'
})