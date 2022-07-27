"use strict";

module.exports = {
  ifCond: function ifCond(a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  },
  ifCondFalse: function ifCondFalse(a, b, options) {
    return a !== b ? options.fn(this) : options.inverse(this);
  }
};