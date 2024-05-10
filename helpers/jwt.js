// helpers/jwt.js
const jwt = require('jsonwebtoken');

function generateToken(user) {
  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1h' // Token expires in 1 hour
  });
  return token;
}

module.exports = generateToken;

