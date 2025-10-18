import { useParams } from 'react-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../utils/axiosClient'

function AdminUpload() {
  const { problemId } = useParams();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors
  } = useForm();

  const selectedFile = watch('videoFile')?.[0];

  const onSubmit = async (data) => {
    const file = data.videoFile[0];
    
    setUploading(true);
    setUploadProgress(0);
    clearErrors();

    try {
      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
      const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('public_id', public_id);
      formData.append('api_key', api_key);

      const uploadResponse = await axios.post(upload_url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      const cloudinaryResult = uploadResponse.data;

      const metadataResponse = await axiosClient.post('/video/save', {
        problemId: problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });

      setUploadedVideo(metadataResponse.data.videoSolution);
      reset();
      
    } catch (err) {
      console.error('Upload error:', err);
      setError('root', {
        type: 'manual',
        message: err.response?.data?.message || 'Upload failed. Please try again.'
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-700/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-slate-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl animate-pulse delay-700"></div>
      </div>

      <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
        <div className="w-full max-w-lg">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-100 mb-2">Video Solution Upload</h1>
            <p className="text-gray-400">Upload video explanations for coding problems</p>
          </div>

          {/* Main Upload Card */}
          <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-600/30 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8">
              {/* Upload Icon Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-2xl mb-4">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-100">Upload Video Solution</h2>
              </div>
              
              <div className="space-y-6">
                {/* File Input Section */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300 uppercase tracking-wide">
                    Choose Video File
                  </label>
                  
                  {/* Custom File Upload Area */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="video/*"
                      {...register('videoFile', {
                        required: 'Please select a video file',
                        validate: {
                          isVideo: (files) => {
                            if (!files || !files[0]) return 'Please select a video file';
                            const file = files[0];
                            return file.type.startsWith('video/') || 'Please select a valid video file';
                          },
                          fileSize: (files) => {
                            if (!files || !files[0]) return true;
                            const file = files[0];
                            const maxSize = 100 * 1024 * 1024; // 100MB
                            return file.size <= maxSize || 'File size must be less than 100MB';
                          }
                        }
                      })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploading}
                    />
                    
                    <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                      errors.videoFile 
                        ? 'border-red-400/50 bg-red-900/10' 
                        : selectedFile 
                          ? 'border-green-400/50 bg-green-900/10' 
                          : 'border-gray-600/50 bg-gray-800/20 hover:border-blue-400/50 hover:bg-blue-900/10'
                    }`}>
                      {selectedFile ? (
                        <div className="space-y-2">
                          <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mx-auto">
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-green-400 font-medium">File Selected</p>
                          <p className="text-gray-400 text-sm">Click to change file</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <p className="text-gray-300 font-medium">Drop your video here</p>
                          <p className="text-gray-400 text-sm">or click to browse files</p>
                          <p className="text-gray-500 text-xs">Max size: 100MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {errors.videoFile && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{errors.videoFile.message}</span>
                    </div>
                  )}
                </div>

                {/* Selected File Info */}
                {selectedFile && (
                  <div className="backdrop-blur-md bg-gray-800/30 border border-gray-600/30 rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-blue-300 mb-1">Selected File</h3>
                        <p className="text-sm text-gray-300 truncate mb-1">{selectedFile.name}</p>
                        <p className="text-xs text-gray-400">Size: {formatFileSize(selectedFile.size)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {uploading && (
                  <div className="backdrop-blur-md bg-blue-900/20 border border-blue-600/30 rounded-2xl p-5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-blue-300 font-medium">Uploading...</span>
                      <span className="text-blue-400 font-mono text-sm">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-300 ease-out" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {errors.root && (
                  <div className="backdrop-blur-md bg-red-900/20 border border-red-600/30 rounded-2xl p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-red-400">Upload Failed</h4>
                        <p className="text-red-300 text-sm">{errors.root.message}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {uploadedVideo && (
                  <div className="backdrop-blur-md bg-green-900/20 border border-green-600/30 rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-green-400 mb-2">Upload Successful!</h4>
                        <div className="space-y-1 text-sm">
                          <p className="text-green-300">Duration: {formatDuration(uploadedVideo.duration)}</p>
                          <p className="text-green-300/80">Uploaded: {new Date(uploadedVideo.uploadedAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={uploading || !selectedFile}
                    className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                      uploading || !selectedFile
                        ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg hover:shadow-blue-500/25 transform hover:scale-[1.02]'
                    }`}
                  >
                    {uploading ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading Video...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Upload Video
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              Supported formats: MP4, AVI, MOV, WMV • Maximum file size: 100MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUpload;