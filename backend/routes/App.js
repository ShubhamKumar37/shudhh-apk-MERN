const router = require("express").Router();

const {createApp} = require("../controllers/App");

router.post("/create-app", createApp);


module.exports = router