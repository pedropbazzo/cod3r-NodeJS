const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const verify = promisify(jwt.verify);

const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ error: 'protected resource' });
    }

    const [bearer, token] = authorization.trim().split(' ');

    if (!bearer || !'Bearer' === bearer || !token) {
      return res.status(400).json({ error: 'invalid token' });
    }

    const decodedToken = await verify(token, process.env.SECRET);
    req.id = decodedToken.id;

    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = authMiddleware;
