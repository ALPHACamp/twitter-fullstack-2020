let startingOffset = 15;
const limit = 15;


document.addEventListener("DOMContentLoaded", function () {
  const scrollableSection = document.querySelector("#scrollable-section");
  // const templateSource = document.querySelector("#template-hbs").innerHTML;
  scrollableSection.addEventListener("scroll", async () => {
    if (
      scrollableSection.scrollTop + scrollableSection.clientHeight >=
      scrollableSection.scrollHeight
    ) {
      console.log("loadMore!");
      await loadMoreTweets(startingOffset);
      startingOffset += limit;
      console.log("startingOffset:", startingOffset);
    }
  });

  async function loadMoreTweets(offset) {
    try {
      const response = await axios.get(`/tweets?offset=${offset}`, {
        headers: { "Content-Type": "application/json" },
      });

      // const moreTweets = response.data;

      // if (moreTweets.length > 0) {

      //   const template = Handlebars.compile(templateSource)
      //   const renderedHTML = template({moreTweets});
        

      //   const liContainer = document.querySelector(".li-container");
      //   liContainer.insertAdjacentHTML("beforeend", renderedHTML);
      // }
    } catch (error) {
      console.log(error);
    }
  }
});


// 選擇滾動的 <section> 元素
// const scrollableSection = document.querySelector("#scrollable-section");

// scrollableSection.addEventListener("scroll", async () => {
//   if (
//     scrollableSection.scrollTop + scrollableSection.clientHeight >=
//     scrollableSection.scrollHeight
//   ) {
//     // 滾動到底部，載入更多資料
//     console.log("loadMore!");
//     await loadMoreTweets(startingOffset);
//     startingOffset += limit;
//     console.log("startingOffset:", startingOffset);
//   }
// });

// async function loadMoreTweets(offset) {
//   try {
//     const response = await axios.get(`/tweets/more/${offset}`, {
//       headers: { "Content-Type": "application/json" },
//     });
//     // console.log(JSON.stringify(response.data, null, 2));
//     const moreTweets = await JSON.stringify(response.data, null, 2);

//     if (moreTweets.length > 0) {
      
//       const templateSource = document.querySelector("#template").innerHTML;
//       console.log('tS', templateSource)
//       const template = Handlebars.compile(templateSource);
//       const renderedHTML = template({ moreTweets });
//       // 將新的 tweets 添加到 .li-container 中
//       const liContainer = document.querySelector(".li-container");
//       liContainer.insertAdjacentHTML("beforeend", renderedHTML);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }
