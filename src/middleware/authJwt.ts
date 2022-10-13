const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }
  var secret = "Admin_" + req.client.apisecret;

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    req.userguid = decoded.guid;
    req.token = decoded;
    next();
  });
};

export const authJwt = {
  verifyToken,
};
