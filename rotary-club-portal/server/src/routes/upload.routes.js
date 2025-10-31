import express from 'express';
import {
  uploadProfilePhoto,
  uploadProjectImage,
  uploadReceipt,
  uploadDocument,
  uploadMultipleFiles,
  deleteUploadedFile,
} from '../controllers/upload.controller.js';
import { protect } from '../middleware/auth.js';
import { checkClubPosition } from '../middleware/checkClubPosition.js';
import {
  uploadProfilePhoto as uploadProfilePhotoMiddleware,
  uploadProjectImage as uploadProjectImageMiddleware,
  uploadReceipt as uploadReceiptMiddleware,
  uploadDocument as uploadDocumentMiddleware,
  uploadMultiple as uploadMultipleMiddleware,
} from '../services/upload.service.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * @route   POST /api/upload/profile-photo
 * @desc    Upload profile photo
 * @access  Private
 */
router.post('/profile-photo', uploadProfilePhotoMiddleware, uploadProfilePhoto);

/**
 * @route   POST /api/upload/project-image
 * @desc    Upload project image
 * @access  Private (Admin only - President, Secretary, Treasurer)
 */
router.post(
  '/project-image',
  checkClubPosition,
  uploadProjectImageMiddleware,
  uploadProjectImage
);

/**
 * @route   POST /api/upload/receipt
 * @desc    Upload payment receipt
 * @access  Private
 */
router.post('/receipt', uploadReceiptMiddleware, uploadReceipt);

/**
 * @route   POST /api/upload/document
 * @desc    Upload document
 * @access  Private
 */
router.post('/document', uploadDocumentMiddleware, uploadDocument);

/**
 * @route   POST /api/upload/multiple
 * @desc    Upload multiple files
 * @access  Private (Admin only - President, Secretary, Treasurer)
 */
router.post('/multiple', checkClubPosition, uploadMultipleMiddleware, uploadMultipleFiles);

/**
 * @route   DELETE /api/upload/:folder/:filename
 * @desc    Delete uploaded file
 * @access  Private (Admin only - President, Secretary, Treasurer)
 */
router.delete('/:folder/:filename', checkClubPosition, deleteUploadedFile);

export default router;
