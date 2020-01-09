const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema(
   {
      history: {
         type: [String]
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

module.exports = mongoose.model('Chat', chatSchema);