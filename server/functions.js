function checkNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.sendStatus(403);
}

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.sendStatus(401);
}

function checkAdminAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  return res.sendStatus(401);
}

module.exports = {
  checkNotAuthenticated,
  checkAuthenticated,
  checkAdminAuthenticated
};