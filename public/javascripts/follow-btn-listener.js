window.addEventListener('load', async e => {
  const followBtn = document.querySelectorAll('.follow-item') || ''

  followBtn.forEach((btn, i) => {
    btn.addEventListener('click', async e => {
      try {
        const userId = btn.dataset.userid || ''
        if (btn.matches('.following-btn')) {
          btn.classList.remove('following-btn')
          btn.classList.add('follow-btn')
          btn.textContent = '跟隨'
          await axios.delete('/followships', { id: userId })
        } else if (btn.matches('.follow-btn')) {
          btn.classList.remove('follow-btn')
          btn.classList.add('following-btn')
          btn.textContent = '正在跟隨'
          await axios.post('/followships', { id: userId })
        } else {
          return
        }
      } catch (err) {
        console.log(err)
      }
    })
  })
})
