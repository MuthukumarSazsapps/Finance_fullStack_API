import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getStorage = (filePathToStore = '../uploads') => {
  return multer.diskStorage({
    destination: function (_, _1, callback) {
      fs.mkdirSync(path.join(__dirname, filePathToStore), { recursive: true });
      callback(null, path.join(__dirname, filePathToStore));
    },
    filename: function (req, file, callback) {
      callback(null, `${Date.now()}-${file.originalname}`);
    },
  });
};

function fileFilter(req, file, callback) {
  if (
    file.mimetype === 'image/webp' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/gif' ||
    file.mimetype === 'image/svg' ||
    file.mimetype === 'image/svg+xml'
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
}

const uploadSingle = (fileKey, filePathToStore) => {
  const storage = getStorage(filePathToStore);
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
  });
  return function (req, res, next) {
    const uploadItem = upload.single(fileKey);
    uploadItem(req, res, function (err) {
      // TODO: Convert this to response handlers
      if (err instanceof multer.MulterError) {
        res.status(500).send(err.message);
        return;
      } else if (err) {
        res.status(500).send(err.message);
        return;
      }
      next();
    });
  };
};

const uploadMultiple = (fileKey, filePathToStore) => {
  return function (req, res, next) {
    const storage = getStorage(filePathToStore);
    const upload = multer({
      storage,
      fileFilter,
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
    });
    const uploadItem = upload.any();
    uploadItem(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(501).send(err.message);
      } else if (err) {
        return res.status(502).send(err.message);
      }
    });
    next();
  };
};

export default { uploadSingle, uploadMultiple };
