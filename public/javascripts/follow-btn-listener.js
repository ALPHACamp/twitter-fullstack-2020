window.addEventListener('load', async e => {
  const followBtn = document.querySelectorAll('.follow-item') || ''

  followBtn.forEach((btn, i) => {
    btn.addEventListener('click', async e => {
      try {
        let userId = btn.dataset.userid || ''
        if (btn.classList.contains('following-btn')) {
          btn.classList.remove('following-btn')
          btn.classList.add('follow-btn')
          btn.textContent = '跟隨'
          return await axios.post('/followships', { id: userId })
        } else if (btn.classList.contains('follow-btn')) {
          btn.classList.remove('follow-btn')
          btn.classList.add('following-btn')
          btn.textContent = '正在跟隨'
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
