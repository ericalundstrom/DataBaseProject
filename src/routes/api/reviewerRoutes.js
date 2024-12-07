const express = require('express');
const { ReviewerController } = require('../../controllers/reviewerController.js');

const router = express.Router();

router.post('/review-article', ReviewerController.reviewArticle);

module.exports = router;
