// import multer from 'multer';

// // Configure Multer to store files in memory
// const upload = multer({
//   storage: multer.memoryStorage(),
// });

// export default upload;

import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'CustomerPhotoURL' && !file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed for CustomerPhotoURL'));
    }
    if (file.fieldname === 'CustomerDocumentURL' && file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed for CustomerDocumentURL'));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit files to 5MB
});

export default upload;
