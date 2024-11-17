const express = require("express");
const router = express.Router();
const { signUp, login, sendOTP, resetPassword, resetPasswordToken, updateUser } = require("../controllers/Auth");
const { auth } = require("../middleware/auth");
const { uploadFile } = require("../controllers/Upload");

// For login and signup the account
router.post("/signup", signUp);
router.put("/login", login);
router.post("/sendOTP", sendOTP);
router.put("/update-photo", auth, uploadFile);

router.put("/reset-password", resetPassword);
router.put("/reset-password-token", resetPasswordToken);
router.put("/update-user", auth, updateUser);

module.exports = router;
