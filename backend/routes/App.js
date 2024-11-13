const router = require("express").Router();
const { auth } = require("../middleware/auth");

const {createApp, getAllApp, getSingleApp, deleteApp, updateApp} = require("../controllers/App");
const {updateFile } = require("../controllers/Upload");
const {updateMainFile} = require("../controllers/DriveUpload");

router.post("/create-app", auth, createApp);
router.get("/get-all-apps", getAllApp);
router.get("/get-app/:appId", getSingleApp);
router.delete("/delete-app", auth, deleteApp);
router.put("/update-app/:appId", auth, updateApp);
router.put("/update-file", auth, updateMainFile);
router.put("/update-media", auth, updateFile);



module.exports = router