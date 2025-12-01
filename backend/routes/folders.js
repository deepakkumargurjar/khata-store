const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Folder = require('../models/Folder');
const Item = require('../models/Item');
const cloudinary = require('cloudinary').v2;
const shortid = require('shortid');
const pdfGenerator = require('../utils/pdfGenerator'); // we'll add this util

// create folder (unchanged)
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ msg: 'Name required' });
    const newFolder = new Folder({ name, user: req.user.id });
    const saved = await newFolder.save();
    return res.json(saved);
  } catch (err) {
    console.error(err); return res.status(500).json({ msg: 'Server error' });
  }
});

// list non-deleted folders
router.get('/', auth, async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.user.id, deleted: false }).sort({ createdAt: -1 });
    return res.json(folders);
  } catch (err) { console.error(err); return res.status(500).json({ msg: 'Server error' }); }
});

// get single folder
router.get('/:id', auth, async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder || folder.deleted) return res.status(404).json({ msg: 'Folder not found' });
    if (String(folder.user) !== String(req.user.id)) return res.status(403).json({ msg: 'Not allowed' });
    return res.json(folder);
  } catch (err) { console.error(err); return res.status(500).json({ msg: 'Server error' }); }
});

// share token generation (creates token and returns share URL)
router.post('/:id/share', auth, async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder || folder.deleted) return res.status(404).json({ msg: 'Folder not found' });
    if (String(folder.user) !== String(req.user.id)) return res.status(403).json({ msg: 'Not allowed' });

    // create token
    const token = shortid.generate();
    folder.shareToken = token;
    await folder.save();
    const publicUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/share/${token}`;
    return res.json({ token, url: publicUrl });
  } catch (err) { console.error(err); return res.status(500).json({ msg: 'Server error' }); }
});

// get folder by share token (public)
router.get('/share/token/:token', async (req, res) => {
  try {
    const folder = await Folder.findOne({ shareToken: req.params.token, deleted: false });
    if (!folder) return res.status(404).json({ msg: 'Not found' });
    // return public items too
    const items = await Item.find({ folder: folder._id, deleted: false }).sort({ createdAt: -1 });
    return res.json({ folder, items });
  } catch (err) { console.error(err); return res.status(500).json({ msg: 'Server error' }); }
});

// soft-delete folder (goes to trash)
router.delete('/:id', auth, async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) return res.status(404).json({ msg: 'Folder not found' });
    if (String(folder.user) !== String(req.user.id)) return res.status(403).json({ msg: 'Not allowed' });

    folder.deleted = true;
    folder.deletedAt = new Date();
    await folder.save();

    // mark items deleted
    await Item.updateMany({ folder: folder._id }, { deleted: true, deletedAt: new Date() });

    return res.json({ msg: 'Folder moved to trash' });
  } catch (err) { console.error(err); return res.status(500).json({ msg: 'Server error' }); }
});

// restore folder from trash
router.post('/:id/restore', auth, async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) return res.status(404).json({ msg: 'Folder not found' });
    if (String(folder.user) !== String(req.user.id)) return res.status(403).json({ msg: 'Not allowed' });

    folder.deleted = false;
    folder.deletedAt = null;
    await folder.save();

    await Item.updateMany({ folder: folder._id }, { deleted: false, deletedAt: null });
    return res.json({ msg: 'Folder restored' });
  } catch (err) { console.error(err); return res.status(500).json({ msg: 'Server error' }); }
});

// permanent delete (hard delete)
router.delete('/:id/permanent', auth, async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) return res.status(404).json({ msg: 'Folder not found' });
    if (String(folder.user) !== String(req.user.id)) return res.status(403).json({ msg: 'Not allowed' });

    const items = await Item.find({ folder: folder._id });
    for (const it of items) {
      try { if (it.imagePublicId) await cloudinary.uploader.destroy(it.imagePublicId); } catch(e){ console.error(e); }
    }

    await Item.deleteMany({ folder: folder._id });
    await folder.deleteOne();
    return res.json({ msg: 'Folder permanently deleted' });
  } catch (err) { console.error(err); return res.status(500).json({ msg: 'Server error' }); }
});

// PDF export for folder (sends PDF)
router.get('/:id/export/pdf', auth, async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) return res.status(404).json({ msg: 'Folder not found' });
    if (String(folder.user) !== String(req.user.id)) return res.status(403).json({ msg: 'Not allowed' });

    const items = await Item.find({ folder: folder._id, deleted: false }).sort({ createdAt: -1 });

    // pdfGenerator should return a Buffer or stream
    const pdfBuffer = await pdfGenerator(folder, items); // implement in utils
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${folder.name}.pdf"`);
    res.send(pdfBuffer);
  } catch (err) { console.error(err); return res.status(500).json({ msg: 'Server error' }); }
});

module.exports = router;
