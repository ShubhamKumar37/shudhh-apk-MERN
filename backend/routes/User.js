const express = require("express");
const router = express.Router();
const { signUp, login, sendOTP, resetPassword, resetPasswordToken } = require("../controllers/Auth");
const { auth } = require("../middleware/auth");
const { uploadFile } = require("../controllers/Upload");
// Assuming the resetPassword and resetPasswordToken controllers are not needed or available, they are removed

// For login and signup the account
router.post("/signup", signUp);
router.put("/login", login);
router.post("/sendOTP", sendOTP);
router.put("/update-photo", auth, uploadFile);

router.put("/reset-password", resetPassword);
router.put("/reset-password-token", resetPasswordToken);

module.exports = router;
