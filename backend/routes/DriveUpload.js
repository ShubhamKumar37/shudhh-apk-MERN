const {uploadMainFile, deleteMainFile, updateMainFile} = require("../controllers/DriveUpload");
const express = require("express");

const router = express.Router();

router.post("/upload-file", uploadMainFile);
router.delete("/delete-file", deleteMainFile);
router.put("/update-file", updateMainFile);

module.exports = router;