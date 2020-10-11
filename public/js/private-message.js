$(function (){
    const socket = io();
    const receiverId = Number(location.pathname.slice(9, 20));
    const mailForm = document.querySelector('#mail-form');
    const input = document.querySelector('#input')

    socket.emit('privateMessage', receiverId)
    
    mailForm.addEventListener('submit', event => {
        event.preventDefault()
        if (input.value.length === 0) { return false }
        const message = input.value
        socket.emit('sendPrvate', { message, receiverId })
        input.value = ''
        return false;
    })
})
