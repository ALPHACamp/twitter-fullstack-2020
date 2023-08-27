let startingOffset = 15;
const limit = 15;


// 選擇滾動的 <section> 元素
const scrollableSection = document.querySelector("#scrollable-section");

scrollableSection.addEventListener("scroll", async () => {
  if (
    scrollableSection.scrollTop + scrollableSection.clientHeight >=
    scrollableSection.scrollHeight
  ) {
    // 滾動到底部，載入更多資料
    console.log("loadMore!");
    await loadMoreTweets(startingOffset);
    startingOffset += limit;
    console.log("startingOffset:", startingOffset);
  }
});

async function loadMoreTweets(offset) {
  try {
    const response = await axios.get(`/tweets/more/${offset}`, {
      headers: { "Content-Type": "application/json" },
    });
    console.log(JSON.stringify(response.data, null, 2));
    const moreTweets = await JSON.stringify(response.data, null, 2);

    if (moreTweets.length > 0) {
      const renderHTML = ``
      moreTweets.forEach(tweet => {
        renderHTML += `
        
        `
      })

      // 將新的 tweets 添加到 .li-container 中
      const liContainer = document.querySelector(".li-container");
      liContainer.insertAdjacentHTML("beforeend", renderedHTML);
    }
  } catch (error) {
    console.log(error);
  }
}
