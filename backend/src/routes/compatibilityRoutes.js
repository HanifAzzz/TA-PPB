const express = require('express');
const router = express.Router();
const { checkBuildCompatibility } = require('../controllers/compatibilityController');

router.post('/check', checkBuildCompatibility);

module.exports = router;
