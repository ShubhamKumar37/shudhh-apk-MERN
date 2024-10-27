const router = require("express").Router();

const { uploadFile, deleteFile, updateFile } = require("../controllers/Upload");

router.post("/upload-file", uploadFile);
router.put("/delete-file", deleteFile);
router.put("/update-file", updateFile);

module.exports = router;