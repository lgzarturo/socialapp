exports.idValidator = (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "parameter id is required" });
  }
  if (id.match(/^[0-9a-fA-F]{24}$/) === null) {
    return res.status(400).json({ message: "parameter id in URL is invalid" });
  }
  next();
};
