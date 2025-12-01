// backend/routes/items.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('cloudinary').v2;
const Item = require('../models/Item');
const Folder = require('../models/Folder');

const upload = multer({ storage: multer.memoryStorage() });

// Create item (with optional image upload)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { folderId, amount = 0, title, description } = req.body;
    if (!folderId) return res.status(400).json({ msg: 'folderId is required' });

    const folder = await Folder.findById(folderId);
    if (!folder || folder.deleted) return res.status(404).json({ msg: 'Folder not found' });
    if (String(folder.user) !== String(req.user.id)) return res.status(403).json({ msg: 'Not allowed' });

    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      // upload to cloudinary via stream
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'image_money_app' }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const item = new Item({
      folder: folderId,
      imageUrl,
      imagePublicId,
      amount: Number(amount) || 0,
      title,
      description
    });

    await item.save();
    return res.json(item);
  } catch (err) {
    console.error('Create item error', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// Get items for a folder (only owner)
router.get('/folder/:folderId', auth, async (req, res) => {
  try {
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId);
    if (!folder || folder.deleted) return res.status(404).json({ msg: 'Folder not found' });
    if (String(folder.user) !== String(req.user.id)) return res.status(403).json({ msg: 'Not allowed' });

    const items = await Item.find({ folder: folderId, deleted: false }).sort({ createdAt: -1 });
    const total = items.reduce((s, it) => s + (it.amount || 0), 0);
    return res.json({ items, total });
  } catch (err) {
    console.error('Get items error', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// Get single item (only owner of folder)
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item || item.deleted) return res.status(404).json({ msg: 'Item not found' });

    const folder = await Folder.findById(item.folder);
    if (!folder) return res.status(404).json({ msg: 'Folder for item not found' });
    if (String(folder.user) !== String(req.user.id)) return res.status(403).json({ msg: 'Not allowed' });

    return res.json(item);
  } catch (err) {
    console.error('Get item error', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// Update item (title, amount, description) and optionally replace image
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, amount, description } = req.body;
    const item = await Item.findById(req.params.id);
    if (!item || item.deleted) return res.status(404).json({ msg: 'Item not found' });

    const folder = await Folder.findById(item.folder);
    if (!folder) return res.status(404).json({ msg: 'Folder not found' });
    if (String(folder.user) !== String(req.user.id)) return res.status(403).json({ msg: 'Not allowed' });

    // If new image provided, upload and destroy old one
    if (req.file) {
      // upload new
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'image_money_app' }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      // destroy old image (best-effort)
      if (item.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(item.imagePublicId);
        } catch (e) {
          console.error('Cloudinary destroy failed (non-fatal):', e);
        }
      }

      item.imageUrl = result.secure_url;
      item.imagePublicId = result.public_id;
    }

    if (title !== undefined) item.title = title;
    if (amount !== undefined) item.amount = Number(amount) || 0;
    if (description !== undefined) item.description = description;

    await item.save();
    return res.json(item);
  } catch (err) {
    console.error('Update item error', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// Delete item (destroy cloud image if any, then remove)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Item not found' });

    const folder = await Folder.findById(item.folder);
    if (!folder) return res.status(404).json({ msg: 'Folder not found' });
    if (String(folder.user) !== String(req.user.id)) return res.status(403).json({ msg: 'Not allowed' });

    if (item.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(item.imagePublicId);
      } catch (e) {
        console.error('Cloudinary destroy error (non-fatal):', e);
      }
    }

    await item.deleteOne();
    return res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error('Delete item error', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
