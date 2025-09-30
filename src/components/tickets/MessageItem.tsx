import { format } from 'date-fns';
import clsx from 'clsx';
// Updated import path to be consistent with other files
import { SupportMessage } from '../../features/Tickets/AllTickets'; 

interface MessageItemProps {
  message: SupportMessage;
  isOwnMessage: boolean;
}

/**
 * Renders a single message in a chat-bubble style.
 * Aligns the message to the right if it's from the current user, otherwise to the left.
 */
export const MessageItem = ({ message, isOwnMessage }: MessageItemProps) => {
  // Determine alignment and color based on whether the message is from the logged-in user
  const alignment = isOwnMessage ? 'justify-end' : 'justify-start';
  const bubbleColor = isOwnMessage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800';

  return (
    <div className={clsx('flex w-full', alignment)}>
      <div className="flex flex-col max-w-xs md:max-w-md lg:max-w-lg">
        {/* The main message bubble */}
        <div className={clsx('px-4 py-2 rounded-xl shadow-sm', bubbleColor)}>
          {/* --- FIX: Changed from message.content to message.message --- */}
          <p className="text-sm break-words">{message.message}</p>
        </div>

        {/* Timestamp and author information below the bubble */}
        <div className={clsx('text-xs text-gray-500 mt-1 px-1', { 'text-right': isOwnMessage })}>
          {/* --- FIX: Changed from message.author.fullName to message.sender.fullName --- */}
          <span>{message.sender.fullName}</span> 
          <span className="mx-1">&bull;</span>
          <span>{format(new Date(message.createdAt), 'MMM d, h:mm a')}</span>
        </div>
      </div>
    </div>
  );
};