const jwt = require('jsonwebtoken');
require("dotenv").config();

// Function to generate a JWT token
function generateToken(email) {
  return jwt.sign({email}, process.env.JWT_SECRET,{ expiresIn: process.env.EXPIRY }); 
}

// Function to verify and decode a JWT token
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.email;
  } catch (error) {
    throw Error(error);
  }
}

module.exports = {generateToken,verifyToken};
