const targetNode = document.getElementById('postTweetModal')

// 取得目前現在視窗大小的函式
function updatePageHeight () {
  let pageHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight
  )
  pageHeight = pageHeight - 30
  return pageHeight
}

let pageHeight = updatePageHeight()

// 如果視窗有被調整，要重新取得視窗大小
window.addEventListener('resize', function () {
  pageHeight = updatePageHeight()
})
const observer = new MutationObserver(function async (mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      // 如果監聽對象的 class 有 show 的話
      if (mutation.target.classList.contains('show')) {
        // 將他的 top 設定到固定位置
        targetNode.style.top = `-${pageHeight}px`
      }
      console.log('點擊成功')
    }
  }
})
const observerOptions = {
  attributes: true,
  attributeFilter: ['class']
}

observer.observe(targetNode, observerOptions)
