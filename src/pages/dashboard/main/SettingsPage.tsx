import React, { useState } from 'react';
import { Bell, AlertTriangle, Trash2 } from 'lucide-react';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';

const SettingsPage: React.FC = () => {
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [inAppAlertsEnabled, setInAppAlertsEnabled] = useState(true);
  const [promotionalUpdatesEnabled, setPromotionalUpdatesEnabled] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleChange = (setter: React.Dispatch<React.SetStateAction<boolean>>, current: boolean) => {
    const next = !current;
    setter(next);
    // TODO: Persist preference via API
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // TODO: call delete account endpoint
      // await deleteAccountApi();
      // For now just simulate
      setTimeout(() => {
        setIsDeleting(false);
        setShowDeleteConfirm(false);
        // TODO: redirect user after account deletion
      }, 800);
    } catch (err) {
      console.error('Failed to delete account', err);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 sm:p-8 text-white">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm sm:text-base text-blue-100 mt-2 opacity-90">Manage your preferences and account.</p>
        </header>

        <div className="p-6 sm:p-10 space-y-10">
          <section aria-labelledby="notifications-heading">
            <div className="bg-gray-50/50 rounded-lg shadow-md overflow-hidden border border-gray-200/80">
              <div className="p-5 sm:p-6 border-b border-gray-200">
                <h2 id="notifications-heading" className="text-xl font-semibold text-gray-800 flex items-center">
                  <Bell className="w-6 h-6 mr-2 text-blue-600" aria-hidden="true" />
                  Notifications
                </h2>
                <p className="text-sm text-gray-500 mt-1">Control how you receive updates from the platform.</p>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="p-5 sm:p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-800">Email Notifications</h3>
                    <p className="text-sm text-gray-500 mt-1">Receive important updates via email.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleChange(setEmailNotificationsEnabled, emailNotificationsEnabled)}
                    className={`${emailNotificationsEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    role="switch"
                    aria-checked={emailNotificationsEnabled}
                  >
                    <span className={`${emailNotificationsEnabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                  </button>
                </div>

                <div className="p-5 sm:p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-800">In-App Alerts</h3>
                    <p className="text-sm text-gray-500 mt-1">Show notifications within the application.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleChange(setInAppAlertsEnabled, inAppAlertsEnabled)}
                    className={`${inAppAlertsEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    role="switch"
                    aria-checked={inAppAlertsEnabled}
                  >
                    <span className={`${inAppAlertsEnabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                  </button>
                </div>

                <div className="p-5 sm:p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-800">Promotional Updates</h3>
                    <p className="text-sm text-gray-500 mt-1">Receive occasional news and offers.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleChange(setPromotionalUpdatesEnabled, promotionalUpdatesEnabled)}
                    className={`${promotionalUpdatesEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    role="switch"
                    aria-checked={promotionalUpdatesEnabled}
                  >
                    <span className={`${promotionalUpdatesEnabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="account-actions-heading">
            <div className="bg-red-50 rounded-lg shadow-md overflow-hidden border border-red-200">
              <div className="p-5 sm:p-6 border-b border-red-200">
                <h2 id="account-actions-heading" className="text-xl font-semibold text-red-800 flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-2 text-red-600" aria-hidden="true" />
                  Account Actions
                </h2>
                <p className="text-sm text-red-600 mt-1">Manage your account status. Proceed with caution.</p>
              </div>
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <div>
                  <h3 className="text-base font-medium text-red-800">Delete Account</h3>
                  <p className="text-sm text-red-600 mt-1 max-w-md">Permanently remove your account and all associated data. This action cannot be undone.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition duration-150 ease-in-out flex-shrink-0 w-full sm:w-auto"
                >
                  <Trash2 className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                  Delete My Account
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you absolutely sure you want to delete your account? This action is irreversible and will permanently remove all your data."
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default SettingsPage;
