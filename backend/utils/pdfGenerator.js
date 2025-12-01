// backend/utils/pdfGenerator.js
const PDFDocument = require('pdfkit');

module.exports = function generateFolderPdf(folder, items) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Title
      doc.fontSize(20).text(folder.name, { align: 'left' });
      doc.moveDown();

      doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`);
      doc.moveDown();

      let total = 0;
      items.forEach((it, i) => {
        doc.fontSize(14).text(`${i+1}. ${it.title || 'Untitled'}`);
        doc.fontSize(10).text(`Amount: ₹ ${it.amount || 0} • Date: ${new Date(it.createdAt).toLocaleString()}`);
        if (it.description) doc.text(`Desc: ${it.description}`);
        if (it.imageUrl) doc.text(`Image: ${it.imageUrl}`);
        doc.moveDown();
        total += Number(it.amount || 0);
      });

      doc.moveDown();
      doc.fontSize(16).text(`Total: ₹ ${total}`);
      doc.end();
    } catch (err) { reject(err); }
  });
};
