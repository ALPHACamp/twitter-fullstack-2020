const replyareaInput = document.querySelector('#replyareaInput');
const replySubmitBtn = document.querySelector('#replySubmitBtn');
const replyErrorMsg = document.querySelector('#replyErrorMsg');
const replyMaxLength = 140;

replyareaInput.addEventListener('input', function () {
    const replyareaValue = replyareaInput.value.trim();

    if (replyareaValue.length > replyMaxLength) {
        replyareaInput.value = replyareaValue.slice(0, replyMaxLength);
        replyErrorMsg.textContent = '字數不可超過140字';
    } else if (replyareaValue.length < 1) {
        replyErrorMsg.textContent = '內容不可空白';
        replySubmitBtn.disabled = true;
    } else {
        replyErrorMsg.textContent = '';
        replySubmitBtn.disabled = false;
    }
})