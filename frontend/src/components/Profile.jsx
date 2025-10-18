import { useEffect, useState } from "react"
import axiosClient from "../utils/axiosClient";
import { NavLink } from "react-router";
import { useForm } from 'react-hook-form';
import ProgressChart from "./ProgressChart";
import axios from 'axios';
function Profile() {
    const [details, setDetails] = useState({});
    const [solved, setSolved] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [profileUpload, setprofileUpload] = useState(null);
    const [fetchProfile, setfetchProfile] = useState(null);
    const [deletedImage, setdeleteImage] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);


    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
        setError,
        clearErrors
    } = useForm();

    const selectedFile = watch('imageFile')?.[0];

    const onSubmit = async (data) => {
        const file = data.imageFile[0];
        setUploading(true);

        try {
            const signatureResponse = await axiosClient.get('/profile/create');
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
            })

            const cloudinaryResult = uploadResponse.data;
            const metadataResponse = await axiosClient.post('/profile/save', {
                cloudinaryPublicId: cloudinaryResult.public_id,
                secureUrl: cloudinaryResult.secure_url
            })
            setprofileUpload(metadataResponse.data.ProfileDetails);
            reset()
        }
        catch (err) {
            console.log('Upload Error', err);
            setError('root', {
                type: 'manual',
                message: err.response?.data?.message || 'Upload failed please try again after some time'
            });
        } finally {
            setUploading(false);
        }
    }

    const handleDelete = async () => {
        if (!window.confirm("Are you really want to delete your profile photo?")) return;
        setIsDeleting(true);
        try {
            await axiosClient.delete('/profile/delete');
            setdeleteImage(true);
            setfetchProfile(null);
        }
        catch (err) {
            console.log(err);

        }
        finally {
            setIsDeleting(false);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get('/user/profile');
                setDetails(response.data);
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        const fetchSolvedProblems = async () => {
            try {
                const { data } = await axiosClient.get('/problem/problemSolvedByUser');
                console.log(data);
                setSolved(data);
            } catch (error) {
                console.error('Error fetching solved problems:', error);
            }
        };
        fetchSolvedProblems();
    }, [])


    useEffect(() => {
        const fetchUrl = async () => {
            try {
                const response = await axiosClient.get('/profile/url');
                const { secureUrl } = response.data;
                setfetchProfile(secureUrl);
                setdeleteImage(false);
            }
            catch (err) {
                console.error("Error aa gaya re", err);
                setfetchProfile(null);
            }
        }
        fetchUrl();
    }, [profileUpload, deletedImage])

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-black relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.02'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
            </div>
            <div className="absolute top-10 left-10 sm:top-20 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-gray-800 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
            <div className="absolute bottom-10 right-10 sm:bottom-20 sm:right-20 w-64 h-64 sm:w-96 sm:h-96 bg-gray-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-80 sm:h-80 bg-slate-800 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse animation-delay-4000"></div>

            <div className="container mx-auto p-4 sm:p-6 max-w-7xl relative z-10 bg-blue">
                <div className="backdrop-blur-xl bg-black/20 border border-gray-700/30 rounded-2xl sm:rounded-3xl shadow-2xl mb-6 sm:mb-8 hover:bg-black/30 transition-all duration-500 group">
                    <div className="p-6 sm:p-8 text-center">
                        <div className="relative inline-block mb-4 sm:mb-6">
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 mx-auto">
                                {fetchProfile ? (
                                    <div className="w-full h-full rounded-full overflow-hidden shadow-2xl ring-4 ring-gray-600/50 ring-offset-4 ring-offset-black/20 group-hover:scale-110 transition-transform duration-300">
                                        <img
                                            src={fetchProfile}
                                            alt="Profile"
                                            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white shadow-2xl" style={{ display: 'none' }}>
                                            {details.firstName ? details.firstName.charAt(0).toUpperCase() : '?'}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white shadow-2xl ring-4 ring-gray-600/50 ring-offset-4 ring-offset-black/20 group-hover:scale-110 transition-transform duration-300">
                                        {details.firstName ? details.firstName.charAt(0).toUpperCase() : '?'}
                                    </div>
                                )}

                                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-green-500 rounded-full border-3 sm:border-4 border-black shadow-lg animate-pulse">
                                    <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-75"></div>
                                </div>
                            </div>
                        </div>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            {details.firstName || 'Loading...'}
                        </h1>

                        <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-2 bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-600/30 rounded-full text-gray-300 font-medium text-sm sm:text-base lg:text-lg shadow-lg">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                            {details.role || 'user'}
                        </div>
                        {fetchProfile && (
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600/20 to-red-800/20 hover:from-red-600/30 hover:to-red-800/30 border border-red-600/40 hover:border-red-500/60 rounded-lg text-red-400 hover:text-red-300 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                                >
                                    {isDeleting ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Remove Photo
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                        <div>

                        </div>
                    </div>

                    <div>
                        <div className="backdrop-blur-xl bg-black/10 border border-gray-700/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl mt-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white">Update Profile Picture</h3>
                            </div>

                            <div className="space-y-4">
                                {fetchProfile && (
                                    <div className="bg-gray-800/30 border border-gray-600/30 rounded-xl p-4">
                                        <h4 className="text-sm font-medium text-gray-300 mb-3">Current Profile Picture</h4>
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden ring-2 ring-gray-600/50">
                                                <img
                                                    src={fetchProfile}
                                                    alt="Current Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-green-400 text-sm font-medium">✓ Profile picture set</p>
                                                <p className="text-gray-400 text-xs">Upload a new image to replace current picture</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        {...register('imageFile', {
                                            required: 'Please select an image file',
                                            validate: {
                                                isImage: (files) => {
                                                    if (!files || !files[0]) {
                                                        return 'Please select an image file';
                                                    }
                                                    const file = files[0];
                                                    return file.type.startsWith('image/') || 'Please select a valid image file';
                                                },
                                                fileSize: (files) => {
                                                    if (!files || !files[0]) {
                                                        return true;
                                                    }
                                                    const file = files[0];
                                                    const maxSize = 5 * 1024 * 1024;
                                                    return file.size <= maxSize || 'File size must be less than or equal to 5MB';
                                                }
                                            }
                                        })}
                                        disabled={uploading}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />

                                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${errors.imageFile
                                        ? 'border-red-400/50 bg-red-900/10'
                                        : selectedFile
                                            ? 'border-green-400/50 bg-green-900/10'
                                            : 'border-gray-600/50 bg-gray-800/20 hover:border-blue-400/50 hover:bg-blue-900/10'
                                        }`}>
                                        {selectedFile ? (
                                            <div className="space-y-3">
                                                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mx-auto">
                                                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-green-400 font-medium text-sm">Image Selected</p>
                                                    <p className="text-gray-400 text-xs mt-1">{selectedFile.name}</p>
                                                    <p className="text-gray-500 text-xs">
                                                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                                    </p>
                                                </div>
                                                <div className="mt-3">
                                                    <div className="w-20 h-20 mx-auto rounded-lg overflow-hidden ring-2 ring-green-400/50">
                                                        <img
                                                            src={URL.createObjectURL(selectedFile)}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto">
                                                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-gray-300 font-medium text-sm">Choose Profile Picture</p>
                                                    <p className="text-gray-400 text-xs mt-1">Click to browse or drag & drop</p>
                                                    <p className="text-gray-500 text-xs">Max size: 5MB • JPG, PNG, GIF</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {errors.imageFile && (
                                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/10 border border-red-600/30 rounded-lg p-3">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{errors.imageFile.message}</span>
                                    </div>
                                )}

                                {uploading && (
                                    <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-blue-300 font-medium text-sm">Uploading...</span>
                                            <span className="text-blue-400 font-mono text-sm">Processing</span>
                                        </div>
                                        <div className="w-full bg-gray-800/50 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full animate-pulse w-full"></div>
                                        </div>
                                    </div>
                                )}

                                {errors.root && (
                                    <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-red-400 text-sm">Upload Failed</h4>
                                                <p className="text-red-300 text-sm">{errors.root.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {profileUpload && (
                                    <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-green-400 text-sm mb-1">Upload Successful!</h4>
                                                <p className="text-green-300/80 text-xs">
                                                    Uploaded: {new Date(profileUpload.uploadedAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={uploading || !selectedFile}
                                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${uploading || !selectedFile
                                        ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg hover:shadow-blue-500/25 transform hover:scale-[1.02]'
                                        }`}
                                >
                                    {uploading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Uploading...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            {fetchProfile ? 'Update Profile Picture' : 'Upload Profile Picture'}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6 sm:mb-8 backdrop-blur-xl bg-black/10 border border-gray-700/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Solved Problems</h2>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-600/30 rounded-full self-start sm:self-auto">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-pulse"></div>
                            <span className="text-gray-300 font-bold text-lg sm:text-xl">{solved.length}</span>
                        </div>
                    </div>

                    {solved.length === 0 ? (
                        <div className="backdrop-blur-xl bg-black/20 border border-gray-700/30 rounded-2xl sm:rounded-3xl shadow-2xl hover:bg-black/30 transition-all duration-500">
                            <div className="p-8 sm:p-12 lg:p-16 text-center">
                                <div className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6 animate-bounce">🚀</div>
                                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">No problems solved yet!</h3>
                                <p className="text-gray-400 text-base sm:text-lg mb-6 sm:mb-8">Start solving problems to see them here.</p>
                                <div>
                                    <NavLink to='/'>
                                        <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-600/30 rounded-full text-gray-300 font-medium hover:from-gray-700/40 hover:to-gray-800/40 transition-all duration-300 cursor-pointer text-sm sm:text-base">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                            Get Started
                                        </div>
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                            {solved.map(problem => (
                                <div key={problem._id} className="group backdrop-blur-xl bg-black/20 border border-gray-700/30 rounded-xl sm:rounded-2xl shadow-2xl hover:bg-black/30 hover:border-gray-600/40 transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-3xl">
                                    <div className="p-4 sm:p-6">
                                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                                            <h3 className="text-base sm:text-lg font-bold leading-tight text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-200 group-hover:to-gray-400 group-hover:bg-clip-text transition-all duration-300">
                                                <NavLink
                                                    to={`/problem/${problem._id}`}
                                                    className="line-clamp-2 block"
                                                >
                                                    {problem.title}
                                                </NavLink>
                                            </h3>
                                        </div>

                                        <div className="flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-6">
                                            <div className="flex gap-2 flex-wrap">
                                                <div className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium backdrop-blur-sm border shadow-lg ${problem.difficulty === 'Easy' ? 'bg-green-900/30 border-green-700/40 text-green-300' :
                                                    problem.difficulty === 'Medium' ? 'bg-yellow-900/30 border-yellow-700/40 text-yellow-300' :
                                                        'bg-red-900/30 border-red-700/40 text-red-300'
                                                    }`}>
                                                    {problem.difficulty}
                                                </div>
                                                <div className="px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium bg-gray-800/40 border border-gray-600/40 text-gray-300 backdrop-blur-sm shadow-lg">
                                                    {problem.tags}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-end">
                                                <div className="flex items-center px-2 py-1 sm:px-3 sm:py-1 bg-gray-700/30 border border-gray-600/40 rounded-full text-gray-300 text-xs sm:text-sm font-medium backdrop-blur-sm shadow-lg">
                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Solved
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <ProgressChart progrep={solved} ></ProgressChart>
                </div>
            </div>
        </div>
    )
}

export default Profile;