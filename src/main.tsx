/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// --- Router Imports ---
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// --- Redux Imports ---
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './app/store.ts';

// --- Core App Structure Imports ---
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import AppWrapper from './AppWrapper.tsx';
import AppLayout from './components/layout/AppLayout.tsx';
import DashboardLayout from './components/layout/DashboardLayout.tsx';
import Account from './pages/dashboard/main/Account.tsx';

// --- Core Page Imports ---
import Home from './pages/landingPage/Home.tsx';
import Register from './pages/register/Register.tsx';
import Login from './pages/login/Login.tsx';
import Error from './pages/Error.tsx';
import About from './pages/landingPage/About';
import ContactPage from './pages/contact';
import HowItWorks from './pages/HowItWorks';
import NotificationsPage from './pages/Notifications';

// --- IMPORT ALL DOCUMENT & LIBRARY COMPONENTS ---
import AllDocumentsPage from './pages/dashboard/main/managedocs/AllDocumentsPage.tsx';
import DocumentDetailPage from './pages/dashboard/main/managedocs/DocumentDetailPage.tsx';
import CartPage from './pages/dashboard/main/managedocs/CartPage.tsx';
import LibraryPage from './pages/dashboard/main/managedocs/LibraryPage.tsx';
import UploadForApprovalPage from './pages/dashboard/main/managedocs/UploadForApprovalPage.tsx';
import FeaturedDocumentsPage from './pages/dashboard/main/managedocs/FeaturedDocumentsPage.tsx';
import PublicLibraryPage from './pages/dashboard/main/managedocs/PublicLibraryPage.tsx';

// --- Admin Document Components ---
import AdminDocumentsPage from './pages/dashboard/main/managedocs/AdminDocumentsPage.tsx';
import UploadDocumentPage from './pages/dashboard/main/managedocs/UploadDocumentPage.tsx';
import EditDocumentPage from './pages/dashboard/main/managedocs/EditDocumentPage.tsx';
import AdminApprovalPage from './pages/dashboard/main/managedocs/AdminApprovalPage.tsx';

// --- SUPPORT TICKET COMPONENTS (NEW/UPDATED) ---
import { SupportTicketList } from './components/tickets/SupportTicketList.tsx';
import { UserTicketPage } from './pages/dashboard/main/Tickets/UserTicketPage.tsx';
import { AdminTicketPage } from './pages/dashboard/main/Tickets/AdminTicketPage.tsx';

// --- Placeholder Components for General Routes ---
//const DashboardPage = () => <div className="p-6"><h1>Dashboard Overview</h1><p>Welcome! This is your main dashboard view.</p></div>;
//dashboardoverview
import DashboardPage from './pages/dashboard/DashboardPage.tsx';
import UserProfilePage from './pages/dashboard/main/Profile.tsx';
import SettingsPage from './pages/dashboard/main/SettingsPage';
import LogoutComponent from './components/logout/logout.tsx';


// ===================================================================
// --- NEW: ARTICLE & ADMIN PAGE IMPORTS ---
// ===================================================================
import ArticleListPage from './pages/dashboard/main/articles/ArticleListPage.tsx';
import ArticleDetailPage from './pages/dashboard/main/articles/ArticleDetailPage.tsx';
import CreateArticlePage from './pages/dashboard/main/articles/CreateArticlePage.tsx';
import EditArticlePage from './pages/dashboard/main/articles/EditArticlePage.tsx';
import AdminDashboardPage from './pages/dashboard/main/articles/AdminDashboardPage.tsx';
import AdminModerationPage from './pages/dashboard/main/articles/AdminModerationPage.tsx';
import MySubmissionsPage from './pages/dashboard/main/articles/MySubmissionsPage.tsx';
import AuthenticatedRoute from './components/auth/AuthenticatedRoute.tsx';
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';
import TermsAndServicesPage from './pages/terms.tsx';
import CookiePolicyPage from './pages/cookies.tsx';
import PrivacyPolicyPage from './pages/privacypolicy.tsx';
// ===================================================================


// ===================================================================
// --- FINAL @MWALIMU APP ROUTER DEFINITION ---
// ===================================================================
const router = createBrowserRouter([
  // Standalone Routes (NO CHANGES HERE)
  { path: 'register', element: <Register />, errorElement: <Error /> },
  { path: 'login', element: <Login />, errorElement: <Error /> },
  { path: 'terms', element: <TermsAndServicesPage />, errorElement: <Error /> },
  //cookies
  {path:'cookies',element:<CookiePolicyPage/>,errorElement:<Error/>},
  {path:'privacy-policy',element:<PrivacyPolicyPage/>,errorElement:<Error/>},
  
  // Public-Facing Routes (ADDED PUBLIC ARTICLE ROUTES)
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
  { path: 'about', element: <About /> },
  { path: 'contact', element: <ContactPage /> },
  { path: 'how-it-works', element: <HowItWorks /> },
      { path: 'documents', element: <AllDocumentsPage /> },
  { path: 'documents/:documentId', element: <DocumentDetailPage /> },
      { path: 'featured', element: <FeaturedDocumentsPage /> },
      
      // --- NEWLY ADDED PUBLIC ARTICLE ROUTES ---
      { path: 'articles', element: <ArticleListPage /> },
      { path: 'articles/:slug', element: <ArticleDetailPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
    ],
  },

  // ===================================================================
  // --- NEW: PROTECTED ROUTES FOR ARTICLE MANAGEMENT ---
  // ===================================================================
  // Authenticated-Only Routes (for creating/editing articles)
  {
    element: <AuthenticatedRoute />,
    errorElement: <Error />,
    children: [
      {
        element: <AppLayout />, // Use the public-facing layout for a consistent feel
        children: [
          { path: 'articles/create', element: <CreateArticlePage /> },
          { path: 'articles/edit/:slug', element: <EditArticlePage /> },
        ]
      }
    ]
  },
  // Admin-Only Routes (for managing categories in the admin dashboard)
  {
    element: <ProtectedRoute />,
    errorElement: <Error />,
    children: [
      {
        element: <DashboardLayout />, // Use the dashboard layout for the admin area
        children: [
            { path: 'dashboard/admin', element: <AdminDashboardPage /> },
      { path: 'dashboard/admin/moderation', element: <AdminModerationPage /> },
        ]
      }
    ]
  },
  // ===================================================================

  // Authenticated Dashboard Routes (NO CHANGES HERE)
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    errorElement: <Error />,
    children: [
      // User Routes
      { index: true, element: <DashboardPage  /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'upload-for-approval', element: <UploadForApprovalPage /> },
      
      // Library Route
      { path: 'library', element: <LibraryPage /> },
      { path: 'our-library', element: <PublicLibraryPage /> },

      // Admin Routes
      { path: 'admin/manage-documents', element: <AdminDocumentsPage /> },
      { path: 'admin/review-submissions', element: <AdminApprovalPage /> },
      { path: 'admin/documents/upload', element: <UploadDocumentPage /> },
      { path: 'admin/documents/edit/:documentId', element: <EditDocumentPage /> },
      { path: 'accounts', element: <Account />, errorElement: <Error /> },
      
      // --- SUPPORT TICKET ROUTES (NEW/UPDATED) ---
      { path: 'support-tickets', element: <SupportTicketList isAdmin={false} /> },
      { path: 'support-tickets/:id', element: <UserTicketPage /> },
      { path: 'admin/support-tickets', element: <SupportTicketList isAdmin={true} /> },
      { path: 'admin/support-tickets/:id', element: <AdminTicketPage /> },

      //dashboard document  this  will  help  in  navigating  to  documents  while  in  the dashbaord 
      { path: 'dashboard/documents', element: <AllDocumentsPage /> },
  { path: 'dashboard/documents/:documentId', element: <DocumentDetailPage /> },
  { path: 'my-submissions', element: <MySubmissionsPage /> },
    

      // General Routes

      { path: 'profile', element: <UserProfilePage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'logout', element: <LogoutComponent /> },
      { path: 'notifications', element: <NotificationsPage /> },
    ],
  },

  // Fallback Route (NO CHANGES HERE)
  { path: '*', element: <Error /> }
]);

// ===================================================================
// --- MAIN RENDER FUNCTION --- (NO CHANGES HERE)
// ===================================================================
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <AppWrapper>
            <RouterProvider router={router} />
          </AppWrapper>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// --- PWA SERVICE WORKER REGISTRATION --- (NO CHANGES HERE)
// ... (code remains the same)

// ===================================================================
// --- PWA SERVICE WORKER REGISTRATION ---
// ===================================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('✅ Service Worker registered successfully with scope:', registration.scope);
      })
      .catch(registrationError => {
        console.error('❌ Service Worker registration failed:', registrationError);
      });
  });
}