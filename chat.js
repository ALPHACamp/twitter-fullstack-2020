const moment = require('moment');


module.exports = {
    formatMessage (name, message, avatar, currentUser){
        return {
            message,
            name,
            avatar,
            currentUser,
            time: moment().format('LT')
        }
    }
}