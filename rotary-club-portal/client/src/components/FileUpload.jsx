import { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const FileUpload = ({ 
  endpoint, 
  fieldName = 'file',
  accept = 'image/*',
  maxSize = 10, // MB
  onSuccess,
  onError,
  additionalData = {},
  label = 'Upload File',
  description = 'Click to browse or drag and drop',
  showPreview = true,
}) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error'
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    // Validate file size
    const fileSizeMB = selectedFile.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setUploadStatus('error');
      setMessage(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    setFile(selectedFile);
    setUploadStatus(null);
    setMessage('');

    // Generate preview for images
    if (showPreview && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadStatus(null);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append(fieldName, file);

      // Add any additional data
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadStatus('success');
      setMessage(response.data.message || 'File uploaded successfully!');
      
      if (onSuccess) {
        onSuccess(response.data.data);
      }

      // Reset after 2 seconds
      setTimeout(() => {
        setFile(null);
        setPreview(null);
        setUploadStatus(null);
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setMessage(error.response?.data?.message || 'Upload failed. Please try again.');
      
      if (onError) {
        onError(error);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setUploadStatus(null);
    setMessage('');
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-200 mb-2">{label}</label>
      
      {/* Upload Area */}
      {!file && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-gray-600 bg-white/5 hover:bg-white/10'
          }`}
        >
          <input
            type="file"
            accept={accept}
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center gap-3">
            <Upload className={`w-12 h-12 ${isDragging ? 'text-blue-400' : 'text-gray-400'}`} />
            <div className="text-center">
              <p className="text-white font-medium">{description}</p>
              <p className="text-gray-400 text-sm mt-1">
                {accept} • Max {maxSize}MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* File Preview */}
      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
          >
            <div className="flex items-start gap-4">
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{file.name}</p>
                <p className="text-gray-400 text-sm">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>

              {!uploading && !uploadStatus && (
                <button
                  onClick={handleRemove}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-red-400" />
                </button>
              )}
            </div>

            {/* Upload Button */}
            {!uploadStatus && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload File
                  </>
                )}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${
              uploadStatus === 'success'
                ? 'bg-green-500/20 border border-green-500/30'
                : 'bg-red-500/20 border border-red-500/30'
            }`}
          >
            {uploadStatus === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <p
              className={`text-sm ${
                uploadStatus === 'success' ? 'text-green-300' : 'text-red-300'
              }`}
            >
              {message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;
