const href = window.location.href.split('/')
const isSettingPage = (!isNaN(parseInt(href[href.length - 1])) && href[href.length - 2] === 'users')
