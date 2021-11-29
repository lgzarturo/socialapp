const User = require("../users/users.model");

exports.postExplore = (req, res) => {
  const { query } = req.body;

  User.find({ name: new RegExp(`.*${query}.*`, "i") })
    .select("_id name biography email")
    .then((users) => {
      res.status(200).json({ users, query });
    });
};
