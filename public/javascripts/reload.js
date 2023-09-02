window.addEventListener('pageshow', e => {
  if (e.persisted || (window.performance && window.performance.navigation.type === 2)) {
    location.reload()
  }
}, false)
