import { useParams } from 'react-router-dom';
import { useGetUserTicketByIdQuery, useGetTicketByIdForAdminQuery } from '../../features/Tickets/AllTickets'; // Corrected the import path to match previous examples

import  Spinner  from '../Spinner'; // Adjusted import path
import { MessageThread } from './MessageThread';
import { AddMessageForm } from './AddMessageForm';
import { AdminTicketActions } from './AdminTicketActions';

interface TicketDetailViewProps {
  isAdmin?: boolean;
}

export const TicketDetailView = ({ isAdmin = false }: TicketDetailViewProps) => {
  const { id } = useParams<{ id: string }>();

  // --- FIX 1: Handle undefined ID and ensure it's a number ---
  // The 'id' from useParams can be undefined if the route isn't matched correctly.
  // We must handle this case before passing it to hooks or parseInt.
  const ticketId = id ? parseInt(id, 10) : undefined;

  // --- FIX 2: Call hooks unconditionally at the top level ---
  // We use the `skip` option to conditionally execute the query.
  // This follows the "Rules of Hooks" by ensuring hooks are always called.
  const userTicketQuery = useGetUserTicketByIdQuery(ticketId!, {
    skip: isAdmin || !ticketId, // Skip if isAdmin is true OR if there's no ticketId
  });

  const adminTicketQuery = useGetTicketByIdForAdminQuery(ticketId!, {
    skip: !isAdmin || !ticketId, // Skip if isAdmin is false OR if there's no ticketId
  });
  
  // --- FIX 3: Select the correct query result to use ---
  // Based on the isAdmin flag, we choose which result object to work with.
  const { data: ticket, isLoading, isError } = isAdmin ? adminTicketQuery : userTicketQuery;
  
  // Handle the case where the ID is invalid from the URL
  if (!ticketId) {
    return <div className="p-6 text-center text-red-600">Error: Invalid Ticket ID provided in the URL.</div>;
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><Spinner /></div>;
  }

  if (isError || !ticket) {
    return <div className="p-6 text-center text-red-600">Error: Ticket not found or you do not have permission to view it.</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="flex-shrink-0 bg-white shadow-sm z-10 p-4 border-b">
        <h1 className="text-xl font-bold text-gray-900 truncate">{ticket.subject}</h1>
        <p className="text-sm text-gray-500">
          Ticket #{ticket.ticketId} &bull; Status: <span className="font-semibold">{ticket.status}</span>
        </p>
      </header>
      
      {/* Admin Actions Panel (conditional) */}
      {isAdmin && <AdminTicketActions ticket={ticket} />}

      {/* Message Area */}
      <main className="flex-1 overflow-y-auto p-4">
        <MessageThread messages={ticket.messages} />
      </main>

      {/* Message Input Form */}
      <footer className="flex-shrink-0 p-4 bg-white border-t">
        <AddMessageForm ticketId={ticket.ticketId} isAdmin={isAdmin} />
      </footer>
    </div>
  );
};