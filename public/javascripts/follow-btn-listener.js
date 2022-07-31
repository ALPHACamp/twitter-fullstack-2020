window.addEventListener('load', async e => {
  const followBtns = document.querySelectorAll('.follow-item') || ''

  followBtns.forEach((btn, i) => {
    btn.addEventListener('click', async e => {
      try {
        const userId = btn.dataset.userid || ''
        const toggleBtn = []
        followBtns.forEach((followBtn, i) => {
          if (followBtn.getAttribute('data-userid') === userId) {
            toggleBtn.push(followBtn)
          }
        })
        if (btn.classList.contains('following-btn')) {
          toggleBtn.forEach(btn => {
            btn.classList.remove('following-btn')
            btn.classList.add('follow-btn')
            btn.textContent = '跟隨'
          })
          // 追蹤者數量-1
          const userAccount = btn.dataset.useraccount || ''
          const profileAccontElement = document.querySelector('#profile-account') || ''
          if (!profileAccontElement) return await axios.post('/followships', { id: userId })
          if (profileAccontElement.textContent.replace('@', '') === userAccount) {
            const countFollowingsElement = document.querySelector('#count-followers') || ''
            // 文字處裡
            const index = countFollowingsElement.textContent.indexOf('個')
            let amount = Number(countFollowingsElement.textContent.slice(0, index).trim())
            if (!amount === 0) return
            amount--
            countFollowingsElement.textContent = amount.toString() + ' 個'
          }
          return await axios.post('/followships', { id: userId })
        } else if (btn.classList.contains('follow-btn')) {
          toggleBtn.forEach(btn => {
            btn.classList.remove('follow-btn')
            btn.classList.add('following-btn')
            btn.textContent = '正在跟隨'
          })
          const userAccount = btn.dataset.useraccount || ''
          const profileAccontElement = document.querySelector('#profile-account') || ''
          if (!profileAccontElement) return await axios.post('/followships', { id: userId })
          if (profileAccontElement.textContent.replace('@', '') === userAccount) {
            const countFollowingsElement = document.querySelector('#count-followers') || ''
            // 文字處裡
            const index = countFollowingsElement.textContent.indexOf('個')
            let amount = Number(countFollowingsElement.textContent.slice(0, index).trim())
            if (!amount === 0) return
            amount++
            countFollowingsElement.textContent = amount.toString() + ' 個'
          }
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
