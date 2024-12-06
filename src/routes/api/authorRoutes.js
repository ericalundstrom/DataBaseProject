const express = require('express');
const { AuthorController } = require('../../controllers/authorController.js');

const router = express.Router();

router.post('/create-article', AuthorController.createArticle);

module.exports = router;
