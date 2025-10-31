# File Upload Service

This service handles file uploads for the Rotary Club Portal application using Multer.

## Features

- **Profile Photos**: Upload member profile pictures (max 10MB)
- **Project Images**: Upload project banner images (max 10MB)
- **Payment Receipts**: Upload payment receipts (max 10MB)
- **Documents**: Upload general documents (max 10MB)
- **Multiple Files**: Upload up to 5 files at once (admin only)

## Supported File Types

### Images
- JPEG (.jpeg, .jpg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### Documents
- PDF (.pdf)
- Word (.doc, .docx)
- Excel (.xls, .xlsx)

## Storage Structure

```
server/uploads/
├── profiles/       # Member profile photos
├── projects/       # Project images
├── receipts/       # Payment receipts
└── documents/      # General documents
```

## API Endpoints

### Upload Profile Photo
```
POST /api/upload/profile-photo
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- profilePhoto: File (required)
- memberId: String (optional, defaults to current user's member)
```

### Upload Project Image
```
POST /api/upload/project-image
Authorization: Bearer <token> (Admin only)
Content-Type: multipart/form-data

Body:
- projectImage: File (required)
- projectId: String (required)
```

### Upload Receipt
```
POST /api/upload/receipt
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- receipt: File (required)
```

### Upload Document
```
POST /api/upload/document
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- document: File (required)
```

### Upload Multiple Files
```
POST /api/upload/multiple
Authorization: Bearer <token> (Admin only)
Content-Type: multipart/form-data

Body:
- files: File[] (required, max 5 files)
```

### Delete File
```
DELETE /api/upload/:folder/:filename
Authorization: Bearer <token> (Admin only)

Params:
- folder: String (profiles|projects|receipts|documents)
- filename: String
```

## Usage Example

### Frontend (React with Axios)

```javascript
import api from './services/api';

// Upload profile photo
const uploadProfilePhoto = async (file, memberId) => {
  const formData = new FormData();
  formData.append('profilePhoto', file);
  if (memberId) {
    formData.append('memberId', memberId);
  }

  try {
    const response = await api.post('/upload/profile-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

// Upload receipt
const uploadReceipt = async (file) => {
  const formData = new FormData();
  formData.append('receipt', file);

  try {
    const response = await api.post('/upload/receipt', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};
```

## File Cleanup

The system automatically cleans up orphaned files older than 30 days every Sunday at 3:00 AM using a cron job.

## Security

- All routes require authentication
- Profile photo and receipt uploads: Any authenticated user
- Project image, document, and multiple file uploads: Admin only
- File type validation on upload
- File size limits enforced (10MB max)
- Files are stored with unique names to prevent conflicts

## Error Handling

The service will return appropriate error messages for:
- No file uploaded
- Invalid file type
- File too large
- Member/Project not found
- Unauthorized access

## File Access

Uploaded files are accessible via:
```
GET http://localhost:5000/uploads/:folder/:filename
```

Example:
```
http://localhost:5000/uploads/profiles/john-doe-1234567890-123456789.jpg
```

## Notes

- Files are stored locally in the `server/uploads/` directory
- The uploads directory is excluded from Git (see .gitignore)
- Consider migrating to cloud storage (AWS S3, Cloudinary) for production
- Old profile photos and project images are automatically deleted when replaced
