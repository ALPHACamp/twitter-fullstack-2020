const moment = require('moment')

module.exports = {
  record: function(number, options){
    return number + 1;
  },
  isNumberOne: function(number, options){
    if(number === 0) return options.fn(this);
  },
  isAdmin: function(isAdmin, options){
    if(isAdmin){
      return options.fn(this)
    }
    return options.inverse(this)
  },
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },

  moment: function (a) {
    return moment(a).format('LLL')
  },

  momentTime: function (a){
    return moment(a).fromNow();
  }
}