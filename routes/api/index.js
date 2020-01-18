const express = require('express');
const router = express.Router();
const postAPIRouter = require('./postAPI');

router.use('/post', postAPIRouter);

module.exports = router;