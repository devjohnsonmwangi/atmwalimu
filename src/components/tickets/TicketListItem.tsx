import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

// --- FIX 1: Corrected the import path to be consistent ---
import { SupportTicket } from '../../features/Tickets/AllTickets';

interface TicketListItemProps {
  ticket: SupportTicket;
  linkBasePath: '/dashboard/support-tickets' | '/dashboard/admin/support-tickets'; 
}

/**
 * A single item in the ticket list, designed to be clickable and show a summary.
 */
export const TicketListItem = ({ ticket, linkBasePath }: TicketListItemProps) => {

  const getStatusBadgeClass = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-200 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link to={`${linkBasePath}/${ticket.ticketId}`} className="block w-full">
      <div className="w-full p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          {/* Main ticket info */}
          <div className="flex-1 mb-2 sm:mb-0">
            <p className="text-sm text-gray-500">
              {/* --- FIX 2: Code now correctly accesses the nested user object --- */}
              Ticket #{ticket.ticketId} &bull; From: {ticket.user.fullName}
            </p>
            <h3 className="font-semibold text-lg text-gray-800 mt-1">
              {ticket.subject}
            </h3>
          </div>

          {/* Status Badge */}
          <span
            className={clsx(
              'px-2.5 py-0.5 text-xs font-medium rounded-full self-start sm:self-center',
              getStatusBadgeClass(ticket.status)
            )}
          >
            {/* Capitalize first letter and replace underscores */}
            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('_', ' ')}
          </span>
        </div>
        
        {/* Footer with timestamp */}
        <div className="mt-4 text-right text-sm text-gray-500">
          <p>
            Last updated: {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
          </p>
        </div>
      </div>
    </Link>
  );
};