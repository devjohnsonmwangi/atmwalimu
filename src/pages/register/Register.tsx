// src/pages/Register.tsx

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from 'sonner';

// Component Imports
//import Navbar from "../../components/navbar/Navbar";
import authImage from "../../assets/imageses/registerimageatmwalimu.png"; 
import { useState } from 'react';
import { usersAPI } from "../../features/users/usersAPI";
import PasswordStrengthIndicator from "../../components/PasswordStrengthIndicator";

// --- TYPE DEFINITIONS ---
type RegisterFormData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

interface ErrorResponse {
    message?: string;
    errors?: Array<{ message?: string }>;
}

// --- VALIDATION SCHEMA ---
const schema = yup.object().shape({
  fullName: yup.string()
    .required("Full name is required")
    .min(3, "Full name must be at least 3 characters long"),
  email: yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),
  phoneNumber: yup.string()
    .matches(/^[0-9]{10,15}$/, "Enter a valid phone number")
    .required("Phone number is required"),
  password: yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required")
});


// --- THE REGISTER COMPONENT ---
const Register = () => {
  const navigate = useNavigate();
  const [createUser, { isLoading }] = usersAPI.useRegisterUserMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: yupResolver(schema), mode: 'onTouched' });
  
  const password = watch("password");

  // Use local asset directly

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    let toastId: string | number | undefined;
    try {
      toastId = toast.loading("Creating your account...");

      const sanitizedData = {
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      };

      await createUser(sanitizedData).unwrap();
      toast.success("Registration successful! Redirecting to login...", { id: toastId });
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const error = err as { data?: ErrorResponse; status?: number };
      console.error("Registration error object:", err);
      let errorMessage = "Registration failed. Please try again.";
      if (typeof error.data?.message === 'string') {
        errorMessage = error.data.message;
      } else if (Array.isArray(error.data?.message)) {
        errorMessage = (error.data.message as string[]).join(', ');
      }
      toast.error(errorMessage, { id: toastId });
    }
  };

  const EyeIcon = ({ slashed }: { slashed?: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
      {slashed ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" />
      ) : (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </>
      )}
    </svg>
  );

  return (
    // The outer container takes the full screen height
    <div className="font-sans h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" richColors />
      {/* <Navbar /> */}

      {/* --- UPDATED LAYOUT CONTAINER --- 
          - On large screens, it's a row and `overflow-hidden` prevents the page from scrolling.
          - `flex-grow` makes it take up all available space below the navbar.
      */}
      <div className="flex flex-grow flex-col lg:flex-row lg:overflow-hidden">
        
        {/* --- UPDATED LEFT CONTENT COLUMN ---
            - `lg:overflow-y-auto` enables internal scrolling on desktop if needed.
            - `lg:items-start` aligns content to the top for natural scrolling.
        */}
        <div className="flex w-full lg:w-1/2 justify-center items-center lg:items-start p-8 lg:p-10 bg-white lg:overflow-y-auto">
            <div className="text-left max-w-lg">
                <h1 className="relative group text-4xl font-extrabold text-gray-800 leading-tight cursor-default">
                  Join the <span className="text-blue-600">@mwalimu</span> Community
                  <span className="absolute bottom-0 left-0 h-1 w-0 bg-green-500 transition-all duration-500 ease-in-out group-hover:w-full"></span>
                </h1>
                <p className="mt-4 text-gray-600 text-lg">
                  Unlock access to countless resources, connect with peers, and accelerate your learning journey.
                </p>
                <div className="mt-8 block w-full">
                  <img loading="lazy" src={authImage} onError={(e)=>{ (e.currentTarget as HTMLImageElement).src = authImage }} alt="Students collaborating" className="w-full h-auto object-contain rounded-lg" />
                </div>
            </div>
        </div>

        {/* --- UPDATED RIGHT FORM COLUMN ---
            - `lg:overflow-y-auto` enables internal scrolling for the form on desktop.
            - `lg:items-start` aligns the form card to the top.
        */}
        <div className="w-full lg:w-1/2 flex justify-center items-center lg:items-start p-4 sm:p-6 lg:overflow-y-auto">
          <div className="card w-full bg-white max-w-md shadow-2xl rounded-2xl transition-all duration-300 hover:shadow-blue-200 my-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="card-body p-6 sm:p-8">
              <h2 className="relative group text-center text-blue-600 text-3xl font-bold mb-6 pb-2 cursor-default">
                Create Your Account
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-0 bg-blue-600 transition-all duration-300 group-hover:w-1/4"></span>
              </h2>

              {/* Form fields */}
              <div className="form-control mb-3">
                <label className="label pb-1 group cursor-pointer">
                  <span className="label-text text-gray-700 font-medium relative">
                    Full Name
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </label>
                <input type="text" placeholder="e.g. Jane Doe" className="input input-bordered w-full transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" {...register("fullName")} />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName?.message}</p>}
              </div>
              <div className="form-control mb-3">
                <label className="label pb-1 group cursor-pointer">
                  <span className="label-text text-gray-700 font-medium relative">
                    Email
                     <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </label>
                <input type="email" placeholder="e.g. jane.doe@example.com" className="input input-bordered w-full transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" {...register("email")} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>}
              </div>
              <div className="form-control mb-3">
                <label className="label pb-1 group cursor-pointer">
                  <span className="label-text text-gray-700 font-medium relative">
                    Phone Number
                     <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </label>
                <input type="tel" placeholder="e.g. 0712345678" className="input input-bordered w-full transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" {...register("phoneNumber")} />
                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber?.message}</p>}
              </div>
              <div className="form-control mb-3">
                 <label className="label pb-1 group cursor-pointer">
                  <span className="label-text text-gray-700 font-medium relative">
                    Password
                     <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="Choose a strong password" className="input input-bordered w-full transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pr-10" {...register("password")} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center">
                    <EyeIcon slashed={showPassword} />
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password?.message}</p>}
                <PasswordStrengthIndicator password={password} />
              </div>
              <div className="form-control mb-4">
                 <label className="label pb-1 group cursor-pointer">
                  <span className="label-text text-gray-700 font-medium relative">
                    Confirm Password
                     <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </label>
                <div className="relative">
                  <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" className="input input-bordered w-full transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pr-10" {...register("confirmPassword")} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center">
                    <EyeIcon slashed={showConfirmPassword} />
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword?.message}</p>}
              </div>

              {/* --- UPDATED BUTTON WITH VISIBLE WHITE TEXT ON LOAD --- */}
              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 border-none w-full transition-transform duration-300 transform hover:scale-105 flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner mr-2"></span>
                      <span className="text-white">Creating Account...</span>
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>

              <div className="text-center mt-4">
                <Link to="/login" className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium">
                  Already have an account? Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;