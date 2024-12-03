const express = require('express');
const { ManageController } = require('../../controllers/manageController.js');

const router = express.Router();

router.post('/register', ManageController.register);

module.exports = router;
