import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create subdirectories
const subdirectories = ['profiles', 'projects', 'receipts', 'documents'];
subdirectories.forEach((subdir) => {
  const dirPath = path.join(uploadsDir, subdir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'documents';
    
    if (file.fieldname === 'profilePhoto') {
      folder = 'profiles';
    } else if (file.fieldname === 'projectImage') {
      folder = 'projects';
    } else if (file.fieldname === 'receipt') {
      folder = 'receipts';
    }
    
    cb(null, path.join(uploadsDir, folder));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

// File filter for validation
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedDocTypes = /pdf|doc|docx|xls|xlsx/;
  
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  // Check file type based on fieldname
  if (file.fieldname === 'profilePhoto' || file.fieldname === 'projectImage') {
    const isValidImage = allowedImageTypes.test(extname.substring(1)) && 
                         mimetype.startsWith('image/');
    if (isValidImage) {
      return cb(null, true);
    } else {
      return cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed!'), false);
    }
  } else if (file.fieldname === 'receipt' || file.fieldname === 'document') {
    const isValidDoc = allowedDocTypes.test(extname.substring(1)) || 
                       allowedImageTypes.test(extname.substring(1));
    if (isValidDoc) {
      return cb(null, true);
    } else {
      return cb(new Error('Only document files (pdf, doc, docx, xls, xlsx) or images are allowed!'), false);
    }
  }
  
  cb(null, true);
};

// Multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

// Helper function to delete file
export const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Helper function to get file URL
export const getFileUrl = (filename, folder) => {
  return `/uploads/${folder}/${filename}`;
};

// Helper function to clean up orphaned files
export const cleanupOrphanedFiles = async (olderThanDays = 30) => {
  try {
    const now = Date.now();
    const threshold = olderThanDays * 24 * 60 * 60 * 1000;
    let deletedCount = 0;

    subdirectories.forEach((subdir) => {
      const dirPath = path.join(uploadsDir, subdir);
      const files = fs.readdirSync(dirPath);

      files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        const age = now - stats.mtimeMs;

        if (age > threshold) {
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      });
    });

    return { success: true, deletedCount };
  } catch (error) {
    console.error('Error cleaning up files:', error);
    return { success: false, error: error.message };
  }
};

// Export middleware for different file types
export const uploadProfilePhoto = upload.single('profilePhoto');
export const uploadProjectImage = upload.single('projectImage');
export const uploadReceipt = upload.single('receipt');
export const uploadDocument = upload.single('document');
export const uploadMultiple = upload.array('files', 5); // Max 5 files

export default upload;
