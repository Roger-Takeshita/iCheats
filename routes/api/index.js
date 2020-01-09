const express = require('express');
const router = express.Router();
const postAPIRouter = require('./postAPI');

router.use('/posts', postAPIRouter);

module.exports = router;