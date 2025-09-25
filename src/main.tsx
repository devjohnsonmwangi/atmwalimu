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

// --- IMPORT ALL DOCUMENT & LIBRARY COMPONENTS ---
import AllDocumentsPage from './pages/dashboard/main/managedocs/AllDocumentsPage.tsx';
//import DocumentDetailPage from './pages/dashboard/main/managedocs/DocumentDetailPage.tsx';
//import MyLibraryPage from './pages/dashboard/main/managedocs/MyLibraryPage.tsx';
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

// --- Placeholder Components for General Routes ---
// This is your component for the main dashboard overview
const DashboardPage = () => <div className="p-6"><h1>Dashboard Overview</h1><p>Welcome! This is your main dashboard view.</p></div>;
const UserProfilePage = () => <div className="p-6"><h1>My Profile</h1></div>;
const SettingsPage = () => <div className="p-6"><h1>Settings</h1></div>;
const LogoutComponent = () => <div className="p-6"><h1>Logging out...</h1></div>;

// ===================================================================
// --- FINAL @MWALIMU APP ROUTER DEFINITION ---
// ===================================================================
const router = createBrowserRouter([
  // Standalone Routes
  { path: 'register', element: <Register />, errorElement: <Error /> },
  { path: 'login', element: <Login />, errorElement: <Error /> },
  { path: 'account', element: <Account />, errorElement: <Error /> },
  // Public-Facing Routes
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: 'documents', element: <AllDocumentsPage /> },
      { path: 'featured', element: <FeaturedDocumentsPage /> },
      //{ path: 'documents/:documentId', element: <DocumentDetailPage /> },
    ],
  },

  // Authenticated Dashboard Routes
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    errorElement: <Error />,
    children: [
      // User Routes
      { index: true, element: <DashboardPage /> },
      //{ path: 'my-library', element: <MyLibraryPage /> },
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
      
      // General Routes
      { path: 'profile', element: <UserProfilePage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'logout', element: <LogoutComponent /> },
       { path: 'documents', element: <AllDocumentsPage /> },

      // Shared detail page route
      //{ path: 'documents/:documentId', element: <DocumentDetailPage /> },
    ],
  },

  // Fallback Route
  { path: '*', element: <Error /> }
]);

// ===================================================================
// --- MAIN RENDER FUNCTION ---
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