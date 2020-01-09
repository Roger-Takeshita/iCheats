const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/users');

router.get('/posts', usersCtrl.index);
router.post('/', isLoggedIn, usersCtrl.addPost);

function isLoggedIn(req, res, next) {
   if (req.isAuthenticated()) return next();
   res.redirect('/auth/google');
}

module.exports = router;