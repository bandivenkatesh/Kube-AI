import { useCallback } from 'react';
import type { ChatSession, KubeProject } from '../types.ts';
import { useAuth } from './useAuth.tsx';
import supabase from '../supabaseClient';
import { getUserStorage, setUserStorage, removeUserStorage } from '../utils/sessionManager';

export const useChatHistory = () => {
  const { user } = useAuth();

  // Helper function to read chats from user-scoped storage
  const readChatsFromStorage = (userId: string): ChatSession[] => {
    const storedChats = getUserStorage(userId, 'chats');
    return storedChats ? JSON.parse(storedChats) : [];
  };

  const getChatHistory = useCallback((): ChatSession[] => {
    if (!user) return [];
    return readChatsFromStorage(user.id);
  }, [user]);

  const saveChat = useCallback((prompt: string, generatedData: KubeProject) => {
    if (!user) return null;

    const newChat: ChatSession = {
      id: Date.now().toString(),
      userId: user.id,
      prompt,
      generatedData,
      createdAt: new Date().toISOString(),
      title: prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''),
      lastAccessedAt: new Date().toISOString(),
      starred: false,
      tags: [],
    };

    // Save to user-scoped localStorage cache
    try {
      const chatHistory = readChatsFromStorage(user.id);
      chatHistory.unshift(newChat);
      setUserStorage(user.id, 'chats', JSON.stringify(chatHistory));
    } catch (e) {
      console.error('Failed to update local chat cache:', e);
    }

    // Also push to Supabase if available
    if (supabase) {
      supabase
        .from('chats')
        .insert([{
          id: newChat.id,
          user_id: newChat.userId,
          prompt: newChat.prompt,
          generated_data: newChat.generatedData,
          created_at: newChat.createdAt,
          title: newChat.title,
          last_accessed_at: newChat.lastAccessedAt,
          starred: newChat.starred,
          tags: newChat.tags,
        }])
        .catch((e) => console.error('Failed to save chat to Supabase:', e));
    }

    return newChat;
  }, [user]);

  const deleteChat = useCallback((chatId: string) => {
    if (!user) return;

    try {
      const chatHistory = readChatsFromStorage(user.id);
      const filtered = chatHistory.filter((chat) => chat.id !== chatId);
      setUserStorage(user.id, 'chats', JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to update local chat cache:', e);
    }

    if (supabase) {
      supabase
        .from('chats')
        .delete()
        .eq('id', chatId)
        .eq('user_id', user.id)
        .catch((e) => console.error('Failed to delete chat in Supabase:', e));
    }
  }, [user]);

  const getChatById = useCallback((chatId: string): ChatSession | undefined => {
    if (!user) return undefined;
    const chatHistory = readChatsFromStorage(user.id);
    return chatHistory.find((chat) => chat.id === chatId);
  }, [user]);

  const clearAllChats = useCallback(() => {
    if (!user) return;
    removeUserStorage(user.id, 'chats');
    if (supabase) {
      supabase
        .from('chats')
        .delete()
        .eq('user_id', user.id)
        .catch((e) => console.error('Failed to clear chats in Supabase:', e));
    }
  }, [user]);

  const starChat = useCallback((chatId: string, starred: boolean) => {
    if (!user) return;

    try {
      const chatHistory = readChatsFromStorage(user.id);
      const chat = chatHistory.find((c) => c.id === chatId);
      if (chat) {
        chat.starred = starred;
        setUserStorage(user.id, 'chats', JSON.stringify(chatHistory));
      }
    } catch (e) {
      console.error('Failed to star chat:', e);
    }

    if (supabase) {
      supabase
        .from('chats')
        .update({ starred })
        .eq('id', chatId)
        .catch((e) => console.error('Failed to star chat in Supabase:', e));
    }
  }, [user]);

  const tagChat = useCallback((chatId: string, tags: string[]) => {
    if (!user) return;

    try {
      const chatHistory = readChatsFromStorage(user.id);
      const chat = chatHistory.find((c) => c.id === chatId);
      if (chat) {
        chat.tags = tags;
        setUserStorage(user.id, 'chats', JSON.stringify(chatHistory));
      }
    } catch (e) {
      console.error('Failed to tag chat:', e);
    }

    if (supabase) {
      supabase
        .from('chats')
        .update({ tags })
        .eq('id', chatId)
        .catch((e) => console.error('Failed to tag chat in Supabase:', e));
    }
  }, [user]);

  return {
    getChatHistory,
    saveChat,
    deleteChat,
    getChatById,
    clearAllChats,
    starChat,
    tagChat,
  };
};
