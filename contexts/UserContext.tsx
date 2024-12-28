'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Chat, Message } from "@/types"

interface UserContextType {
    chats: Chat[];
    setChats: (chats: Chat[]) => void;
    chat: Chat;
    setChat: (chat: Chat) => void;
    menuChatShow: boolean;
    setMenuChatShow : (value: boolean) => void;
}


const UserContext = createContext<UserContextType>({
    chats: [], setChats: () => { },
    chat: { id: '', messages: [], title: '' }, setChat: () => { },
    menuChatShow : true, setMenuChatShow :  () => { }
});

export function UserContextProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const [chats, setChats] = useState<Chat[]>([]);
    const [chat, setChat] = useState<Chat>({ id: '', messages: [], title: '' })
    const [menuChatShow, setMenuChatShow] = useState(true)

    {/*useEffect(() => { fetchChats() }, [])


    {const fetchChats = async () => {
        try {
            const session = await getSession();
            if (session) {
                const token = session.access_token;
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/user-chats`,
                    { headers: { Authorization: `Bearer ${token}`, }, });
                const data = await response.json();
                if (data?.data) {
                    const mappedChats: Chat[] = data.data.map((item: { title: string, chatId: string }) =>
                        ({ id: item.chatId, title: item.title, }));
                    console.log("Chats",mappedChats)
                    setChats(mappedChats);
                }
            }
        }
        catch (error) { console.error('Error fetching chats:', error); }
    };

    const updateMessages = async (chatId :string) => {
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
                const data: ApiMessaageResponse = await response.json();
                if (data) {
                    const formattedMessages: Message[] = data.messages.map((msg, index) => ({
                        id: index,
                        text: msg.content,
                        type: msg.senderType.toLowerCase() as 'bot' | 'user',
                    }));
                    if(!chat.id){ await fetchChats()}
                    setChat({ id: chatId, title: data.chatTitle, messages: formattedMessages });
                    console.log("chatId", chat.id)
                }
            } else {
                console.log('No session found');
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }*/}

    return (
        <UserContext.Provider value={{ chats, setChats, chat, setChat, menuChatShow, setMenuChatShow }}>
            {children}
        </UserContext.Provider>
    );


}

export const useUserContext = () => useContext(UserContext);
