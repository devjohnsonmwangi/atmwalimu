
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAddUserMessageMutation, useAddMessageForAdminMutation } from '../../features/Tickets/AllTickets';

interface AddMessageFormProps {
  ticketId: number;
  isAdmin: boolean;
}

// CORRECTED: Changed 'content' to 'message' to match AddMessageDto
const messageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
});

type MessageFormInputs = z.infer<typeof messageSchema>;

export const AddMessageForm = ({ ticketId, isAdmin }: AddMessageFormProps) => {
  const [addUserMessage, { isLoading: isUserLoading }] = useAddUserMessageMutation();
  const [addAdminMessage, { isLoading: isAdminLoading }] = useAddMessageForAdminMutation();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<MessageFormInputs>({
    resolver: zodResolver(messageSchema),
  });

  const isLoading = isUserLoading || isAdminLoading;

  const onSubmit = async (data: MessageFormInputs) => {
    try {
      if (isAdmin) {
        // The payload is { ticketId, data } as expected by the hook
        await addAdminMessage({ ticketId, data }).unwrap();
      } else {
        await addUserMessage({ ticketId, data }).unwrap();
      }
      reset(); // Clear input on successful send
    } catch (error) {
      console.error('Failed to send message:', error);
      // Optionally show an error toast
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex items-start space-x-3">
        <div className="flex-1">
          <input
            type="text"
            // CORRECTED: Register the input as 'message'
            {...register('message')}
            placeholder="Type your message..."
            autoComplete="off"
            disabled={isLoading}
            className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.message && <p className="mt-1 ml-2 text-sm text-red-600">{errors.message.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </form>
  );
};