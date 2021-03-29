const { JWTAuth } = require('../utils/jwt-auth')
const httpContext = require("express-http-context")
const { globalResponse } = require('../utils/utils')
const logger = require('./logger')
const auth = new JWTAuth();


const authMiddleware = async (req, res, next) => {
  const authorization = req.headers['authorization'];
  if (authorization) {
    let token = authorization.split(' ');
    let length = token.length;
    if (length == 2) {
      let accessToken = token[1];
      try {
        let decoded = await auth.verifyToken(accessToken);
        const user = decoded.data;
        if (!req.headers['user_code'] || (user.user_code !== Number(req.headers['user_code']))) {
          return res.status(403).send(globalResponse([], 'err_128', true, ''))
        }
        httpContext.set("username", user.username);
        req['currentUser'] = user;
        next();
        return;
      } catch (e) {
        logger.error(`path: ${req.originalUrl} \nError while doing authentication from middleware: %j %s`, e, e)
        return res.status(403).send(globalResponse([], 'err_128', true, ''))
      }
    }
  }
  return res.status(403).send(globalResponse([], 'err_128', true, ''))
};

module.exports = {
  authMiddleware
}