function tweetValidation(req, res, next){
    const{description}=req.body
    if(0<description.length<=140){
        next()
    }
    res.redirect('/tweets')

  
}

module.exports = {
    tweetValidation
}