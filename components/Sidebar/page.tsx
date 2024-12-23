'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import { Press_Start_2P } from "next/font/google";

const ps2 = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

export function Sidebar() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [chats, setChats] = useState<{ chatId: string; title: string }[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const session = await getSession();
        console.log(session)
        if (session) {
          const token = session?.access_token;
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/chat/user-chats`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          if (data?.data) {
            setChats(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  const handleChatClick = async (chatId: string) => {
    try {
      router.push(`/chat?chatId=${chatId}`);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed((prevState) => !prevState);
    const content = document.getElementById('content');
    if (content) {
      content.style.marginLeft = isCollapsed ? '270px' : '70px';
    }
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 border-r bg-black transition-all duration-500',
        isCollapsed ? 'w-16' : 'w-[270px]',
        'h-full'
      )}
    >
      <div className="h-full px-3 py-4 flex flex-col justify-between">
        <div className="flex flex-col max-h-[75%]">
          <h2 className={`${ps2.className} text-amber-300 text-xs font-bold mb-4 self-center`}>Save Points</h2>
          <div className="flex-grow overflow-y-auto flex flex-col gap-3 w-full">
            {chats.map((chat) => (
              <button
                key={chat.chatId}
                onClick={() => handleChatClick(chat.chatId)}
                className={`text-stone-100 hover:text-amber-600 text-left text-xs outline outline-offset-5 outline-1 ${ps2.className}`}
              >
                {chat.title}
              </button>
            ))}
          </div>
        </div>


        <div className="mt-4 h-[35%]">
          <div className="flex flex-col gap-2">
            <Button
              className="w-full"
              onClick={() => {
                router.push('/auth/login');
              }}
            >
              Login
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                signOut();
                router.push('/auth/login');
              }}
            >
              LogOut
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={toggleSidebar}
            >
              {isCollapsed ? 'Expand' : 'Collapse'}
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
