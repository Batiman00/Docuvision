import { getSession } from 'next-auth/react';
import { Chat } from '@/types';

interface ApiMessaageResponse {
    messages: ApiMessage[];
    chatTitle: string;
}

interface ApiMessage {
    content: string;
    senderType: 'bot' | 'user';
}

export const fetchChats = async (): Promise<Chat[]> => {
    const session = await getSession();
    if (!session) throw new Error('No session found');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/user-chats`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (!response.ok) throw new Error(`Error fetching chats: ${response.statusText}`);
    const data = await response.json();

    return data.data.map((item: { title: string; chatId: string }) => ({
        id: item.chatId,
        title: item.title,
    }));
};

export const getMessages = async (chatId: string): Promise<{ chat: Chat }> => {
    const session = await getSession();
    if (!session) throw new Error('No session found');
    if (chatId) {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/chat/messages?chatId=${chatId}`,
            {
                headers: { Authorization: `Bearer ${session.access_token}` },
            }
        );

        if (!response.ok) throw new Error(`Error fetching messages: ${response.statusText}`);
        const data: ApiMessaageResponse = await response.json();

        const messages = data.messages.map((msg, index) => ({
            id: index,
            text: msg.content,
            type: msg.senderType.toLowerCase() as 'bot' | 'user',
        }));

        return {
            chat: { id: chatId, title: data.chatTitle, messages },
        };
    }
    else{
        return {chat: { id: '', title: '', messages : [] },}
    }
};
