const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema (
   {
      comment: {
         type: String,
         required: true
      },
      user: {
         type: Schema.Types.ObjectId,
         ref: 'User' 
      },
   },
   {
      timestamps: true
   }
);

const postSchema = new Schema (
   {
      post: {
         type: String,
         required: true
      },
      comments: [commentSchema],
      user: {
         type: Schema.Types.ObjectId,
         ref: 'User' 
      },
   },
   {
      timestamps: true
   }
)

module.exports = mongoose.model("Post", postSchema);