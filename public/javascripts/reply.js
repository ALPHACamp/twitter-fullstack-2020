const main = document.querySelector('.main')

const replyareaInput = document.querySelector('#replyareaInput');
const replySubmitBtn = document.querySelector('#replySubmitBtn');
const replyErrorMsg = document.querySelector('#replyErrorMsg');
const replyMaxLength = 140;


main.addEventListener('click', () => {

    if (!event.target.classList.contains('reply-modal-trigger')) return

    // 第一行推文作者資訊
    const cardTextInfo = event.target.parentElement.parentElement.firstElementChild
    const cardTextInfoModal = document.querySelector('.card-text-info-reply')
    cardTextInfoModal.innerHTML = cardTextInfo.innerHTML

    // 推文內容
    const description = cardTextInfo.nextElementSibling
    const descriptionModal = document.querySelector('#tweetDescription')
    descriptionModal.innerText = description.innerText

    // 推文作者頭像
    const Avatar = cardTextInfo.parentElement.previousElementSibling
    const AvatarModal = document.querySelector('.reply-avatar-div')
    AvatarModal.innerHTML = Avatar.innerHTML

    // 連結
    const tweetlink = cardTextInfo.parentElement.previousElementSibling.previousElementSibling
    const tweetlinkModal = document.querySelector('#tweetHref')
    tweetlinkModal.href = tweetlink.href

    // account
    const account = cardTextInfo.firstElementChild.nextElementSibling.firstElementChild
    const accountModal = document.querySelector('#tweetUserAccount')
    accountModal.innerText = account.innerText
    accountModal.parentElement.href = cardTextInfo.firstElementChild.href

    // 表單
    const tweetReplyForm = document.querySelector('#tweetReply')
    tweetReplyForm.action = tweetlink.href
})


replyareaInput.addEventListener('input', function () {
    const replyareaValue = replyareaInput.value.trim();

    if (replyareaValue.length >= 1 && replyareaValue.length <= maxLength) {
        replyErrorMsg.textContent = `${replyareaValue.length}/140`
        replySubmitBtn.disabled = false
    } else if (replyareaValue.length > replyMaxLength) {
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
