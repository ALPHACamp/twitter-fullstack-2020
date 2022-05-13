const db = require('../models')
const { Tweet, User, Like, Reply, sequelize, Followship} = db
const { getUser } = require('../_helpers')
const followshipController={
    postFollowship:(req,res,next)=>{
        const {id}= req.body
        if(id===getUser(req)){
            return next(new Error('unexpexted error'))
        }
        return Followship.findOrCreate({
            where:{
                followerId: id,
                followingId: getUser(req).id
            }
        }).then(()=>res.redirect('/'))
        .catch(err=>next(err))
    },
    deleteFollowship:(req,res,next)=>{
        const {id}= req.params
        return Followship.findOne({
            where:{
                followerId: id,
                followingId: getUser(req).id
            }
        }).then(followship=>{
            if(!followship){
                throw new Error('this followship do not exist')
            }
            return followship.destroy()
        }).then(()=>res.redirect('/'))
        .catch(err=>next(err))
    }
}
module.exports = followshipController