import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from 'sonner';
import { useDispatch } from "react-redux";
import { AtSign, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { twMerge } from 'tailwind-merge';

// --- IMPORTS ---
import { authApi, LoginFormData, TLoginResponse } from "../../features/login/loginAPI";
import { setCredentials } from "../../features/users/userSlice";
import authImage from "../../assets/imageses/loginimageatmwalimu.png";
import { optimizedSources } from '../../utils/imagePaths';

// --- VALIDATION SCHEMA (UNCHANGED) ---
const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
});

// --- ERROR TYPE INTERFACES (UNCHANGED) ---
interface LoginErrorData {
    message?: string;
    error?: string;
    errors?: Array<{ field?: string; message?: string }>;
}
interface LoginApiError {
    data?: LoginErrorData;
    status?: number;
}
// --- END OF TYPES ---

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUser, { isLoading: isMutationLoading }] = authApi.useLoginUserMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
      resolver: yupResolver(schema)
    });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setIsSubmitting(true);
    let toastId: string | number | undefined;

    try {
      toastId = toast.loading("Logging in, please stand by...");
      
      const response = await loginUser(data).unwrap() as TLoginResponse;

      if (!response.tokens?.accessToken || !response.user) {
        toast.error("Invalid login response from server.", { id: toastId });
        setIsSubmitting(false);
        return;
      }
      
      dispatch(setCredentials(response));

      toast.success("Login successful! Redirecting...", { id: toastId });
      
      // --- NAVIGATION LOGIC (UPDATED WITH YOUR DATABASE ROLES) ---
      setTimeout(() => {
        const role = response.user.role?.toLowerCase();
        
        // This switch now handles all the specific roles you provided.
        // All these roles are directed to the main authenticated area of your app.
        switch (role) {
          case 'admin':
          case 'teacher':
          case 'student':
          case 'lecturer':
          case 'tutor':
          case 'blogger':
          case 'user': // Assuming standard users also have a dashboard view
            navigate('/dashboard');
            break;
          
          // The default case is a fallback for any other scenario.
          default:
            navigate('/');
            break;
        }
      }, 1500);

    } catch (err: unknown) {
      if (import.meta.env.DEV) {
        console.error("Login Error Details:", err);
      }
      let errorMessageToShowOnToast = "Login failed. Please check your connection or try again later.";
      if (typeof err === 'object' && err !== null) {
        const apiError = err as LoginApiError;
        if (apiError.status && (apiError.status >= 400 && apiError.status < 500)) {
            if (apiError.data?.message) {
              errorMessageToShowOnToast = apiError.data.message;
            } else {
              errorMessageToShowOnToast = "Invalid email or password. Please try again.";
            }
        } else if (!apiError.status) {
             errorMessageToShowOnToast = "Network error. Unable to connect to the server.";
        }
      }
      toast.error(errorMessageToShowOnToast, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isMutationLoading || isSubmitting;
  const mergeClasses = (...classes: string[]) => twMerge(classes.filter(Boolean).join(' '));

  return (
    // --- JSX (UNCHANGED) ---
    <div className="min-h-screen flex flex-col lg:flex-row">
      <Toaster position="top-right" richColors />
      <nav className="bg-white shadow-md w-full fixed top-0 left-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="self-center text-2xl font-bold text-blue-700 whitespace-nowrap">@mwalimu</span>
          </Link>
          <div className="hidden lg:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</Link>
          </div>
        </div>
      </nav>
      <div className="min-h-screen flex flex-col lg:flex-row pt-20">
        <div className="relative lg:w-1/2 lg:h-screen flex flex-col items-start justify-start bg-gray-900 p-8">
          <picture className="w-full">
            <source type="image/avif" srcSet={optimizedSources('src/assets/imageses','loginimageatmwalimu').avifSrcSet} />
            <source type="image/webp" srcSet={optimizedSources('src/assets/imageses','loginimageatmwalimu').webpSrcSet} />
            <img src={optimizedSources('src/assets/imageses','loginimageatmwalimu').fallback} onError={(e)=>{ (e.currentTarget as HTMLImageElement).src = authImage }} alt="A student engaged in learning on the @mwalimu platform" className="w-full h-auto object-contain flex-shrink-0" />
          </picture>
          <div className="absolute bottom-12 left-12 p-4 hidden lg:block">
              <h2 className="text-4xl font-bold text-white leading-tight">Your Journey to Knowledge Starts Here.</h2>
              <p className="text-lg text-white/80 mt-4 max-w-lg">The best resources for Kenyan learners, curated by the community.</p>
          </div>
        </div>
        <div className="lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16">
          <div className="w-full max-w-md">
            <div className="text-center lg:text-left mb-8">
               <h1 className="text-4xl font-extrabold text-gray-800 leading-tight">
                 <span className="text-blue-600">Welcome Back!</span>
               </h1>
               <p className="mt-3 text-gray-600 text-lg">Sign in to dive back into your learning.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className={mergeClasses(
                    "w-full pl-10 pr-12 py-3 bg-gray-50 border rounded-lg focus:ring-2 transition-all duration-300",
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  )}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 absolute left-0 right-0 text-center lg:text-left">
                    {errors.email?.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your Secure Password"
                  className={mergeClasses(
                    "w-full pl-10 pr-12 py-3 bg-gray-50 border rounded-lg focus:ring-2 transition-all duration-300",
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  )}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center pr-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 absolute left-0 right-0 text-center lg:text-left">
                    {errors.password?.message}
                  </p>
                )}
              </div>
              <div className="text-right -mt-2">
                <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                className={mergeClasses(
                  "w-full py-3.5 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center",
                  isLoading ? "bg-blue-700" : ""
                )}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin h-5 w-5 mr-3 border-t-2 border-r-2 border-white rounded-full"></span>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    <span>Login</span>
                  </>
                )}
              </button>
              <div className="text-center pt-2">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-bold text-blue-600 hover:underline">
                    Register Now
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;