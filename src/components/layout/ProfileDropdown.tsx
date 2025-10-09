import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector, useDispatch } from 'react-redux';

// --- REDUX & API IMPORTS ---
import { RootState } from '../../app/store';
import { logOut } from '../../features/users/userSlice';
import { usersAPI } from '../../features/users/usersAPI';
import { authApi } from '../../features/login/loginAPI';

// --- ICON IMPORTS ---
import { User, Settings, LogOut } from 'lucide-react';

// --- CONTEXT & HOOKS ---
// Theme is fixed to light-only; ThemeContext provides a no-op toggle.
// ThemeContext remains in place but app is light-only.

// ===================================================================
// --- RESTRUCTURED THEME TOGGLE SUB-COMPONENT ---
// ===================================================================
// Theme toggle removed — app runs light-only.

// ===================================================================
// --- MAIN COMPONENT: The Profile Dropdown ---
// ===================================================================
const ProfileDropdown = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // --- GLOBAL & API STATE ---
    const { user: currentUser } = useSelector((state: RootState) => state.user);
    const userId = currentUser?.userId ? Number(currentUser.userId) : undefined;
    const { data: userData } = usersAPI.useGetUserByIdQuery(userId!, { skip: !userId });
    const [logoutUser, { isLoading: isLoggingOut }] = authApi.useLogoutUserMutation();
    
    // --- LOCAL COMPONENT STATE ---
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Effect to close the dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        const toastId = toast.loading("Logging out...");
        try {
            await logoutUser().unwrap();
            toast.success("Logged out successfully.", { id: toastId });
        } catch (error) {
            console.error("Failed to logout from server:", error);
            toast.error("Logout failed. Please try again.", { id: toastId });
        } finally {
            dispatch(logOut());
            dispatch(usersAPI.util.resetApiState());
            navigate('/login');
        }
    };
    
    // --- RENDER LOGIC ---
    if (!currentUser) {
        return (
            <div className="flex items-center gap-2">
                <Link to="/login" className="btn btn-ghost btn-sm hidden md:inline-flex">Log In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
        );
    }
    
    return (
        <div className="dropdown dropdown-end" ref={dropdownRef}>
            <label 
                tabIndex={0} 
                className="btn btn-ghost btn-circle avatar" 
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <div className="w-8 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={userData?.profilePictureUrl || "/atmwalimulogo.png"} alt="User Avatar" />
                </div>
            </label>
            
            {isOpen && (
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[50] p-2 shadow bg-base-200 rounded-box w-56">
                    <li className="p-2 border-b border-base-300">
                        <p className="font-bold text-base-content truncate" title={userData?.fullName}>{userData?.fullName}</p>
                        <p className="text-xs text-base-content/70 truncate" title={userData?.email}>{userData?.email}</p>
                    </li>
                    <li><Link to="/dashboard/profile"><User className="w-4 h-4"/> Profile</Link></li>
                    <li><Link to="/dashboard/settings"><Settings className="w-4 h-4"/> Settings</Link></li>
                
                    <div className="divider my-1"></div>
                    <li>
                        <button onClick={handleLogout} disabled={isLoggingOut} className="text-error">
                            <LogOut className={`w-4 h-4 ${isLoggingOut ? 'animate-spin' : ''}`} />
                            {isLoggingOut ? 'Logging out...' : 'Logout'}
                        </button>
                    </li>
                </ul>
            )}
        </div>
    );
};

export default ProfileDropdown;