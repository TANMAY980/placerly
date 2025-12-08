const multer = require('multer');
const cloudinary = require('../config/cloudinary.config');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

class Uploadfile {
  uploadUserfile(fieldName) {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: (req, file) => {
        const ext = file.originalname.split('.').pop().toLowerCase();
        let subfolder;
        const formats = ['jpeg', 'jpg', 'png', 'webp'];

        if (formats.includes(ext)) {
          subfolder = 'profile image';
        } else if (ext === 'pdf') {
          subfolder = 'pdf';
        } else {
          subfolder = 'csv';
        }

        return {
          folder: `user/${subfolder}`,
          allowed_formats: ['jpeg', 'jpg', 'png', 'webp', 'pdf', 'csv'],
          public_id: file.originalname.split('.')[0],
          overwrite: true,
          resource_type: 'auto',
        };
      },
    });

    const upload = multer({ storage });
    return upload.array(fieldName,5);
  }

  uploadAdminfile(fieldName) {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: (req, file) => {
        const ext = file.originalname.split('.').pop().toLowerCase();
        let subfolder;
        const formats = ['jpeg', 'jpg', 'png', 'webp'];

        if (formats.includes(ext)) {
          subfolder = 'profile image';
        } else if (ext === 'pdf') {
          subfolder = 'pdf';
        } else {
          subfolder = 'csv';
        }

        return {
          folder: `admin/${subfolder}`,
          allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'csv', 'pdf'],
          public_id: file.originalname.split('.')[0],
          overwrite: true,
          resource_type: 'auto',
        };
      },
    });

    const upload = multer({ storage });
    return upload.array(fieldName,5);
  };

  uploadSingleAdminfile(fieldName) {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: (req, file) => {
        const ext = file.originalname.split('.').pop().toLowerCase();
        let subfolder;
        const formats = ['jpeg', 'jpg', 'png', 'webp'];

        if (formats.includes(ext)) {
          subfolder = 'profile image';
        } else if (ext === 'pdf') {
          subfolder = 'pdf';
        } else {
          subfolder = 'csv';
        }

        return {
          folder: `admin/${subfolder}`,
          allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'csv', 'pdf'],
          public_id: file.originalname.split('.')[0],
          overwrite: true,
          resource_type: 'auto',
        };
      },
    });

    const upload = multer({ storage });
    return upload.single(fieldName);
  };
  
  uploadSingleUserfile(fieldName) {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: (req, file) => {
        const ext = file.originalname.split('.').pop().toLowerCase();
        let subfolder;
        const formats = ['jpeg', 'jpg', 'png', 'webp'];

        if (formats.includes(ext)) {
          subfolder = 'profile image';
        } else if (ext === 'pdf') {
          subfolder = 'pdf';
        } else {
          subfolder = 'csv';
        }

        return {
          folder: `user/${subfolder}`,
          allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'csv', 'pdf'],
          public_id: file.originalname.split('.')[0],
          overwrite: true,
          resource_type: 'auto',
        };
      },
    });

    const upload = multer({ storage });
    return upload.single(fieldName);
  };
}

module.exports = new Uploadfile();
