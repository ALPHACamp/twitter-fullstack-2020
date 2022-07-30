window.addEventListener('load', async e => {
  const followBtn = document.querySelectorAll('.follow-item') || ''
  followBtn.forEach((btn, i) => {
    btn.addEventListener('click', async e => {
      try {
        let userId = btn.dataset.userid || ''
        const toggleBtn = []
        followBtn.forEach(followBtn => {
          if (followBtn.getAttribute('data-userid') === userId) {
            toggleBtn.push(followBtn)
          }
        })
        if (btn.classList.contains('following-btn')) {
          console.log(toggleBtn)
          toggleBtn.forEach(btn => {
            btn.classList.remove('following-btn')
            btn.classList.add('follow-btn')
            btn.textContent = '跟隨'
          })
          return await axios.post('/followships', { id: userId })
        } else if (btn.classList.contains('follow-btn')) {
          toggleBtn.forEach(btn => {
            btn.classList.remove('follow-btn')
            btn.classList.add('following-btn')
            btn.textContent = '正在跟隨'
          })
          return await axios.post('/followships', { id: userId })
        } else {
          return
        }
      } catch (err) {
        console.log(err)
      }
    })
  })
})
