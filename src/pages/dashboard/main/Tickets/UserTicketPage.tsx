import { Link } from 'react-router-dom';
import { TicketDetailView } from '../../../../components/tickets/TicketDetailView'; // Assuming the path is correct

/**
 * A page component wrapper for viewing a single support ticket from a regular user's perspective.
 * This component is intended to be used directly in your router configuration.
 */
export const UserTicketPage = () => {
  return (
    <div>
      {/* "Back to list" link for user navigation */}
      <div className="bg-gray-100 p-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Adjusted for layout consistency */}
          <Link
            // --- CHANGE: Updated the link to match the drawerData configuration ---
            to="/dashboard/support-tickets"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            &larr; Back to My Support
          </Link>
        </div>
      </div>

      {/* 
        Render the main detail view, which handles all the data fetching and logic.
        `isAdmin` is explicitly false.
      */}
      <TicketDetailView isAdmin={false} />
    </div>
  );
};