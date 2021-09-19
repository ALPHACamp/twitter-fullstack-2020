module.exports = (app) => {
  app.get("/", (req, res) => res.render("index"));
  app.get("/posts/1", (req, res) => res.render("post"));
  app.get("/users/1/main", (req, res) => res.render("personalpage"));
};
