const {createCategories} = require('../controllers/Category');
const express = require('express');
const router = express.Router();

router.post('/create-categories', createCategories);
module.exports = router;