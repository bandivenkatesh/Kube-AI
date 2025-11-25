import React, { useState, useEffect } from 'react';
import type { ChatSession } from '../types.ts';
import { useChatHistory } from '../hooks/useChatHistory.ts';
import { TrashIcon, ChevronDownIcon, ChevronUpIcon } from './icons.tsx';

interface ChatHistorySidebarProps {
  onSelectChat: (chat: ChatSession) => void;
  currentChatId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  onSelectChat,
  currentChatId,
  isOpen,
  onClose,
}) => {
  const { getChatHistory, deleteChat } = useChatHistory();
  const [chats, setChats] = useState<ChatSession[]>([]);

  useEffect(() => {
    const history = getChatHistory();
    setChats(history);
  }, [getChatHistory]);

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this chat?')) {
      deleteChat(chatId);
      setChats(chats.filter((c) => c.id !== chatId));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-16 left-0 h-[calc(100vh-64px)] w-64 bg-slate-800/95 border-r border-slate-700 overflow-y-auto transition-transform duration-300 z-50 lg:z-0 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h2 className="text-lg font-semibold text-slate-100">Chat History</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          </div>

          <h2 className="hidden lg:block text-lg font-semibold text-slate-100 mb-4">
            Chat History
          </h2>

          {chats.length === 0 ? (
            <p className="text-slate-400 text-sm">No chats yet. Start by generating a new project!</p>
          ) : (
            <div className="space-y-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    onSelectChat(chat);
                    onClose();
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                    currentChatId === chat.id
                      ? 'bg-sky-600/20 border border-sky-500'
                      : 'bg-slate-700/50 hover:bg-slate-700 border border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">
                        {chat.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {formatDate(chat.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(e, chat.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-400 flex-shrink-0"
                      title="Delete chat"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
