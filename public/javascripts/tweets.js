const textareaInput = document.querySelector('#textareaInput');
const submitBtn = document.querySelector('#submitBtn');
const errorMsg = document.querySelector('#errorMsg');
const maxLength = 140;

textareaInput.addEventListener('input', function () {
    const textareaValue = textareaInput.value.trim();

    if (textareaValue.length > maxLength) {
        textareaInput.value = textareaValue.slice(0, maxLength);
        errorMsg.textContent = '字數不可超過140字';
    } else if (textareaValue.length < 1) {
        errorMsg.textContent = '內容不可空白';
        submitBtn.disabled = true;
    } else {
        errorMsg.textContent = '';
        submitBtn.disabled = false;
    }
})




