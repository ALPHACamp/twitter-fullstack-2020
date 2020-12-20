const moment = require('moment')
module.exports = {
    ifCond: function (a, b, options) {
        if (a === b) {
            return options.fn(this)
        }
        return options.inverse(this)
    },
    moment: function (a) {
        return moment(a).fromNow()

    },
    momentFormat: function (a) {
        moment.locale('zh-tw')
        return moment(a).format('mm:ss a ． YYYY MMMM Do')
    }
}