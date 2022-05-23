function toggleLike(likeBtn){
    const isLiked=likeBtn.dataset.isLiked==='true'||likeBtn.dataset.isLiked===true||likeBtn.dataset.isLiked==="1"
    const tweetId = Number(likeBtn.dataset.tweetId)
    const icon = likeBtn.querySelector('i')
    const spanLikeNumber= likeBtn.querySelector('span')||document.getElementById(`totalLike`)
    // console.log(isLiked)
    if(isLiked){
        
        axios.post(`/tweets/${tweetId}/unlike`,null,{
            validateStatus: status => 200<=status&&status<=302
        })
        .then(res=>{
            icon.classList.remove('fas')
            icon.classList.add('far')
            icon.classList.toggle('text-danger')
            spanLikeNumber.innerHTML=`${Number(spanLikeNumber.innerHTML)-1}`
            likeBtn.dataset.isLiked=!isLiked
        })
    }
    else{
        
        axios.post(`/tweets/${tweetId}/like`,null,{
            validateStatus: status => 200<=status&&status<=302
        })
        .then(res=>{
            icon.classList.remove('far')
            icon.classList.add('fas')
            icon.classList.toggle('text-danger')
            spanLikeNumber.innerHTML=`${Number(spanLikeNumber.innerHTML)+1}`
            likeBtn.dataset.isLiked=!isLiked
        })
    }
}