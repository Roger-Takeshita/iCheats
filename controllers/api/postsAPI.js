const Post = require('../../models/post');
const User = require('../../models/user');
const ObjectID = require('mongodb').ObjectID;

//! All Posts - Find
   const index = function(req, res) {
      Post.find().populate({path: 'user', select: ['givenName', 'familyName', 'post', 'adm', 'avatar', 'comments']}).populate({path:'comments.user', select: ['givenName', 'familyName']}).sort({'createdAt':-1}).exec(function(err, posts) {
         res.json({ posts, currentUser: req.user });
      });
   };

//! One Post - Find
   const showOnePost = function(req, res) {
      Post.findById(req.params.postId)
      .then(post => {
         if (post) {
            res.json(post);
         } else {
            res.status(404).json({error: 'Post not found'});
         }
      })
      .catch(err => {
         res.status(500).json({error: 'Oh no!'});
      });
   };

//! One Post - Update
   const updateOnePost = function(req, res) {
      //!= Still need to be implemented
   };

//+ One Comment - Post
   const newComment = function(req, res) {
      Post.findById({_id: req.params.postId})
      .then(post => {
         if (post) {
            let newId = new ObjectID();            
            post.save(
               post.comments.push({
                  _id: newId,
                  comment: req.body.comment,
                  user: req.user._id
               })
            );
            res.json({
               newCommentId: newId
            });
         } else {
            res.status(404).json({error: 'Post not found'});
         }
      })
      .catch(err => {
         res.status(500).json({error: 'Oh no!'});
      })
   }

//+ One Comment - Find
   const findOneComment = function(req, res) {
      Post.findById({_id: req.params.postId})
      .then(post => {
         if (post) {
            res.json({
               comment: post.comments.id(req.params.commentId),
               postId: req.params.postId
            });
         } else {
            res.status(404).json({error: 'Comment not found'});
         }
      })
      .catch(err => {
         res.status(500).json({error: 'Oh no!'});
      });
   };

//+ One Comment - Update
   const updateOneComment = function(req, res) {
      Post.findById({_id: req.params.postId})
      .then(post => {
         if (post) {
            let comment = post.comments.id(req.params.commentId);
            comment.comment = req.body.comment;
            post.save();
            res.json({
               commentId: comment._id
            });
         } else {
            res.status(404).json({error: 'Comment not found'});
         }
      })
      .catch(err => {
         res.status(500).json({error: 'Oh no!'});
      })
   };

//+ One Comment - Delete
   const deleteOneComment = function(req, res) {
      Post.findById({_id: req.params.postId})
      .then((post) => {
         if (post) {
            let comment = post.comments.id(req.params.commentId)
            comment.remove();
            post.save();
            res.json({
               comment: comment
            });
         } else {
               res.status(404).json({error: 'Comment not found'});
         }
      })
      .catch(err => {
         res.status(500).json({error: 'Oh no!'});
      });
   };

//- One User - Find All Posts
   const findOneUser =  function(req, res) {
      Post.find({'user': req.params.id})
      .then(userPosts => {
         res.json(userPosts);
      })
      .catch(err => {
         res.status(404).json({error: 'User not found'})
      });
   };

//- One User - Update User Info
   const updateOneUser = function(req, res) {
      User.findById(req.params.id)
      .then(user => {
         res.json(user);
      })
      .catch(err =>{
         res.status(500).json({error: "Oh no! Something went wrong"})
      })
   };

//? Export methods/functions to route
   module.exports = {
      index,
      showOnePost,
      updateOnePost,
      findOneUser,
      updateOneUser,
      newComment,
      findOneComment,
      updateOneComment,
      deleteOneComment
   };