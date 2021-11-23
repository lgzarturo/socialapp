const User = require("../../model/user/User");

exports.getExplore = (req, res) => {
  res.render("explore", {
    users: [],
    query: "",
  });
};

exports.postExplore = (req, res) => {
  const { query } = req.body;

  User.find({ name: new RegExp(`.*${query}.*`, "i") })
    .select("_id name biography email")
    .then((users) => {
      res.render("explore", {
        users,
        query,
      });
    });
};
