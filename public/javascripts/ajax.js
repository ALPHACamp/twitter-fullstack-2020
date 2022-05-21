function toggleLike(tweetId){
    const likeNumber = document.getElementById(`likeBtn${tweetId}Number`)
    const likeIcon = document.getElementById(`likeBtn${tweetId}Icon`).classList
    let likeStatus = likeIcon.contains('text-danger')
    //console.log(likeStatus)
    if(likeStatus){
        axios.post(`/tweets/${tweetId}/unlike`).then(res=>{
            //console.log(res.status)
            if(res.status===200){
                likeIcon.toggle('text-danger')
                likeIcon.remove('fas')
                likeIcon.add('far')
                likeNumber.innerHTML=` ${Number(likeNumber.innerHTML)-1}`
            }
        })
    }
    else{
        axios.post(`/tweets/${tweetId}/like`).then(res=>{
            //console.log(res.status)
            if(res.status===200){
                likeIcon.toggle('text-danger')
                likeIcon.remove('far')
                likeIcon.add('fas')
                likeNumber.innerHTML=` ${Number(likeNumber.innerHTML)+1}`
            }
        })
    }
}