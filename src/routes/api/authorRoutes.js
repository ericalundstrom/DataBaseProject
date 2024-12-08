const express = require('express');
const { AuthorController } = require('../../controllers/authorController.js');

const router = express.Router();

router.post('/create-article', AuthorController.createArticle);
router.post('/submitted-article', AuthorController.submittedArticle);

module.exports = router;
