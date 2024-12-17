// import multer from 'multer';

// const upload = multer({ dest: 'uploads/' });
// export default upload;

import multer from 'multer';

// Configure Multer to store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
});

export default upload;
