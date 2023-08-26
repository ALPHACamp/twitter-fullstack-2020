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
      const templateSource = `
        <div class="li-container" id="tweet-li-template">
          {{#each moreTweets}}
            <div
              class="tweet mt-3 mb-3 d-flex justify-content-center"
              style="border-bottom:1px solid #E6ECF0; min-height:153px"
            >
              <div
                class="avatar"
                style="width:50px; height:50px; background-color:gray; border-radius:50%;"
              >
                <a
                  href="/users/{{this.userId}}/tweets"
                  class="d-flex justify-content-center align-items-center"
                >
                  <img
                    src="{{this.userAvatar}}"
                    alt=""
                    style="width:100%; height:100%; object-fit:cover; border-radius:50%;"
                  />
                </a>
              </div>
              <div class="content ms-2" style="width:528px">
                <div class="account d-dlex flex-row mt-2">
                  <a class="user-text-link" href="/users/{{this.userId}}/tweets">
                    <p style="display: inline; font-weight:700">{{this.userAccount}}</p>
                  </a>
                  <p
                    style="display: inline; color:#6C757D"
                  >@{{this.userName}}．{{relativeTimeFromNow this.createdAt}}</p>
                </div>
                <div class="text mt-2">
                  <a
                    href="/tweets/{{this.tweetId}}/replies"
                    style="display: inline; text-decoration: none; color:#000000;word-wrap:break-word;"
                  >
                    <p>{{this.text}}</p>
                  </a>
                </div>
                <div
                  class="reaction d-flex justify-content-between mt-2"
                  style="width:120px"
                >
                  <div class="replies d-flex align-items-center">
                    <button
                      type="button"
                      class="reply-btn btn p-0"
                      data-bs-toggle="modal"
                      data-bs-target="#reply{{this.tweetId}}Modal"
                    >
                      <img src="/images/reply-icon.svg" alt="" />
                    </button>
                    <p
                      class="m-0"
                      style="color:#6C757D; font-weight:600"
                    >{{this.replies}}</p>
                  </div>
                  <div class="likes d-flex align-items-center">
                    {{#if this.isLiked}}
                      <form action="/tweets/{{this.tweetId}}/unlike" method="post">
                        <button class="like-btn" type="submit">
                          <img
                            src="/images/icon-like-active.svg"
                            alt=""
                            style="fill:#FC5A5A"
                          />
                        </button>
                      </form>
                    {{else}}
                      <form action="/tweets/{{this.tweetId}}/like" method="post">
                        <button class="like-btn" type="submit">
                          <img src="/images/icon-like.svg" alt="" />
                        </button>
                      </form>
                    {{/if}}
                    <p class="m-0" style="color:#6C757D; font-weight:600">{{this.likes}}</p>
                  </div>
                </div>
              </div>
            </div>

            {{! modal }}
            <div
              class="modal fade"
              id="reply{{this.tweetId}}Modal"
              tabindex="-1"
              aria-labelledby="reply{{this.tweetId}}ModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <div class="modal-content" style="width:600px">
                  <div class="modal-header">
                    <button
                      type="button"
                      style="border: none; background: none; padding: 0; margin: 0; cursor: pointer;"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      <img src="/images/icon-close.svg" alt="" />
                    </button>
                  </div>
                  <div class="modal-body d-flex position-relative">
                    <div
                      class="avatar d-flex flex-column"
                      style="width:50px; height:50px; border-radius:50%; background-color:gray"
                    >
                      <img src="" alt="" />
                    </div>
                    <div class="content ms-2" style="max-width:510px">
                      <div class="account d-dlex flex-row mt-2">
                        <p style="display: inline; font-weight:700">{{this.userAccount}}</p>
                        <p
                          style="display: inline; color:#6C757D"
                        >@{{this.userName}}．{{relativeTimeFromNow this.createdAt}}</p>
                      </div>
                      <div class="text mt-2">
                        {{this.text}}
                      </div>
                      <div class="toWhom m-3">
                        <p
                          style="display: inline; font-weight:600; color:#6C757D"
                        >回覆給</p><p
                          style="display: inline; font-weight:600; color:#FF6600"
                        > @{{this.userName}}</p>
                      </div>
                    </div>
                    <div
                      class="divider position-absolute"
                      style="height:76px; width:2px; background-color:#CCD6DD; left:40px; top:76px"
                    ></div>
                  </div>
                  <div
                    class="footer position-relative"
                    style="height:245px; padding-left:1rem"
                  >
                    <form
                      action="/tweets/{{this.tweetId}}/replies"
                      method="post"
                      class="d-flex"
                    >
                      <div
                        class="avatar"
                        style="width:50px; height:50px; border-radius:50%; background-color:antiquewhite;"
                      >
                        <img src="" alt="" />
                      </div>
                      <input
                        type="comment"
                        class="w-100"
                        style="border:none; outline: none; background: none; max-width:510px"
                        placeholder="推你的回覆"
                        name="comment"
                        required
                      />
                      <div
                        class="position-absolute bottom-0 end-0 d-flex align-items-center"
                      >
                        <p
                          class="warning mb-0"
                          style="text-align:center"
                        >字數不可超過140個字</p>
                        <button
                          type="submit"
                          style="border: none; background: none; padding: 0; margin: 15px; cursor: pointer; background-color:#FF6600; width:64px; height:40px; border-radius:50px; color:white"
                        >回覆</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          {{/each}}
        </div>`;
      const template = Handlebars.compile(templateSource);
      const renderedHTML = template({ moreTweets });
      console.log(renderedHTML);

      // 將新的 tweets 添加到 .li-container 中
      const liContainer = document.querySelector(".li-container");
      liContainer.insertAdjacentHTML("beforeend", renderedHTML);
    }
  } catch (error) {
    console.log(error);
  }
}
