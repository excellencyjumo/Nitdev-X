const express = require("express");
const winston = require("winston");
const jwt = require("./services/jwt");
const emailService = require("./services/email");
require("dotenv").config();

const server = express();
server.use(express.json());

const port = process.env.PORT;

const User = [{ email: "excellencejumo@gmail.com", password: "pass1234" }];

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.File({ filename: 'app.log' }),
  ],
});

// Middleware to log requests
server.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

server.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const token = jwt.generateToken(email);
    await emailService(email, "PASSWORD RESET", token);
    res.send(`RESET LINK EXPIRES IN ${process.env.EXPIRY}`);
  } catch (error) {
    logger.error(`Error in /forgot-password: ${error.message}`);
    res.status(500).send(error.message);
  }
}); 

server.post("/reset-password/:token", (req, res) => {
  try {
    const decoded = jwt.verifyToken(req.params.token);
    if (!decoded) {
      logger.warn("Invalid token received.");
      res.status(400).send("INVALID TOKEN");
    } else {
      const { password } = req.body;
      const user = User.find((user) => user.email === decoded); 
      if (user) {
        user.password = password;
        logger.info(`Password reset for user: ${user.email}`);
        res.status(200).json({ user, User });
      } else {
        logger.warn(`User not found for email: ${decoded}`);
        res.status(404).send("User not found");
      }
    }
  } catch (error) {
    logger.error(`Error in /reset-password: ${error.message}`);
    res.status(500).send(error.message);
  }
});

server.use((req, res, next) => {
  logger.warn(`Route not found: ${req.method} ${req.url}`);
  res.status(404).send("PAGE NOT FOUND");
});

server.listen(port, () => {
  logger.info(`Server running on PORT ${port}`);
});
