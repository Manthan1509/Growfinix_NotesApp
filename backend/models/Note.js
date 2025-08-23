const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: String,
  content: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  versions: [
    {
      content: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  sharedKey: { type: String, unique: true, sparse: true } // For shareable links (bonus)
});

module.exports = mongoose.model('Note', NoteSchema);
