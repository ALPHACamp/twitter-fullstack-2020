const helpers = require("../_helpers.js");
getTestUser = (req) => {
  if (process.env.NODE_ENV === "test") {
    return helpers.getUser(req);
  } else {
    return req.user;
  }
};

module.exports = { getTestUser };
