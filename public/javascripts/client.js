const path = window.location.pathname

if (path === '/signup' || path === '/setting') {
  addScript('/signup')
} else if (path.slice(0, 6) === '/users') {
  addScript('/users')
}

function addScript (route) {
  const BODY = document.getElementsByTagName('body')[0]
  const script = document.createElement('script')
  script.src = `/javascripts${route}.js`
  BODY.appendChild(script)
}
