import { useCallback } from 'react';
import type { ChatSession, KubeProject } from '../types.ts';
import { useAuth } from './useAuth.tsx';
import supabase from '../supabaseClient';

export const useChatHistory = () => {
  const { user } = useAuth();

  // Helper function to read chats from storage - not a hook
  const readChatsFromStorage = (userId: string): ChatSession[] => {
    const storedChats = localStorage.getItem(`kube_ai_chats_${userId}`);
    return storedChats ? JSON.parse(storedChats) : [];
  };

  const getChatHistory = useCallback((): ChatSession[] => {
    if (!user) return [];
    // If Supabase is configured, load from DB
    if (supabase) {
      // Note: this is synchronous hook API; return empty and let callers call separately if they want async behavior.
      // For now, read from localStorage sync cache if available.
      const stored = readChatsFromStorage(user.id);
      return stored;
    }

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
    };

    // Save to localStorage cache
    try {
      const chatHistory = readChatsFromStorage(user.id);
      chatHistory.unshift(newChat);
      localStorage.setItem(`kube_ai_chats_${user.id}`, JSON.stringify(chatHistory));
    } catch (e) {
      console.error('Failed to update local chat cache:', e);
    }

    // Also push to Supabase if available
    if (supabase) {
      supabase.from('chats').insert([{ id: newChat.id, user_id: newChat.userId, prompt: newChat.prompt, generated_data: newChat.generatedData, created_at: newChat.createdAt, title: newChat.title }])
        .catch((e) => console.error('Failed to save chat to Supabase:', e));
    }

    return newChat;
  }, [user]);

  const deleteChat = useCallback((chatId: string) => {
    if (!user) return;

    try {
      const chatHistory = readChatsFromStorage(user.id);
      const filtered = chatHistory.filter((chat) => chat.id !== chatId);
      localStorage.setItem(`kube_ai_chats_${user.id}`, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to update local chat cache:', e);
    }

    if (supabase) {
      supabase.from('chats').delete().eq('id', chatId).eq('user_id', user.id).catch((e) => console.error('Failed to delete chat in Supabase:', e));
    }
  }, [user]);

  const getChatById = useCallback((chatId: string): ChatSession | undefined => {
    if (!user) return undefined;
    const chatHistory = readChatsFromStorage(user.id);
    return chatHistory.find((chat) => chat.id === chatId);
  }, [user]);

  const clearAllChats = useCallback(() => {
    if (!user) return;
    localStorage.removeItem(`kube_ai_chats_${user.id}`);
    if (supabase) {
      supabase.from('chats').delete().eq('user_id', user.id).catch((e) => console.error('Failed to clear chats in Supabase:', e));
    }
  }, [user]);

  return {
    getChatHistory,
    saveChat,
    deleteChat,
    getChatById,
    clearAllChats,
  };
};
