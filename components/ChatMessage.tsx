import { ChatMessage as ChatMessageType } from '@/types';

interface Props {
  message: ChatMessageType;
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

function extractToolCalls(content: string): { tool?: string; result?: string }[] {
  const toolPattern = /(?:Tool|tool|call|execute):?\s*([A-Za-z_]+)/g;
  const matches = [];
  let match;
  while ((match = toolPattern.exec(content)) !== null) {
    matches.push({ tool: match[1] });
  }
  return matches;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div className={`px-4 py-3 ${isUser ? 'message-user' : 'message-ai'}`}>
          {/* AI Avatar for assistant messages */}
          {!isUser && (
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-500/20">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-900">F</span>
              </div>
              <span className="text-xs font-medium text-amber-400">FinOrchestra CFO</span>
            </div>
          )}

          {/* Message content - preserve line breaks */}
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </div>
        </div>

        {/* Timestamp and status */}
        <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span>{formatTime(message.timestamp)}</span>
          {message.status === 'sending' && (
            <span className="text-amber-500">Sending...</span>
          )}
          {message.status === 'error' && (
            <span className="text-red-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Failed to send
            </span>
          )}
        </div>
      </div>
    </div>
  );
}