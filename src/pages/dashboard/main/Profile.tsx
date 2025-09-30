// src/features/users/UserProfile.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Camera, Linkedin, Loader2, LogIn, Twitter } from 'lucide-react';

// --- Redux & API Imports ---
import { useAppSelector } from '../../../app/hooks';
import { selectCurrentUser, selectIsAuthenticated } from '../../../features/users/userSlice';
import { useGetUserByIdQuery, useUpdateUserMutation, UserUpdatePayload} from '../../../features/users/usersAPI';
import { ProfileSkeleton } from '../../../components/skeltons/ProfileSkeleton';

// --- Cloudinary Configuration ---
// Recommended: Move to environment variables for production
const CLOUDINARY_CLOUD_NAME = 'dw4hohfsr'; // Replace with your Cloudinary cloud name
const CLOUDINARY_UPLOAD_PRESET = 'johnson'; // Replace with your Cloudinary upload preset

// --- Type Definitions ---
interface User {
  fullName: string;
  email: string;
  bio?: string;
  profilePictureUrl?: string | null;
  socialLinks?: {
    twitter?: string;
    linkedIn?: string;
  };
}

interface ProfileHeaderProps {
  user: User;
  imagePreview: string | null;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

interface ProfileFormProps {
  fullName: string;
  setFullName: React.Dispatch<React.SetStateAction<string>>;
  bio: string;
  setBio: React.Dispatch<React.SetStateAction<string>>;
}

interface SocialLinksFormProps {
  socialLinks: { twitter: string; linkedIn: string };
  handleSocialLinkChange: (platform: 'twitter' | 'linkedIn', value: string) => void;
}

// Type for RTK Query error objects for safer error handling
interface ApiError {
  data?: {
    message?: string;
  };
}


// --- Reusable UI Components ---

const PageHeader = () => (
  <div className="text-center py-4">
    <h1 
        className="relative inline-block text-4xl md:text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-3 transition-colors duration-300
                   after:content-[''] after:absolute after:w-0 after:h-1 after:block after:bg-green-500 after:transition-all after:duration-300
                   hover:after:w-full after:left-0 after:bottom-0"
    >
      Manage Your Profile
    </h1>
    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
      This is your personal space. Keep your details, bio, and social links updated so others can get to know you better.
    </p>
  </div>
);

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, imagePreview, onImageChange, fileInputRef }) => (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-black p-8 shadow-md transition-all duration-300 ease-in-out hover:shadow-lg">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200 dark:bg-purple-900 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-pink-200 dark:bg-pink-900 rounded-full opacity-20 animate-pulse delay-75"></div>
      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="relative group w-40 h-40 flex-shrink-0">
          <img
            src={imagePreview || `https://ui-avatars.com/api/?name=${user.fullName.replace(/\s/g, '+')}&background=random&color=fff&font-size=0.5`}
            alt="Profile"
            className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg transition-transform duration-300 group-hover:scale-105"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer"
            aria-label="Change profile picture"
          >
            <Camera className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onImageChange}
            accept="image/png, image/jpeg"
            className="hidden"
          />
        </div>
        <div className="w-full text-center md:text-left pt-4">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-2">
            {user.fullName}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">{user.email}</p>
        </div>
      </div>
    </div>
  );

const ProfileForm: React.FC<ProfileFormProps> = ({ fullName, setFullName, bio, setBio }) => (
  <div className="space-y-6">
    <div>
      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Full Name
      </label>
      <input
        type="text"
        id="fullName"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 dark:text-white"
      />
    </div>
    <div>
      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Bio
      </label>
      <textarea
        id="bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        rows={4}
        placeholder="Tell us a little about yourself"
        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 dark:text-white"
      />
    </div>
  </div>
);

const SocialLinksForm: React.FC<SocialLinksFormProps> = ({ socialLinks, handleSocialLinkChange }) => (
  <div className="space-y-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      Social Links
    </label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Twitter className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        type="text"
        value={socialLinks.twitter}
        onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
        placeholder="https://twitter.com/your_handle"
        className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
      />
    </div>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Linkedin className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        type="text"
        value={socialLinks.linkedIn}
        onChange={(e) => handleSocialLinkChange('linkedIn', e.target.value)}
        placeholder="https://linkedin.com/in/your-profile"
        className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
      />
    </div>
  </div>
);


// --- Main Page Component ---

const UserProfile = () => {
  const navigate = useNavigate();

  // --- Redux State & API Hooks ---
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentUser = useAppSelector(selectCurrentUser);
  const loggedInUserId = currentUser?.userId;
  const { data: user, isLoading, isError, refetch } = useGetUserByIdQuery(loggedInUserId!, { skip: !loggedInUserId });
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // --- Component State ---
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [socialLinks, setSocialLinks] = useState({ twitter: '', linkedIn: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setBio(user.bio || '');
      setImagePreview(user.profilePictureUrl || null);
      setSocialLinks({
        twitter: user.socialLinks?.twitter || '',
        linkedIn: user.socialLinks?.linkedIn || '',
      });
    }
  }, [user]);

  // --- Handlers ---
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB size limit
        toast.error("File is too large. Please select an image under 2MB.");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => { setImagePreview(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (): Promise<string | null> => {
    if (!imageFile) return null;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message || 'Upload failed');
      return data.secure_url;
    } catch (error) {
      console.error("❌ Image upload failed:", error);
      toast.error('Image upload failed.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSocialLinkChange = (platform: 'twitter' | 'linkedIn', value: string) => {
    setSocialLinks(prev => ({ ...prev, [platform]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!loggedInUserId) {
      toast.error("Authentication error. Please log in again.");
      return;
    }

    const loadingToast = toast.loading('Saving your profile...');
    let profilePictureUrl = user?.profilePictureUrl;

    if (imageFile) {
      const cloudinaryUrl = await handleImageUpload();
      if (cloudinaryUrl) {
        profilePictureUrl = cloudinaryUrl;
      } else {
        toast.dismiss(loadingToast);
        return;
      }
    }
    
    const updatePayload: UserUpdatePayload = {
        fullName,
        bio,
        profilePictureUrl: profilePictureUrl ?? undefined,
        socialLinks,
    };
    
    try {
      await updateUser({ userId: loggedInUserId, ...updatePayload }).unwrap();
      toast.dismiss(loadingToast);
      toast.success('Profile updated successfully!');
      refetch();
    } catch (err) {
      toast.dismiss(loadingToast);
      const apiError = err as ApiError;
      const errorMessage = apiError.data?.message || 'Update failed. Please try again.';
      toast.error(errorMessage);
      console.error("❌ Profile update failed:", err);
    }
  };

  // --- Render Logic ---
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Authentication Required</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Please log in to manage your profile.</p>
          <button onClick={() => navigate('/login')} className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
            <LogIn className="mr-2 h-4 w-4" /> Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) return <ProfileSkeleton />;

  if (isError || !user) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error: Could not load profile data. Please try refreshing the page.
      </div>
    );
  }

  const isSaving = isUpdating || isUploading;

  // --- JSX ---
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      
      <header className="sticky top-0 z-20 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="container mx-auto max-w-4xl">
             <PageHeader />
          </div>
      </header>

      <main className="container mx-auto p-4 md:px-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8 mt-4">
          <ProfileHeader 
            user={user} 
            imagePreview={imagePreview} 
            onImageChange={handleImageChange}
            fileInputRef={fileInputRef} 
          />
          
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-8">
            <div className="space-y-6">
              <ProfileForm 
                fullName={fullName} 
                setFullName={setFullName}
                bio={bio}
                setBio={setBio}
              />
              <SocialLinksForm 
                socialLinks={socialLinks}
                handleSocialLinkChange={handleSocialLinkChange}
              />
            </div>
            <div className="flex justify-end mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <button 
                type="submit" 
                disabled={isSaving} 
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default UserProfile;