const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/auth');
const { nanoid } = require('nanoid');
const router = express.Router();

// Create note
router.post('/', auth, async (req, res) => {
  const { title, content, tags } = req.body;
  try {
    const note = new Note({
      title,
      content,
      tags,
      owner: req.user._id,
      versions: [{ content }]
    });
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all notes (by current user, filter by tag)
router.get('/', auth, async (req, res) => {
  const { tag } = req.query;
  const filter = { owner: req.user._id };
  if (tag) filter.tags = tag;
  try {
    const notes = await Note.find(filter);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single note
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, owner: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update note
router.put('/:id', auth, async (req, res) => {
  const { title, content, tags } = req.body;
  try {
    const note = await Note.findOne({ _id: req.params.id, owner: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.title = title;
    note.content = content;
    note.tags = tags;
    note.versions.push({ content });
    await note.save();

    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Shareable view-only link (bonus)
router.get('/shared/:key', async (req, res) => {
  try {
    const note = await Note.findOne({ sharedKey: req.params.key });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ title: note.title, content: note.content, createdAt: note.createdAt, versions: note.versions });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate share link for note (bonus)
router.post('/:id/share', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, owner: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (!note.sharedKey) note.sharedKey = nanoid(10);
    await note.save();
    res.json({ sharedKey: note.sharedKey });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
