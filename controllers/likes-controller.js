const likesController = {
  getLikes:(req,res,next)=>{ // 取得喜歡的內容
    res.render('like-content')
  }
}

module.exports = likesController