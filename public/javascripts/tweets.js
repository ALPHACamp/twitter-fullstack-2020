const textareaInput = document.querySelector('#textareaInput');
const submitBtn = document.querySelector('#submitBtn');
const errorMsg = document.querySelector('#errorMsg');
const likeBtns = document.querySelectorAll('.likeBtn');
const followBtns = document.querySelectorAll('.followBtn');
const maxLength = 140;


textareaInput.addEventListener('input', function () {
    const textareaValue = textareaInput.value.trim();

    if (textareaValue.length >= 1 && textareaValue.length <= maxLength) {
      errorMsg.textContent = `${textareaValue.length}/140`
      submitBtn.disabled = false
    } else if (textareaValue.length > maxLength) {
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

likeBtns.forEach(function(likeBtn){
  likeBtn.addEventListener('click', function() {
  localStorage.setItem('scrollPosition', window.scrollY);
  })
})

followBtns.forEach(function(followBtn){
  followBtn.addEventListener('click', function() {
  localStorage.setItem('scrollPosition', window.scrollY);
  })
})

window.addEventListener('load', function() {
  // 從localStorage中讀取滾動位置
  const scrollPosition = localStorage.getItem('scrollPosition');
  if (scrollPosition) {
    // 將頁面滾動到存儲的位置
    window.scrollTo(0, scrollPosition);
    // 清除localStorage中的滾動位置
    localStorage.removeItem('scrollPosition');
  }
});






