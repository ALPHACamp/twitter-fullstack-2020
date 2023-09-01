const href = window.location.href.split('/')
const isSettingPage = (!isNaN(parseInt(href[href.length - 1])) && href[href.length - 2] === 'users')
const isUserPage = href[href.length - 3] === 'users'
const isMainPage = (href[href.length - 1] === 'tweets' || href[href.length - 1] === 'replies')
