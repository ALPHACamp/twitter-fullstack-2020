function countLikes(user, length) {
    let likeCount = 0
    for (let i = 0; i < length; i++) {
        if (user.Tweets[i].Likes.length !== 0) likeCount++
    }
    if (likeCount > 1000) {
        likeCount = (likeCount / 1000).toFixed(1)
        return likeCount + "k"
    }
    return likeCount
}
function countTweets(num) {
    if (num > 1000) {
        num = (num / 1000).toFixed(1)
        return num + "k"
    }
    return num
}

module.exports = {
    countLikes,
    countTweets
  }