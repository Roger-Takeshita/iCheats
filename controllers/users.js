const User = require('../models/user');         //! Require Models Schema

function index(req, res, next) {
   let modelQuery = req.query.name ? {name: new RegExp(req.query.name, 'i')} : {};
   let sortKey = req.query.sort || 'name';
   User.find(modelQuery).sort(sortKey).exec(function(err, users) {
      if (err) return next(err);
      // Passing search values, name & sortKey, for use in the EJS
      res.render('posts/index', { 
         title: `${users[0].givenName} ${users[0].familyName}'s Posts`,
         users,
         user: req.user,
         sortKey 
      });
   });
};

function addPost(req, res, next) {
   req.user.posts.push(req.body);
   req.user.save(function(err) {
      res.redirect('/');
   });
}

module.exports = {
   index,
   addPost
};