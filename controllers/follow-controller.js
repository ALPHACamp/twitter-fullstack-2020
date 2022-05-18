const db = require('../models')
const { Tweet, User, Like, Reply, sequelize, Followship} = db
const helpers  = require('../_helpers')
const followshipController={
    postFollowship:(req,res,next)=>{
        const followingId= Number(req.body.id)
        const followerId= helpers.getUser(req).id
        if(followingId===followerId){
            return res.json(new Error('followingId=followerId'))
        }
        return Followship.findOrCreate({
            where:{
                followerId,
                followingId
            }
        }).then(()=>res.redirect(`${req.get('Referrer')}`))
        .catch(err=>next(err))
    },
    deleteFollowship:(req,res,next)=>{
        const followingId= Number(req.params.id)
        const followerId= helpers.getUser(req).id
        return Followship.findOne({
            where:{
                followerId,
                followingId
            }
        }).then(followship=>{
            if(!followship){
                throw new Error('this followship do not exist')
            }
            return followship.destroy()
        }).then(()=>res.redirect(`${req.get('Referrer')}`))
        .catch(err=>next(err))
    }
}
module.exports = followshipController