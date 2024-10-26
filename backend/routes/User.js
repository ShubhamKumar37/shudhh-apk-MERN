const express = require("express");
const router = express.Router();
const { signUp, login, sendOTP } = require("../controllers/Auth");
const { auth } = require("../middleware/auth");
// Assuming the resetPassword and resetPasswordToken controllers are not needed or available, they are removed

// For login and signup the account
router.post("/signup", signUp);
router.post("/login", login);
router.post("/sendOTP", sendOTP);

module.exports = router;
