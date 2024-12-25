'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Chat from '@/components/Chat/Page';
import { getMessages } from '@/services/chatService';
import { useUserContext } from '@/contexts/UserContext';


export default function ChatLayout() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const { setChat } = useUserContext()

  useEffect(() => {
    const fetchChatMessages = async () => {
      const chatId = searchParams.get('chatId');
      if (chatId) {
        try {
          const chat = await getMessages(chatId);
          setChat(chat.chat);
        } catch (error) {
          console.error('Error fetching chat messages:', error);
        }
      }
    };
  
    fetchChatMessages();
  }, [searchParams]);

  return (
    <>
      <Chat isLoading={isLoading} setIsLoading={setIsLoading} />
    </>
  );
}
