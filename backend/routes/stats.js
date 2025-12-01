// backend/routes/stats.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Item = require('../models/Item');

router.get('/monthly', auth, async (req, res) => {
  try {
    // aggregate items by month (createdAt) for the logged-in user
    // we need folder-user mapping, so join via Folder in Item — but simpler approach:
    // find items belonging to user's folders: first find folder ids
    const mongoose = require('mongoose');
    const Folder = require('../models/Folder');

    const folders = await Folder.find({ user: req.user.id, deleted: false }, '_id');
    const folderIds = folders.map(f => f._id);

    const items = await Item.aggregate([
      { $match: { folder: { $in: folderIds }, deleted: false } },
      { $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }},
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    // map to friendly format
    const result = items.map(i => ({
      year: i._id.year,
      month: i._id.month,
      total: i.total,
      count: i.count
    }));

    res.json(result);
  } catch (err) { console.error(err); res.status(500).json({ msg: 'Server error' }); }
});

module.exports = router;
