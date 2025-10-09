import React from 'react';
import {
    // Existing Icons
    LayoutDashboard,
    Library,

    BookMarked,
    ShoppingCart,
    Upload,
    FileCog,
    FileCheck,
    CircleUserRound,
    Settings as SettingsIcon,
    LogOut,
    LifeBuoy,

    // --- NEW ICONS for Article Functionality ---
    Newspaper,    // For viewing all articles
    FilePlus2,    // For creating a new article
    Tags,         // For managing categories/tags
} from 'lucide-react';

// Type definition for drawer data
export type DrawerData = {
    id: number;
    name: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    link: string;
    adminOnly: boolean;
    // --- ADDED 'Content' category ---
    category?: 'Admin' | 'Management' | 'User' | 'Legal Tools' | 'Support' | 'General'|'Library' | 'Content';
    iconBgColor: string;
    //icon name
    iconName?: string;
};

// Drawer data tailored specifically for the @mwalimu application
export const drawerData: DrawerData[] = [
    // --- User Category (NO CHANGES) ---
    { id: 1, name: 'Dashboard', icon: LayoutDashboard, link: '/dashboard', adminOnly: false, category: 'User', iconBgColor: '#4F46E5' },
    { id: 2, name: 'My Library', icon: Library, link: '/dashboard/library', adminOnly: false, category: 'User', iconBgColor: '#10B981' },
    { id: 3, name: 'My Cart', icon: ShoppingCart, link: '/dashboard/cart', adminOnly: false, category: 'User', iconBgColor: '#F59E42' },
    { id: 4, name: 'Upload My Work', icon: Upload, link: '/dashboard/upload-for-approval', adminOnly: false, category: 'User', iconBgColor: '#6366F1' },

    // --- Library Category (NO CHANGES) ---
    { id: 5, name: 'Books & Novels', icon: BookMarked, link: '/dashboard/our-library', adminOnly: false, category: 'Library', iconBgColor: '#F43F5E' },
    
    // ===================================================================
    // --- NEW: CONTENT MANAGEMENT CATEGORY ---
    // ===================================================================
    { id: 14, name: 'Articles', icon: Newspaper, link: '/articles', adminOnly: false, category: 'Content', iconBgColor: '#16A34A' },
    { id: 15, name: 'Create Article', icon: FilePlus2, link: '/articles/create', adminOnly: false, category: 'Content', iconBgColor: '#2563EB' },
    { id: 18, name: 'My Submissions', icon: FilePlus2, link: '/dashboard/my-submissions', adminOnly: false, category: 'Content', iconBgColor: '#0EA5E9' },
    // ===================================================================

    // --- Admin Category (WITH ONE ADDITION) ---
    { id: 6, name: 'Manage Documents', icon: FileCog, link: '/dashboard/admin/manage-documents', adminOnly: true, category: 'Admin', iconBgColor: '#0EA5E9' },
    { id: 7, name: 'Review Submissions', icon: FileCheck, link: '/dashboard/admin/review-submissions', adminOnly: true, category: 'Admin', iconBgColor: '#F59E42' },
    { id: 8, name: 'Manage Accounts', icon: CircleUserRound, link: '/dashboard/accounts', adminOnly: true, category: 'Admin', iconBgColor: '#A21CAF' },
    // --- NEW ADMIN LINK ---
    { id: 16, name: 'Manage Categories', icon: Tags, link: '/dashboard/admin', adminOnly: true, category: 'Admin', iconBgColor: '#7E22CE' },
    { id: 17, name: 'Article Moderation', icon: Newspaper, link: '/dashboard/admin/moderation', adminOnly: true, category: 'Admin', iconBgColor: '#F97316' },


    // --- Support Category (NO CHANGES) ---
    { 
        id: 12, 
        name: 'All Support Tickets',
        icon: LifeBuoy,
        link: '/dashboard/admin/support-tickets',
        adminOnly: true, 
        category: 'Support', 
        iconBgColor: '#38BDF8'
    },
    { 
        id: 13, 
        name: 'My Support',
        icon: LifeBuoy,
        link: '/dashboard/support-tickets', 
        adminOnly: false, 
        category: 'Support', 
        iconBgColor: '#38BDF8'
    },

    // --- General Category (NO CHANGES) ---
    { id: 9, name: 'Profile', icon: CircleUserRound, link: '/dashboard/profile', adminOnly: false, category: 'General', iconBgColor: '#A21CAF' },
    { id: 10, name: 'Settings', icon: SettingsIcon, link: '/dashboard/settings', adminOnly: false, category: 'General', iconBgColor: '#64748B' },
    { id: 11, name: 'Logout', icon: LogOut, link: '/dashboard/logout', adminOnly: false, category: 'General', iconBgColor: '#EF4444' },
];


// Role-based access control (RBAC) function (NO CHANGES NEEDED)
export const filterDrawerByRole = (role: string): DrawerData[] => {
    const normalizedRole = role.toLowerCase();
    if (normalizedRole === 'admin' || normalizedRole === 'support' || normalizedRole === 'manager') {
        return drawerData;
    }
    if (normalizedRole === 'user' || normalizedRole === 'client') {
        return drawerData.filter((item: DrawerData) => !item.adminOnly);
    }
    return drawerData.filter((item: DrawerData) => item.link === '/dashboard/logout');
};


// --- Function to group drawer items by category for rendering ---
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

    // --- UPDATED CATEGORY ORDER TO INCLUDE 'Content' ---
    const categoryOrder: Array<DrawerData['category']> = [
        'User',
        'Library',
        'Content', // <-- Added here for logical UI flow
        'Admin',
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