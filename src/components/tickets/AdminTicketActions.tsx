import { useForm } from 'react-hook-form';
import { SupportTicket, useUpdateTicketForAdminMutation } from '../../features/Tickets/AllTickets';

interface AdminTicketActionsProps {
  ticket: SupportTicket;
}

type UpdateFormInputs = {
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
};

export const AdminTicketActions = ({ ticket }: AdminTicketActionsProps) => {
  const [updateTicket, { isLoading }] = useUpdateTicketForAdminMutation();
  const { register, handleSubmit } = useForm<UpdateFormInputs>({
    defaultValues: {
      status: ticket.status,
      priority: ticket.priority,
    },
  });

  const onSubmit = async (data: UpdateFormInputs) => {
    try {
      await updateTicket({ ticketId: ticket.ticketId, data }).unwrap();
      // Optionally show success toast
    } catch (error) {
      console.error('Failed to update ticket:', error);
    }
  };

  return (
    <div className="flex-shrink-0 bg-gray-50 p-3 border-b">
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="status" className="text-xs font-medium text-gray-600">Status</label>
            <select
              id="status"
              {...register('status')}
              className="mt-1 block w-full pl-3 pr-8 py-1 border-gray-300 text-sm rounded-md"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label htmlFor="priority" className="text-xs font-medium text-gray-600">Priority</label>
            <select
              id="priority"
              {...register('priority')}
              className="mt-1 block w-full pl-3 pr-8 py-1 border-gray-300 text-sm rounded-md"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};