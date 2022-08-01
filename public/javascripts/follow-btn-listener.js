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
        // 如果按鈕為追蹤狀態，切換class，並置入新的文字內容
        if (btn.classList.contains('following-btn')) {
          toggleBtn.forEach(btn => {
            btn.classList.remove('following-btn')
            btn.classList.add('follow-btn')
            btn.textContent = '跟隨'
          })
          const profileAccontElement = document.querySelector('#profile-account') || ''
          const userAccount = btn.dataset.useraccount || ''

          // 如果沒在profile頁面直接送出 follow，如果有接收到錯誤訊息顯示錯誤訊息
          if (!profileAccontElement) {
            const res = await axios.post('/api/followships', { id: userId })
            if (res.data.status === 'error') {
              return showErrorMessage(res.data.message)
            }
          }

          // 如果有在profile頁面，且旁邊追蹤者為同樣的user，追蹤者數量-1
          if (profileAccontElement.textContent.replace('@', '') === userAccount) {
            const countFollowingsElement = document.querySelector('#count-followers') || ''
            // 文字處裡
            const index = countFollowingsElement.textContent.indexOf('個')
            let amount = Number(countFollowingsElement.textContent.slice(0, index).trim())
            if (!amount === 0) return
            amount--
            countFollowingsElement.textContent = amount.toString() + ' 個'
          }
          // 送出POST
          const res = await axios.post('/api/followships', { id: 2 })
          if (res.data.status === 'error') {
            return showErrorMessage(res.data.message)
          }
        }

        // 如果按鈕為未追蹤狀態，切換class，並置入新的文字內容
        if (btn.classList.contains('follow-btn')) {
          toggleBtn.forEach(btn => {
            btn.classList.remove('follow-btn')
            btn.classList.add('following-btn')
            btn.textContent = '正在跟隨'
          })

          // 如果沒在profile頁面直接送出 follow，如果有接收到錯誤訊息顯示錯誤訊息
          const userAccount = btn.dataset.useraccount || ''
          const profileAccontElement = document.querySelector('#profile-account') || ''
          if (!profileAccontElement) {
            const res = await axios.post('/api/followships', { id: userId })
            if (res.data.status === 'error') {
              return showErrorMessage(res.data.message)
            }
          }

          // 如果有在profile頁面，且旁邊追蹤者為同樣的user，追蹤者數量+1
          if (profileAccontElement.textContent.replace('@', '') === userAccount) {
            const countFollowingsElement = document.querySelector('#count-followers') || ''
            // 文字處裡
            const index = countFollowingsElement.textContent.indexOf('個')
            let amount = Number(countFollowingsElement.textContent.slice(0, index).trim())
            if (!amount === 0) return
            amount++
            countFollowingsElement.textContent = amount.toString() + ' 個'
          }
          const res = await axios.post('/api/followships', { id: userId })
          if (res.data.status === 'error') {
            return showErrorMessage(res.data.message)
          }
        }

        return
      } catch (err) {
        console.log(err)
      }
    })
  })
})
