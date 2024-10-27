const router = require("express").Router();

const { uploadFile } = require("../controllers/Upload");

router.post("/upload", uploadFile);

module.exports = router;