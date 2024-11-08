const {createCategories, getAllCategories} = require('../controllers/Category');
const express = require('express');
const router = express.Router();

router.post('/create-categories', createCategories);
router.get('/get-all-categories', getAllCategories);
module.exports = router;