function admin(req, res, next) {
  if (req.user.role !== "Admin") return res.status(403).send("Access denied");
  next();
}

function client(req, res, next) {
  if (req.user.role !== "Client") return res.status(403).send("Access denied");
  next();
}

module.exports = { admin, client };
