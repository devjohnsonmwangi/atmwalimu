// src/pages/dashboard/main/AdminDashboard/Account.tsx
import {
    User, Mail, Settings, Shield, Trash2, Search, Loader2, RefreshCw, Star, Calendar,
    Link as LinkIcon, Github, Twitter, Linkedin, Briefcase, UserCircle, UserPlus,
    AlertTriangle, Sun, Moon, Table as TableIcon, PieChart as PieChartIcon,
    Filter as FilterIcon
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Toaster, toast } from 'sonner';
import AddClientModal from './registerclients';
import { motion, AnimatePresence } from 'framer-motion';
import { usersAPI, UserApiResponse } from "../../../features/users/usersAPI";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// --- Type Definitions ---
type ExpandedUserApiResponse = UserApiResponse & {
    reputationScore?: number;
    bio?: string;
    socialLinks?: { github?: string; twitter?: string; linkedin?: string; };
    createdAt: string;
};
type UserRole = "admin" | "user" | "teacher" | "lecturer" | "student" | "blogger" | "tutor";
interface ApiErrorResponse { message?: string; error?: string; detail?: string; }
interface RtkQueryError { status?: number | string; data?: ApiErrorResponse | string; }
type Tab = 'dashboard' | 'analytics';

const ITEMS_PER_PAGE = 10;

// --- Constants ---
const ROLES: { value: UserRole; label: string }[] = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'lecturer', label: 'Lecturer' },
    { value: 'student', label: 'Student' },
    { value: 'blogger', label: 'Blogger' },
    { value: 'tutor', label: 'Tutor' },
];
const roleIcons: { [key in UserRole]: React.ElementType } = {
    admin: Shield, teacher: Briefcase, lecturer: Briefcase, student: UserCircle,
    blogger: Mail, tutor: Briefcase, user: User,
};

// --- Reusable Components ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, isConfirming }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; children: React.ReactNode; isConfirming: boolean; }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 text-center">
          <div className="flex justify-center text-red-500 dark:text-red-400 mb-4"><AlertTriangle size={48} strokeWidth={1.5} /></div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">{children}</div>
          <div className="mt-6 flex justify-center gap-4">
            <button onClick={onClose} disabled={isConfirming} className="px-6 py-2.5 text-sm font-semibold bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 rounded-lg transition disabled:opacity-50">Cancel</button>
            <button onClick={onConfirm} disabled={isConfirming} className="px-6 py-2.5 text-sm font-semibold bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:red-600 rounded-lg transition flex items-center justify-center gap-2 w-40 disabled:opacity-50 active:scale-95">{isConfirming ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Delete'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- UPDATED ChangeRoleModal COMPONENT ---
const ChangeRoleModal = ({ isOpen, onClose, onConfirm, user, isUpdating }: { isOpen: boolean; onClose: () => void; onConfirm: (userId: number, newRole: UserRole) => void; user: ExpandedUserApiResponse | null; isUpdating: boolean; }) => {
    const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');

    useEffect(() => {
        if (user) { setSelectedRole(user.role as UserRole); }
    }, [user]);

    if (!isOpen || !user) return null;

    const handleConfirmClick = () => {
        if (selectedRole && selectedRole !== user.role) {
            onConfirm(user.userId, selectedRole);
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    <div className="text-center">
                        <div className="flex justify-center text-indigo-500 dark:text-indigo-400 mb-4"><Shield size={48} strokeWidth={1.5} /></div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Change User Role</h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Update the role for <strong className="text-slate-800 dark:text-slate-100">{user.fullName}</strong>.
                        </p>
                    </div>
                    <div className="mt-6">
                        <label htmlFor="role-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Role</label>
                        <div className="relative">
                            <select
                                id="role-select"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                                className="appearance-none block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 px-4 py-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base text-slate-900 dark:text-slate-100 transition duration-150 ease-in-out"
                            >
                                {ROLES.map(role => (<option key={role.value} value={role.value}>{role.label}</option>))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="http://www.w3.org/2000/svg">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-4">
                        <button onClick={onClose} disabled={isUpdating} className="px-6 py-2.5 text-sm font-semibold bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 rounded-lg transition disabled:opacity-50">Cancel</button>
                        <button onClick={handleConfirmClick} disabled={isUpdating || !selectedRole || selectedRole === user.role} className="px-6 py-2.5 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition flex items-center justify-center w-40 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Update'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---
function Account() {
  const { data: usersData, isLoading: usersLoading, error: usersError, refetch: refetchUsers, isFetching } = usersAPI.useFetchUsersQuery();
  const [updateUserRoleByAdmin, { isLoading: isUpdatingRole }] = usersAPI.useUpdateUserRoleByAdminMutation();
  const [deleteUserMutation, { isLoading: isDeleting }] = usersAPI.useDeleteUserMutation();

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<ExpandedUserApiResponse | null>(null);
  const [userToUpdateRole, setUserToUpdateRole] = useState<ExpandedUserApiResponse | null>(null);
  const [filters, setFilters] = useState({ name: '', email: '', role: '' });
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { document.documentElement.classList.toggle('dark', isDarkMode); localStorage.setItem('theme', isDarkMode ? 'dark' : 'light'); }, [isDarkMode]);

  const handleRegistrationSuccess = () => refetchUsers();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { setFilters({ ...filters, [e.target.name]: e.target.value }); setCurrentPage(1); };
  const handleResetFilters = () => { setFilters({ name: '', email: '', role: '' }); setCurrentPage(1); };

  const getApiErrorMessage = (error: unknown): string => {
    const err = error as RtkQueryError;
    if (err?.data && typeof err.data === 'object' && 'message' in err.data) return err.data.message as string;
    return 'An unexpected server error occurred.';
  };

  const handleConfirmRoleUpdate = async (userId: number, newRole: UserRole) => {
    const user = usersData?.find(u => u.userId === userId);
    if (!user) {
        toast.error("Could not find the user to update.");
        return;
    }

    try {
        await updateUserRoleByAdmin({ userId, role: newRole }).unwrap();
        toast.success(`Role for '${user.fullName}' updated successfully to ${newRole}!`);
        refetchUsers();
    } catch (error) {
        toast.error(`Error updating role: ${getApiErrorMessage(error)}`);
    } finally {
        setUserToUpdateRole(null);
    }
  };

  const executeDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUserMutation(userToDelete.userId).unwrap();
      toast.success(`User '${userToDelete.fullName}' deleted successfully!`);
      setUserToDelete(null);
    } catch (error) {
      toast.error(`Error deleting user: ${getApiErrorMessage(error)}`);
    }
  };

  const filteredUsers = useMemo(() => (usersData as ExpandedUserApiResponse[])?.filter((user) => ((filters.name ? user.fullName.toLowerCase().includes(filters.name.toLowerCase()) : true) && (filters.email ? user.email.toLowerCase().includes(filters.email.toLowerCase()) : true) && (filters.role ? user.role === filters.role : true))) || [], [usersData, filters]);
  const analyticsData = useMemo(() => {
    if (!usersData) return { totalUsers: 0, roleCounts: {}, rolePieData: [] };
    const totalUsers = usersData.length;
    const roleCounts = usersData.reduce((acc, user) => { acc[user.role] = (acc[user.role] || 0) + 1; return acc; }, {} as Record<string, number>);
    const rolePieData = Object.entries(roleCounts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
    return { totalUsers, roleCounts, rolePieData };
  }, [usersData]);
  const paginatedUsers = useMemo(() => filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE), [filteredUsers, currentPage]);
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const getReputationBadge = (score: number = 0) => {
    if (score > 75) return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
    if (score > 40) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
    return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
  };
  const socialIcons: { [key: string]: React.ElementType } = { github: Github, twitter: Twitter, linkedin: Linkedin };

  const HeaderCell: React.FC<{ icon: React.ElementType, text: string }> = ({ icon: Icon, text }) => ( <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap"><div className="flex items-center gap-2"><Icon className="h-4 w-4" />{text}</div></th>);
  const SkeletonRow: React.FC<{ columns: number }> = ({ columns }) => ( <tr>{Array.from({ length: columns }).map((_, idx) => ( <td key={idx} className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div></td> ))}</tr> );
  const TabButton: React.FC<{ text: string; icon: React.ElementType; isActive: boolean; onClick: () => void; }> = ({ text, icon: Icon, isActive, onClick }) => ( <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'}`}><Icon size={16}/>{text}</button> );
  const SummaryCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; iconBgClass: string; }> = ({ title, value, icon: Icon, iconBgClass }) => (
    <div className="bg-white dark:bg-slate-800/50 p-5 rounded-lg border border-slate-200 dark:border-slate-700/50 flex items-center gap-4 shadow-sm">
      <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${iconBgClass}`}><Icon className="w-6 h-6 text-white" /></div>
      <div><p className="text-sm text-slate-500 dark:text-slate-400">{title}</p><p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p></div>
    </div>
  );

  const UserTableRow: React.FC<{ user: ExpandedUserApiResponse }> = ({ user }) => {
    const roleLabel = ROLES.find(r => r.value === user.role)?.label || 'N/A';
    const RoleIcon = roleIcons[user.role as UserRole] || Shield;
    return (
        <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
        <td className="p-4"><div className="flex items-center gap-3">{user.profilePictureUrl ? (<img src={user.profilePictureUrl} alt={user.fullName} className="w-10 h-10 rounded-full object-cover shadow-sm"/>) : (<div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold">{user.fullName?.substring(0, 2).toUpperCase() || 'N/A'}</div>)}<div><div className="font-bold text-slate-800 dark:text-slate-100">{user.fullName}</div><div className="text-xs text-slate-500">{user.email}</div></div></div></td>
        <td className="p-4 text-slate-600 dark:text-slate-300 max-w-xs truncate"><p title={user.bio}>{user.bio || <span className="text-slate-400 italic">No bio</span>}</p></td>
        <td className="p-4">
            <div className="flex items-center gap-2">
                <RoleIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-200">{roleLabel}</span>
            </div>
            <button onClick={() => setUserToUpdateRole(user)} className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-left mt-1">Change Role</button>
        </td>
        <td className="p-4 text-center"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getReputationBadge(user.reputationScore)}`}>{user.reputationScore || 0}</span></td>
        <td className="p-4"><div className="flex gap-3">{user.socialLinks && Object.entries(user.socialLinks).map(([key, value]) => { const Icon = socialIcons[key]; return Icon && value && <a key={key} href={value} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400"><Icon size={18}/></a> })}</div></td>
        <td className="p-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">{formatDate(user.createdAt)}</td>
        <td className="p-4"><button onClick={() => setUserToDelete(user)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-red-100 hover:bg-red-200 dark:bg-red-800/50 dark:text-red-300 dark:hover:bg-red-800" title="Delete User"><Trash2 size={14} />Delete</button></td>
        </motion.tr>
    );
  };

  const UserCard: React.FC<{ user: ExpandedUserApiResponse }> = ({ user }) => {
    const roleLabel = ROLES.find(r => r.value === user.role)?.label || 'N/A';
    const RoleIcon = roleIcons[user.role as UserRole] || Shield;
    return (
        <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800/70 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/80 p-4 flex flex-col space-y-4">
        <div className="flex items-center gap-4">{user.profilePictureUrl ? ( <img src={user.profilePictureUrl} alt={user.fullName} className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-300 dark:ring-indigo-500"/> ) : ( <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold text-lg">{user.fullName?.substring(0, 2).toUpperCase() || 'NA'}</div> )}<div><h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{user.fullName}</h3><a href={`mailto:${user.email}`} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline break-all">{user.email}</a></div></div>
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
            <div className="flex items-center gap-2"><Calendar size={14} className="text-slate-400 flex-shrink-0"/><div><span className="font-semibold text-slate-600 dark:text-slate-400">Joined:</span> {formatDate(user.createdAt)}</div></div>
            <div className="flex items-center gap-2"><Star size={14} className="text-slate-400 flex-shrink-0"/><div><span className="font-semibold text-slate-600 dark:text-slate-400">Reputation:</span> <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getReputationBadge(user.reputationScore)}`}>{user.reputationScore || 0}</span></div></div>
            <div className="col-span-2 flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <div className="flex items-center gap-2"><RoleIcon size={16} className="text-slate-500" /><div><span className="font-semibold text-slate-600 dark:text-slate-400">Role:</span> {roleLabel}</div></div>
                <button onClick={() => setUserToUpdateRole(user)} className="px-3 py-1.5 rounded-md text-xs font-semibold bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-800/50 text-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-800">Change</button>
            </div>
            {user.socialLinks && Object.values(user.socialLinks).some(link => link) && (<div className="col-span-2 flex items-center gap-2"><LinkIcon size={14} className="text-slate-400"/><div className="flex gap-3">{Object.entries(user.socialLinks).map(([key, value]) => { const Icon = socialIcons[key]; return Icon && value && <a key={key} href={value} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400"><Icon size={18}/></a> })}</div></div>)}
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 pt-3 mt-auto flex justify-end"><button onClick={() => setUserToDelete(user)} disabled={isDeleting} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-red-100 hover:bg-red-200 dark:bg-red-800/50 text-red-700 dark:text-red-300 dark:hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed" title="Delete User"><Trash2 size={14} /> Delete</button></div>
        </motion.div>
    );
  };

  const renderDashboardTab = () => (
    <>
      <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
          <div className="w-full"><label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Search Name</label><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/><input type="text" name="name" value={filters.name} onChange={handleInputChange} placeholder="Filter by name..." className={`block w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-inner py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-400 dark:placeholder-slate-500`} /></div></div>
          <div className="w-full"><label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Search Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/><input type="text" name="email" value={filters.email} onChange={handleInputChange} placeholder="Filter by email..." className={`block w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-inner py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-400 dark:placeholder-slate-500`} /></div></div>
          <button onClick={handleResetFilters} className="w-full h-[46px] bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow active:scale-95"><FilterIcon size={16}/> Reset All</button>
        </div>
      </div>
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700/50 styled-scrollbar"><table className="w-full text-sm"><thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"><tr><HeaderCell icon={UserCircle} text="User Details" /><HeaderCell icon={Mail} text="Bio" /><HeaderCell icon={Shield} text="Role" /><HeaderCell icon={Star} text="Reputation" /><HeaderCell icon={LinkIcon} text="Social" /><HeaderCell icon={Calendar} text="Date Joined" /><HeaderCell icon={Settings} text="Actions" /></tr></thead><tbody className="divide-y divide-slate-200 dark:divide-slate-700"><AnimatePresence>{usersLoading ? [1, 2, 3, 4, 5].map(i => <SkeletonRow key={i} columns={7} />) : paginatedUsers.map((user) => <UserTableRow key={user.userId} user={user} />)}</AnimatePresence></tbody></table></div>
      <div className="block lg:hidden space-y-4"><AnimatePresence>{usersLoading ? [1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>) : paginatedUsers.map((user) => <UserCard key={user.userId} user={user} />)}</AnimatePresence></div>
      {totalPages > 1 && (<div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4"><p className="text-sm text-slate-500 dark:text-slate-400">Showing <strong>{paginatedUsers.length}</strong> of <strong>{filteredUsers.length}</strong> results</p><div className="flex items-center gap-2"><button onClick={() => setCurrentPage(p => p > 1 ? p - 1 : p)} disabled={currentPage === 1} className={`px-3 py-1.5 rounded-md text-sm font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed`}>Prev</button><span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Page {currentPage} of {totalPages}</span><button onClick={() => setCurrentPage(p => p < totalPages ? p + 1 : p)} disabled={currentPage === totalPages} className={`px-3 py-1.5 rounded-md text-sm font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed`}>Next</button></div></div>)}
    </>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">User Role Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard title="Total Users" value={analyticsData.totalUsers} icon={User} iconBgClass="bg-blue-500" />
          {Object.entries(analyticsData.roleCounts).map(([role, count]) => {
            const roleInfo = ROLES.find(r => r.value === role);
            const roleColor = { admin: 'bg-red-500', teacher: 'bg-sky-500', lecturer: 'bg-indigo-500', student: 'bg-green-500', blogger: 'bg-amber-500', user: 'bg-slate-500', tutor: 'bg-purple-500' }[role] || 'bg-gray-500';
            return <SummaryCard key={role} title={`${roleInfo?.label || 'Users'}s`} value={count} icon={roleIcons[role as UserRole] || User} iconBgClass={roleColor}/>
          })}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">User Role Distribution</h3>
        <div style={{ height: '400px' }} className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-200 dark:border-slate-700/50">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', borderRadius: '0.5rem', borderColor: isDarkMode ? '#334155' : '#e2e8f0' }} />
              <Legend />
              <Pie data={analyticsData.rolePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} label>{analyticsData.rolePieData.map((_, index) => <Cell key={`cell-${index}`} fill={['#3b82f6', '#ef4444', '#0ea5e9', '#22c55e', '#a855f7', '#6366f1', '#f97316'][index % 7]} />)}</Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Toaster richColors theme={isDarkMode ? 'dark' : 'light'} position="top-right" />
      <div className="p-px bg-slate-100 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200">
        <div className="max-w-screen-2xl mx-auto">
          <header className="flex flex-col sm:flex-row justify-between items-center mb-4 p-2 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">User Management</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm sm:text-base">Add, view, and manage all users.</p>
            </div>
            <div className='flex items-center gap-2'>
              <button onClick={() => setIsAddUserModalOpen(true)} className="font-semibold py-2 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-md flex items-center gap-2 active:scale-95 transition-transform"><UserPlus size={18} /> <span className="hidden sm:inline">New User</span></button>
              <button onClick={() => setIsDarkMode(prev => !prev)} className="p-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300" title="Toggle theme">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
              <button onClick={() => refetchUsers()} disabled={isFetching} className="p-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50" title="Refresh Data"><RefreshCw className={`h-5 w-5 ${isFetching ? 'animate-spin' : ''}`} /></button>
            </div>
          </header>

          <div className="mb-4 p-2"><div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700"><TabButton text="Dashboard" icon={TableIcon} isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} /><TabButton text="Analytics" icon={PieChartIcon} isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} /></div></div>

          <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm ring-1 ring-slate-200 dark:ring-slate-700/50 rounded-2xl shadow-xl p-2 sm:p-3 h-full">
            {usersError ? (<div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-500/30"><AlertTriangle className="mx-auto h-12 w-12 text-red-500 dark:text-red-400 mb-4" /><h3 className="text-lg font-semibold text-red-700 dark:text-red-300">Failed to Load Data</h3><p className="text-sm text-red-600 dark:text-red-400 mt-1">{getApiErrorMessage(usersError)}</p><button onClick={() => refetchUsers()} className="mt-4 px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center justify-center mx-auto active:scale-95"><RefreshCw className="inline mr-2 h-4 w-4"/>Retry</button></div>) : (activeTab === 'dashboard' ? renderDashboardTab() : renderAnalyticsTab())}
          </motion.div>
        </div>
      </div>

      <AddClientModal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} onSuccess={handleRegistrationSuccess} />
      <ConfirmationModal isOpen={!!userToDelete} onClose={() => setUserToDelete(null)} onConfirm={executeDelete} title="Confirm User Deletion" isConfirming={isDeleting}>
        Are you sure you want to permanently delete the user <strong className="text-slate-800 dark:text-slate-100">{userToDelete?.fullName}</strong>? This action cannot be undone.
      </ConfirmationModal>
      <ChangeRoleModal isOpen={!!userToUpdateRole} onClose={() => setUserToUpdateRole(null)} onConfirm={handleConfirmRoleUpdate} user={userToUpdateRole} isUpdating={isUpdatingRole} />
    </>
  );
}

export default Account;