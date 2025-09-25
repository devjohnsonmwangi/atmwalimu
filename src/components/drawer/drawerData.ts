import React from 'react';
import {
    LayoutDashboard, // Dashboard Overview
    Library,         // My Purchased Library
    BookMarked,      // Books & Novels Library (A-Z)
    ShoppingCart,    // My Cart
    Upload,          // Upload My Work
    FileCog,         // Admin: Manage Documents
    FileCheck,       // Admin: Review Submissions
    CircleUserRound, // Profile
    Settings as SettingsIcon, // Settings
    LogOut,          // Logout
} from 'lucide-react';
// Type definition for drawer data
export type DrawerData = {
    id: number;
    name: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    link: string;
    adminOnly: boolean;
    category?: 'Admin' | 'Management' | 'User' | 'Legal Tools' | 'Support' | 'General'|'Library';
    iconBgColor: string; // This will hold the hex color code
};


// Type definition for drawer data


// Drawer data tailored specifically for the @mwalimu application
export const drawerData: DrawerData[] = [
    // --- User Category ---
    // The Dashboard Overview link is the primary entry point
    { id: 1, name: 'Dashboard', icon: LayoutDashboard, link: '/dashboard', adminOnly: false, category: 'User', iconBgColor: '#4F46E5' },
    { id: 2, name: 'My Library', icon: Library, link: '/dashboard/library', adminOnly: false, category: 'User', iconBgColor: '#10B981' },
    { id: 3, name: 'My Cart', icon: ShoppingCart, link: '/dashboard/cart', adminOnly: false, category: 'User', iconBgColor: '#F59E42' },
    { id: 4, name: 'Upload My Work', icon: Upload, link: '/dashboard/upload-for-approval', adminOnly: false, category: 'User', iconBgColor: '#6366F1' },

    // --- Library Category ---
    { id: 5, name: 'Books & Novels', icon: BookMarked, link: '/dashboard/our-library', adminOnly: false, category: 'Library', iconBgColor: '#F43F5E' },
    
    // --- Admin Category ---
    { id: 6, name: 'Manage Documents', icon: FileCog, link: '/dashboard/admin/manage-documents', adminOnly: true, category: 'Admin', iconBgColor: '#0EA5E9' },
    { id: 7, name: 'Review Submissions', icon: FileCheck, link: '/dashboard/admin/review-submissions', adminOnly: true, category: 'Admin', iconBgColor: '#F59E42' },
    //manage accounts
    { id: 8, name: 'Manage Accounts', icon: CircleUserRound, link: '/dashboard/accounts', adminOnly: true, category: 'Admin', iconBgColor: '#A21CAF' },
    // --- General Category ---
    { id: 9, name: 'Profile', icon: CircleUserRound, link: '/dashboard/profile', adminOnly: false, category: 'General', iconBgColor: '#A21CAF' },
    { id: 10, name: 'Settings', icon: SettingsIcon, link: '/dashboard/settings', adminOnly: false, category: 'General', iconBgColor: '#64748B' },
    { id: 11, name: 'Logout', icon: LogOut, link: '/dashboard/logout', adminOnly: false, category: 'General', iconBgColor: '#EF4444' },
];

// ... (The rest of your file: filterDrawerByRole, groupDrawerItems, etc. remains the same)

// Role-based access control (RBAC) function
export const filterDrawerByRole = (role: string): DrawerData[] => {
    const normalizedRole = role.toLowerCase();

    // These links are based on the 'link' property in the drawerData above
    const lawyerAccessibleAdminLinks: string[] = [
        'cases',            // Manage Cases
        'appoint',          // Manage Appointments
        'branchappointments',// Branch Appointments
        'listdoc',          // Manage Documents
        'payments',         // Manage Payments
        'payment-portal',   // Process Payments
        'supporttickets',   // View Support Tickets
    ];

    if (normalizedRole === 'admin' || normalizedRole === 'support' || normalizedRole === 'manager') {
        return drawerData;
    }

    if (normalizedRole === 'lawyer') {
        return drawerData.filter((item: DrawerData) => {
            if (!item.adminOnly) { // Accessible to all non-admin roles
                return true;
            }
            // If it's adminOnly, check if it's in the lawyer's specific access list
            if (item.adminOnly && lawyerAccessibleAdminLinks.includes(item.link)) {
                return true;
            }
            return false;
        });
    }

    // Handles both 'user' and 'client' roles
    if (normalizedRole === 'user' || normalizedRole === 'client') {
        return drawerData.filter((item: DrawerData) => !item.adminOnly);
    }

    // Fallback for unrecognized roles: only show Logout
    return drawerData.filter((item: DrawerData) => item.link === 'logout');
};

// --- Optional: Function to group drawer items by category for rendering ---
export type GroupedDrawerData = {
    category: string;
    items: DrawerData[];
};

export const groupDrawerItems = (items: DrawerData[]): GroupedDrawerData[] => {
    const groups: Record<string, DrawerData[]> = {};
    items.forEach((item: DrawerData) => {
        const category = item.category || 'General';
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(item);
    });

    const categoryOrder: Array<DrawerData['category']> = [
        'User',
        'Legal Tools',
        'Admin',
        'Management', 
        'Support',    
        'General'
    ];

    return categoryOrder
        .filter(cat => cat && groups[cat])
        .map(cat => ({
            category: cat as string,
            items: groups[cat as string],
        }));
};