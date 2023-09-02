const href = window.location.href.split('/')
const isSettingPage = (!isNaN(parseInt(href[href.length - 1])) && href[href.length - 2] === 'users')
const isUserPage = href[href.length - 3] === 'users'
const isUserReplyPage = (isUserPage && href[href.length - 1] === 'replies')
const isTweetPage = href[href.length - 1] === 'tweets'
const isRepliesPage = href[href.length - 1] === 'replies'
