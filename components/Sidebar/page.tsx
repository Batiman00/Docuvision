'use client';

import {  useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { signOut } from 'next-auth/react';
import { Press_Start_2P } from "next/font/google";
import { useUserContext } from '@/contexts/UserContext';
import { fetchChats } from '@/services/chatService';


const ps2 = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

export function Sidebar() {
  const router = useRouter();
  const { chats, setChats, setMenuChatShow, menuChatShow } = useUserContext();


  useEffect(() => {
    const loadChats = async () => {
      try {
        const fetchedChats = await fetchChats();
        setChats(fetchedChats);
      } catch (error) {
        console.error(error);
      }
    };

    loadChats();
  }, []);


  const handleChatClick = async (chatId: string) => {
    try {
      router.push(`/chat?chatId=${chatId}`);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };



  return (
    <div>
      <button
        className={`fixed top-1 left-1 z-50 p-3 bg-amber-300 text-black rounded-full shadow-lg block ${menuChatShow ? 'hidden' : 'block'}`}
        onClick={() => { setMenuChatShow(!menuChatShow) }}
      >
        {menuChatShow ? "X" : "☰"}
      </button>
      {/* <aside
        className={cn(
          'fixed left-0 top-0 z-40 border-r bg-black transition-all duration-500',
          isCollapsed ? '' : '!translate-x-0',
          'h-full sm:translate-x-0 -translate-x-full'
        )}
      >
     */}
      <aside
        className={`h-full fixed left-0 top-0 z-40 border-r bg-black transition-all duration-500 ${menuChatShow ? 'translate-x-0' : '-translate-x-full'}`}
      >

        <div className="h-full px-3 py-4 flex flex-col justify-between">
          <div className="flex flex-col max-h-[75%]">
            <h2 className={`${ps2.className} text-amber-300 text-xs font-bold mb-4 self-center mt-2`}>Save Points</h2>

            <div className="flex-grow overflow-y-auto flex flex-col gap-3 w-full">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleChatClick(chat.id)}
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
                onClick={() => { setMenuChatShow(!menuChatShow) }}
              >
                {menuChatShow ?  'Collapse':'Expand' }
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}