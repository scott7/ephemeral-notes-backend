const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  note_body: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
  ttl: {
    type: String,
    default: 0,
  }
});

module.exports = mongoose.model('Note', noteSchema);