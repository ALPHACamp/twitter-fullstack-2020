async function loadMoreData (link) {
  // 使用 AJAX 來從伺服器獲取更多資料
  try {
    const response = await axios.get(link)
    return response.data
  } catch (error) {
    console.error(error)
  }
}
