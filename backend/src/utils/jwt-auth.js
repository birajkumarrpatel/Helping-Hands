const jwt = require('jsonwebtoken')
const SECRET = process.env.JWT_AUTH_SECRET

class JWTAuth {
  async createToken(data) {
    return new Promise((resolve, reject) => {
      const payload = { data };
      try {
        const token = Promise.resolve(jwt.sign(payload, SECRET));
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  }

  async verifyToken(accessToken) {
    return new Promise((resolve, reject) => {
      try {
        const decoded = jwt.verify(accessToken, SECRET);
        resolve(decoded);
      } catch (err) {
        reject(err);
      }
    });
  }
}
module.exports = {
  JWTAuth
}