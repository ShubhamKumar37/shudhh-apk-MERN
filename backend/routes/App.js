const router = require("express").Router();

const {createApp, getAllApp, getSingleApp, deleteApp} = require("../controllers/App");

router.post("/create-app", createApp);
router.get("/get-all-apps", getAllApp);
router.get("/get-app/:appId", getSingleApp);
router.delete("/delete-app", deleteApp);


module.exports = router