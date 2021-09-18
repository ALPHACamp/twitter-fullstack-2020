module.exports = (app) => {
  app.get("/", (req, res) => res.render("index"));
  app.get("/posts", (req, res) => res.render("posts"));
};
