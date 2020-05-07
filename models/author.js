const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Book = require('./book');

const authorSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    country: {
      type: String,
    },
    genre: {
      type: String,
    },
    bio: {
      type: {
        brief: String,
        full: String
      }
    }
});

authorSchema.pre('remove', function(next) {
  Book.find({ author: this.id }, (err, books) => {
    if (err) {
      next(err);
    } else if (books.length > 0) {
      next(new Error('This author has books'));
    } else {
      next();
    }
  })
});

module.exports = mongoose.model('Author', authorSchema);