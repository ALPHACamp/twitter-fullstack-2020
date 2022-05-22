const middle = document.getElementById('middle')
const tweetsContainer = document.getElementById('tweetsContainer')
const oldestTime = document.getElementById('oldestTime')
//
middle.style.height = window.innerHeight + 'px'
middle.addEventListener('scroll',scrollToEnd)
//
function scrollToEnd(){
    if(middle.scrollHeight<=middle.scrollTop+window.innerHeight){
        middle.removeEventListener('scroll',scrollToEnd)
        const time = oldestTime.innerHTML
        const apiUrl=`/api/tweets?time=${time}`
        const tweetsHTML=''
        axios.get(apiUrl).then(res=>{
            if(res.status===200){
                const tweets = res.data.tweets
                console.log(res.data.logInUser)
                const avatar=res.data.logInUser.avatar
                let i =''
                for(const tweet of tweets){
                    i+=tweetHTML(tweet,avatar)
                }
                tweetsContainer.innerHTML+=i
                oldestTime.innerHTML=res.data.oldestTime
                middle.addEventListener('scroll',scrollToEnd)
                // /console.log(res.data.tweets)
            }
        }).catch(err=>console.log('apiTweetsError'+err))
    }
}


function tweetHTML(tweet,avatar){
    const likeBtn = tweet.isLiked?`<i class="fas fa-heart text-danger" id="likeBtn${tweet.id}Icon"></i><span id="likeBtn${tweet.id}Number"> ${tweet.totalLike}</span>`:`<i class="far fa-heart" id="likeBtn${tweet.id}Icon"></i><span id="likeBtn${tweet.id}Number"> ${tweet.totalLike}</span>`
    return`<div class="blockstyle">
    <div style="width:100%;height:1rem" onclick="location.href='/tweets/${tweet.id}/replies';"></div>
    <div class="row mx-0 px-0" id="tweetId${tweet.id}">
        <div class="col-1" onclick="location.href='/tweets/${tweet.id}/replies';">
            <a href="/users/${tweet.User.id}/tweets"><img src="${tweet.User.avatar}" class="rounded-circle linkPicture" style="width:50px;height:50px"></a>
        </div>
        <div class="col" style="max-width: 87.5%;">
            <div onclick="location.href='/tweets/${tweet.id}/replies';">
                <p>
                    <a href="/users/${tweet.User.id}/tweets" style="text-decoration:none; color:black;">
                        <span class="fw-bold linkText">${tweet.User.name}</span> 
                    </a>
                    <small><a href="/users/${tweet.User.id}/tweets" style="text-decoration:none;color:rgb(98, 98, 98)">@${tweet.User.account}</a> ‧ ${tweet.updatedAt}</small>  
                </p>
                <p style="word-wrap: break-word; word-break: normal;">${tweet.description}</p>
            </div>
            <div class="d-flex">
                <div>
                    <button type="button" class="border-0 opacityObject" data-bs-toggle="modal" data-bs-target="#tweet${tweet.id}Reply"><i class="far fa-comment"></i> ${ tweet.totalReply}</button>
                </div>
                <div class="col-1" onclick="location.href='/tweets/${tweet.id}/replies';"></div>
                <button class="opacityObject" id="likeBtn${tweet.id}" onclick="toggleLike(${tweet.id})">
                    ${likeBtn}
                </button>
                <div class="col" onclick="location.href='/tweets/${tweet.id}/replies';"></div>
            </div>
        </div>
    </div>
    <div style="width:100%;height:1rem" onclick="location.href='/tweets/${tweet.id}/replies';"></div>
    <hr class="my-0"/>
</div>
<div class="modal fade" id="tweet${tweet.id}Reply" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
            </div>
            <div class="modal-body row">
                <div class="col-2 me-0" >
                    <img src="${tweet.User.avatar}" class="rounded-circle" style="width:50px;height:50px">
                </div>
                <div class="col px-0" style="max-width: 80%;">
                    <span class="fw-bold fs-6">${tweet.User.name}</span><small>@${tweet.User.account} ‧ </small><span>${tweet.updatedAt}</span>
                    <br/>
                    <p class="my-2" style="word-wrap: break-word; word-break: normal;">${tweet.description}</p>
                    <small>回覆給<span style="color:#FF6600">@${tweet.User.account}</span></small>
                </div>
                <form method="POST" action="/tweets/${tweet.id}/replies">
                    <div class="row mt-3">
                        <div class="col-2 me-0">
                            <img src="${avatar}" class="rounded-circle" style="width:50px;height:50px"> 
                        </div>
                        <div class="col mx-0 px-0">
                            <textarea name="comment" class="border-0 mt-2 mx-0 px-0" style="width:100%; border: none;outline: none;resize:none" placeholder="推你的回覆" id="floatingTextarea2" rows="4" maxlength="140" required></textarea>
                        </div>
                    </div>
                    <div class="text-end">
                        <button type="submit" class="btn myBtn rounded-pill " >回覆</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>`
}