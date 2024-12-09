const express = require('express');
const { AdminController } = require('../../controllers/AdminController.js');

const router = express.Router();

router.post('/create-submission', AdminController.createSubmission);
router.get('/edit-submission', AdminController.showSubmissions);

router.get('/edit-submission', (req, res) => {
    console.log('Routen /admin/edit-submission anropades');
    res.send('Routen fungerar');
});

module.exports = router;
