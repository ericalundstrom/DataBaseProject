const express = require('express');
const { ReviewerController } = require('../../controllers/reviewerController.js');

const router = express.Router();

router.post('/select-filter', ReviewerController.getArticles);

module.exports = router;
