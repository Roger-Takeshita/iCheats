const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
   {
      givenName: {
         type: String,
         required: true
      },
      familyName: {
         type: String,
         required: true
      },
      email: String,
      adm: {
         type: Boolean,
         default: false
      },
      avatar: {
         type: String,
         required: true
      },
      googleId: String,
   },
   {
      timestamps: true
   }
);

module.exports = mongoose.model('User', userSchema);