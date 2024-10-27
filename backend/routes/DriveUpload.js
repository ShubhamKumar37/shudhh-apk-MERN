const {uploadMainFile} = require("../controllers/DriveUpload");
const express = require("express");

const router = express.Router();

router.post("/upload-file", uploadMainFile);

module.exports = router;