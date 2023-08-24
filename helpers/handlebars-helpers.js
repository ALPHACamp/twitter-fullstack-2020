const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
module.exports = {
  currentYear: () => dayjs().year(),
  relativeTimeFromNow: (a) => dayjs(a).fromNow(),
  hourTime: (a) => dayjs(a).format('A HH:mm'),
  dateTime: (a) => dayjs(a).format('YYYY/MM/DD'),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  },
};
