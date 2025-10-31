import path from 'path';
import { fileURLToPath } from 'url';
import { deleteFile, getFileUrl } from '../services/upload.service.js';
import Member from '../models/Member.js';
import Project from '../models/Project.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Upload profile photo
 * @route POST /api/upload/profile-photo
 * @access Private
 */
export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const memberId = req.body.memberId || req.user.memberId;
    
    // Find member
    const member = await Member.findById(memberId);
    if (!member) {
      // Delete uploaded file if member not found
      deleteFile(req.file.path);
      return res.status(404).json({ message: 'Member not found' });
    }

    // Check authorization
    if (member.user.toString() !== req.user.id && req.user.role !== 'admin') {
      deleteFile(req.file.path);
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    // Delete old photo if exists
    if (member.profilePhoto) {
      const oldPhotoPath = path.join(__dirname, '../../', member.profilePhoto);
      deleteFile(oldPhotoPath);
    }

    // Update member with new photo URL
    const photoUrl = getFileUrl(req.file.filename, 'profiles');
    member.profilePhoto = photoUrl;
    await member.save();

    res.status(200).json({
      message: 'Profile photo uploaded successfully',
      data: {
        url: photoUrl,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    if (req.file) {
      deleteFile(req.file.path);
    }
    res.status(500).json({ message: 'Error uploading profile photo', error: error.message });
  }
};

/**
 * Upload project image
 * @route POST /api/upload/project-image
 * @access Private (Admin only)
 */
export const uploadProjectImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const projectId = req.body.projectId;
    
    if (!projectId) {
      deleteFile(req.file.path);
      return res.status(400).json({ message: 'Project ID is required' });
    }

    // Find project
    const project = await Project.findById(projectId);
    if (!project) {
      deleteFile(req.file.path);
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete old image if exists
    if (project.image) {
      const oldImagePath = path.join(__dirname, '../../', project.image);
      deleteFile(oldImagePath);
    }

    // Update project with new image URL
    const imageUrl = getFileUrl(req.file.filename, 'projects');
    project.image = imageUrl;
    await project.save();

    res.status(200).json({
      message: 'Project image uploaded successfully',
      data: {
        url: imageUrl,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    console.error('Error uploading project image:', error);
    if (req.file) {
      deleteFile(req.file.path);
    }
    res.status(500).json({ message: 'Error uploading project image', error: error.message });
  }
};

/**
 * Upload payment receipt
 * @route POST /api/upload/receipt
 * @access Private
 */
export const uploadReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const receiptUrl = getFileUrl(req.file.filename, 'receipts');

    res.status(200).json({
      message: 'Receipt uploaded successfully',
      data: {
        url: receiptUrl,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error('Error uploading receipt:', error);
    if (req.file) {
      deleteFile(req.file.path);
    }
    res.status(500).json({ message: 'Error uploading receipt', error: error.message });
  }
};

/**
 * Upload document
 * @route POST /api/upload/document
 * @access Private
 */
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const documentUrl = getFileUrl(req.file.filename, 'documents');

    res.status(200).json({
      message: 'Document uploaded successfully',
      data: {
        url: documentUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    if (req.file) {
      deleteFile(req.file.path);
    }
    res.status(500).json({ message: 'Error uploading document', error: error.message });
  }
};

/**
 * Upload multiple files
 * @route POST /api/upload/multiple
 * @access Private (Admin only)
 */
export const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedFiles = req.files.map((file) => ({
      url: getFileUrl(file.filename, 'documents'),
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    }));

    res.status(200).json({
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      data: uploadedFiles,
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    if (req.files) {
      req.files.forEach((file) => deleteFile(file.path));
    }
    res.status(500).json({ message: 'Error uploading files', error: error.message });
  }
};

/**
 * Delete file
 * @route DELETE /api/upload/:folder/:filename
 * @access Private (Admin only)
 */
export const deleteUploadedFile = async (req, res) => {
  try {
    const { folder, filename } = req.params;

    const allowedFolders = ['profiles', 'projects', 'receipts', 'documents'];
    if (!allowedFolders.includes(folder)) {
      return res.status(400).json({ message: 'Invalid folder name' });
    }

    const filePath = path.join(__dirname, '../../uploads', folder, filename);
    const deleted = deleteFile(filePath);

    if (deleted) {
      res.status(200).json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
};
