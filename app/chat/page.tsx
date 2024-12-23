'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Chat from '@/components/Chat/Page';
import { getSession } from 'next-auth/react';

interface Message {
  id: number;
  text: string;
  type: 'bot' | 'user';
}

interface ApiMessage {
  content: string;
  senderType: 'bot' | 'user';
}

export default function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatID, setChatID] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const chatId = searchParams.get('chatId');
    setChatID(chatId as string)
    if (chatId) {
      fetchMessages(chatId);
    }
  }, [searchParams]);

  const fetchMessages = async (chatId: string) => {
    setIsLoading(true);
    try {
      const session = await getSession();
      if (session && chatId) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/chat/messages?chatId=${chatId}`,
          {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: ApiMessage[] = await response.json(); // Aqui definimos explicitamente que `data` é um array de `ApiMessage`
        if (data && Array.isArray(data)) {
          const formattedMessages = data.map((msg, index) => ({
            id: index,
            text: msg.content,
            type:  msg.senderType.toLowerCase() as 'bot' | 'user',
          }));
          setMessages(formattedMessages);
        }
      } else {
        console.log('No session found');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Chat messages={messages} isLoading={isLoading} setMessages={setMessages} setIsLoading={setIsLoading} chatId={chatID} fetchMessages={fetchMessages} setChatId={setChatID}/>
    </>
  );
}
