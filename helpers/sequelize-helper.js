const { Op } = require("sequelize")
const db = require('../models')
const { Tweet, User, Like, Reply, sequelize } = db
const helpers = require('../_helpers')
function catchTopUsers (req) {
    return User.findAll({
        where:{
        id:{[Op.ne]: helpers.getUser(req).id},role:'user'
        },
        include:{
        model:User, as:'Followers', attributes:[] , duplicating:false,
        through:{
            attributes:[]
        }
        },
        attributes:['id',"name",'account','avatar',
        [sequelize.fn('COUNT',sequelize.col('Followers.id')),'totalFollower'],
        [sequelize.fn('MAX', sequelize.fn('IF',sequelize.literal('`Followers`.`id` - '+helpers.getUser(req).id+' = 0'),1,0)),'isFollowed'],
        ],
        group:'id',
        order:[[sequelize.col('totalFollower'),'DESC']], 
        limit: 10, raw: true, nest: true,
    })
}
module.exports = {
    catchTopUsers
}