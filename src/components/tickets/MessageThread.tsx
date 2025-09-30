
// Imports for accessing the Redux store
import { useAppSelector } from '../../app/hooks'; // Assuming you have a hooks file for typed selectors
import { selectCurrentUser } from '../../features/users/userSlice'; // Assuming a selector for the user

// Corrected import path for the SupportMessage type
import { SupportMessage } from '../../features/Tickets/AllTickets';
import { MessageItem } from './MessageItem';

interface MessageThreadProps {
  messages: SupportMessage[];
}

/**
 * Renders the list of messages in a ticket.
 * It determines which messages are from the current user to align them correctly.
 */
export const MessageThread = ({ messages }: MessageThreadProps) => {
  // --- FIX 1: Get the current user from the Redux store ---
  // This replaces the hardcoded `currentUserId = 1`.
  // We use optional chaining `?.` in case the user object is not yet loaded.
  const currentUser = useAppSelector(selectCurrentUser);
  const currentUserId = currentUser?.userId;

  // Handle case where there are no messages yet
  if (!messages || messages.length === 0) {
    return (
      <div className="text-center text-gray-500 p-8">
        <p>This is the beginning of your conversation.</p>
        <p className="text-sm">Messages will appear here as they are sent.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <MessageItem
          key={message.messageId}
          message={message}
          // --- FIX 2: Compare against message.sender.userId ---
          // This correctly checks if the message sender is the currently logged-in user.
          isOwnMessage={message.sender.userId === currentUserId}
        />
      ))}
    </div>
  );
};