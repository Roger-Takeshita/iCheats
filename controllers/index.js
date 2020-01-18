const Post = require('../models/post');

function index(req, res, next) {
   Post.find().populate({path: 'user', select: ['givenName', 'familyName', 'post', 'adm', 'avatar', 'comments']}).populate({path:'comments.user', select: ['givenName', 'familyName']}).sort({'createdAt':-1}).exec(function(err, posts) {
      res.render('index', {
         title: `iCheats`,
         posts,
         user: req.user,
      });
   });
};

function newPost (req, res) { 
   let post = new Post ({
      post: req.body.text,
      user: req.user._id
   });
   post.save(function(err) {
      if(err) console.log(err);
      res.redirect('/');
   });

};

function updatePost (req, res) {
   Post.findById({_id: req.params.postId}, function(err, post) {
      post.post = req.body.text;
      post.save();
      res.redirect('/');
   })
};

function deletePost (req, res) {
   Post.deleteOne({_id: req.params.postId}, function(err, comment) {      
      if (err) {
         console.log(err);
      } else {
         console.log('One comment was deleted: ' + comment.comment);
         res.redirect('/');
      }
   });
};

function newComment (req, res) {
   Post.findById({_id: req.params.postId}, function(err, post) {
      let comment = {
         comment: req.body.text,
         user: req.user._id
      };
      post.comments.push(comment);
      post.save(function(err) {
         res.redirect('/');
      });
   });
};

function updateComment (req, res) {
   Post.findById({_id: req.params.postId}, function(err, post) {
      let comment = post.comments.id(req.params.commentId);
      comment.comment = req.body.text;
      post.save();
      res.redirect('/');
   })
};

function deleteComment (req, res) {   
   Post.findById({_id: req.params.postId}, function(err, post) {
      let comment = post.comments.id(req.params.commentId);
      comment.remove();
      post.save();
      res.redirect('/');
   });
};

module.exports = {
   index,
   newPost,
   updatePost,
   deletePost,
   newComment,
   updateComment,
   deleteComment
};