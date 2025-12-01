const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true },
  imageUrl: { type: String },
  imagePublicId: { type: String },
  amount: { type: Number, default: 0 },
  title: { type: String },
  description: { type: String },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Item || mongoose.model('Item', ItemSchema);
