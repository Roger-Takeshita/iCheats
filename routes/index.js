const express = require('express');
const router = express.Router();
const passport = require('passport');                          //! Require passport package
const mainCtrl = require('../controllers/index');

router.get   ('/', mainCtrl.index);
router.post  ('/', mainCtrl.newPost);
router.put   ('/:postId', mainCtrl.updatePost);
router.delete('/:postId', mainCtrl.deletePost);

router.post  ('/comment/:postId', mainCtrl.newComment);
router.put   ('/comment/:postId/:commentId', mainCtrl.updateComment);
router.delete('/comment/:postId/:commentId', mainCtrl.deleteComment);

router.get('/auth/google', passport.authenticate(
   'google',
   { 
      scope: ['profile', 'email'] 
   }
));

router.get('/oauth2callback', passport.authenticate(
   'google',
   {
      successRedirect : '/',
      failureRedirect : '/  '
   }
));

router.get('/logout', function(req, res){
   req.logout();
   res.redirect('/');
});

module.exports = router;