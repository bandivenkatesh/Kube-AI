import { useCallback } from 'react';
import type { ChatSession, KubeProject } from '../types.ts';
import { useAuth } from './useAuth.tsx';

export const useChatHistory = () => {
  const { user } = useAuth();

  // Helper function to read chats from storage - not a hook
  const readChatsFromStorage = (userId: string): ChatSession[] => {
    const storedChats = localStorage.getItem(`kube_ai_chats_${userId}`);
    return storedChats ? JSON.parse(storedChats) : [];
  };

  const getChatHistory = useCallback((): ChatSession[] => {
    if (!user) return [];
    return readChatsFromStorage(user.id);
  }, [user]);

  const saveChat = useCallback((prompt: string, generatedData: KubeProject) => {
    if (!user) return null;

    const chatHistory = readChatsFromStorage(user.id);
    const newChat: ChatSession = {
      id: Date.now().toString(),
      userId: user.id,
      prompt,
      generatedData,
      createdAt: new Date().toISOString(),
      title: prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''),
    };

    chatHistory.unshift(newChat); // Add to beginning
    localStorage.setItem(`kube_ai_chats_${user.id}`, JSON.stringify(chatHistory));

    return newChat;
  }, [user]);

  const deleteChat = useCallback((chatId: string) => {
    if (!user) return;

    const chatHistory = readChatsFromStorage(user.id);
    const filtered = chatHistory.filter((chat) => chat.id !== chatId);
    localStorage.setItem(`kube_ai_chats_${user.id}`, JSON.stringify(filtered));
  }, [user]);

  const getChatById = useCallback((chatId: string): ChatSession | undefined => {
    if (!user) return undefined;
    const chatHistory = readChatsFromStorage(user.id);
    return chatHistory.find((chat) => chat.id === chatId);
  }, [user]);

  const clearAllChats = useCallback(() => {
    if (!user) return;
    localStorage.removeItem(`kube_ai_chats_${user.id}`);
  }, [user]);

  return {
    getChatHistory,
    saveChat,
    deleteChat,
    getChatById,
    clearAllChats,
  };
};
