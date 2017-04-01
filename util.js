module.exports = {
  isPrivate: function(v, k){
    return k == null || k[0] == "_";
  },

  requireAuth: function(req, res, next){
    if (req.isAuthenticated())
      return next();
    res.status(403).send();
  }
};
