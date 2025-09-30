import { useGetUserTicketsQuery, useGetAllTicketsForAdminQuery } from '../../features/Tickets/AllTickets';
import { TicketListItem } from './TicketListItem';
import  Spinner  from '../Spinner';
import { CreateTicketButton } from './CreateTicketButton';

interface SupportTicketListProps {
  isAdmin?: boolean;
}

/**
 * Fetches and displays a list of support tickets based on the user's role.
 * It handles all data states: loading, error, empty, and success.
 */
export const SupportTicketList = ({ isAdmin = false }: SupportTicketListProps) => {
  // --- FIX 1: Call hooks unconditionally at the top level ---
  // Use the `skip` option to ensure only one query runs.
  const userTicketsQuery = useGetUserTicketsQuery(undefined, {
    skip: isAdmin, // Skip this query if isAdmin is true
  });
  
  const adminTicketsQuery = useGetAllTicketsForAdminQuery(undefined, {
    skip: !isAdmin, // Skip this query if isAdmin is false
  });

  // --- FIX 2: Select the correct query result based on the prop ---
  const { 
    data: tickets, 
    isLoading, 
    isError, 
    isSuccess 
  } = isAdmin ? adminTicketsQuery : userTicketsQuery;


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-10">
          <Spinner />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg shadow-sm">
          <p className="font-semibold">An Error Occurred</p>
          <p className="text-sm">Failed to load support tickets. Please try refreshing the page.</p>
        </div>
      );
    }

    if (isSuccess && (!tickets || tickets.length === 0)) {
      return (
        <div className="p-6 text-center text-gray-600 bg-gray-50 rounded-lg shadow-sm">
          <p className="font-semibold">No Tickets Found</p>
          <p className="text-sm">{isAdmin ? 'There are currently no support tickets in the system.' : 'You have not created any support tickets yet.'}</p>
        </div>
      );
    }

    if (isSuccess && tickets) {
      return (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <TicketListItem 
              key={ticket.ticketId} 
              ticket={ticket}
              // This now passes the type check because of the fix in TicketListItem.tsx
              linkBasePath={isAdmin ? '/dashboard/admin/support-tickets' : '/dashboard/support-tickets'}
            />
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-gray-50 min-h-full p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {isAdmin ? 'All Support Tickets' : 'My Support'}
          </h1>
          {!isAdmin && <CreateTicketButton />}
        </header>

        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};