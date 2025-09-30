
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useCreateUserTicketMutation } from '../../features/Tickets/AllTickets';
import  Spinner  from '../Spinner'; // Assuming you have a spinner component

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// CORRECTED: Define validation schema with 'description' to match the backend DTO
const createTicketSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters long').max(255),
  description: z.string().min(10, 'Message must be at least 10 characters long'),
});

type CreateTicketFormInputs = z.infer<typeof createTicketSchema>;

export const CreateTicketModal = ({ isOpen, onClose }: CreateTicketModalProps) => {
  const [createUserTicket, { isLoading, isError }] = useCreateUserTicketMutation();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTicketFormInputs>({
    resolver: zodResolver(createTicketSchema),
  });

  const onSubmit = async (data: CreateTicketFormInputs) => {
    try {
      await createUserTicket(data).unwrap();
      reset();
      onClose();
      // Optionally dispatch a success toast here
    } catch (error) {
      console.error('Failed to create ticket:', error);
      // Optionally dispatch an error toast here
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity">
      <div className="relative w-full max-w-lg p-6 mx-4 bg-white rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 font-bold text-2xl">&times;</button>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Create a New Support Ticket</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              id="subject"
              type="text"
              {...register('subject')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">How can we help?</label>
            <textarea
              // CORRECTED: 'id' and 'register' now use 'description'
              id="description"
              rows={5}
              {...register('description')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>
          
          {isError && <p className="text-sm text-red-600">An unexpected error occurred. Please try again.</p>}

          <div className="flex justify-end pt-4 space-x-3 border-t mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center">
              {isLoading && <Spinner />}
              {isLoading ? 'Submitting...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};