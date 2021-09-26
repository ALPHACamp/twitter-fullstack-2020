

const messageController = {
   getPublic: (req, res) => {
     user = req.user
     res.render('publicChat', {
       user
     })
   }
}

module.exports = messageController