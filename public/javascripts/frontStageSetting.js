const href = window.location.href.split('/')
const isSettingPage = (!isNaN(parseInt(href[href.length - 1])) && href[href.length - 2] === 'users')
const isUserPage = href[href.length - 3] === 'users'
const isTweetPage= href[href.length - 1] === 'tweets'
const isReplyPage = href[href.length - 1] === 'replies'
