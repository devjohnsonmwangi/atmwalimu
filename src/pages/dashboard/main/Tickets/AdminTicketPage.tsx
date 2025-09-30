import { Link } from 'react-router-dom';
import { TicketDetailView } from '../../../../components/tickets/TicketDetailView'; // Assuming the path is correct

/**
 * A page component wrapper for viewing any support ticket from an admin's perspective.
 * This component is intended to be used directly in your router configuration.
 */
export const AdminTicketPage = () => {
  return (
    <div>
      {/* Admin-specific navigation */}
      <div className="bg-gray-100 p-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Adjusted width for better layout */}
          <Link
            // --- CHANGE: Updated the link to match the drawerData configuration ---
            to="/dashboard/admin/support-tickets"
            className="text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            &larr; Back to All Tickets (Admin)
          </Link>
        </div>
      </div>
      
      {/* 
        Render the main detail view and pass the `isAdmin` flag.
        This tells the component to use the admin-specific RTK Query hooks.
      */}
      <TicketDetailView isAdmin={true} />
    </div>
  );
};