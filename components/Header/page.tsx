'use client'
import { Press_Start_2P } from 'next/font/google'
import { useSession } from "next-auth/react";
import { useUserContext } from '@/contexts/UserContext';
import { AlignJustify } from "lucide-react";

const ps2 = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
})

export default function Header() {
  const { data: session } = useSession();
  const { setMenuChatShow, menuChatShow } = useUserContext();
  return (
    <header
      className={`${ps2.className} w-full text-white text-xs bg-stone-900 h-[10%] flex flex-row-reverse min-h-[50px] min-w-[300px]`}
    ><button
      className={`fixed h-[10%]  top-0 left-0 z-50 p-4 bg-amber-300 text-black shadow-lg block ${menuChatShow ? 'hidden' : 'block'}`}
      onClick={() => { setMenuChatShow(!menuChatShow) }}
    >
        {menuChatShow ? "X" : <AlignJustify/>}
      </button>
      <div className="mx-4 mt-1 text-right col-start-4 justify-start">
        <h1 className="text-lg font-semibold text-amber-300">Docuvision</h1>
        {session &&
          <div className='flex flex-row items-baseline'>
            <h3 className="text-sm font-semibold text-amber-300">Player: </h3>
            <p className="text-xs">{session.user?.name}</p>
          </div>
        }
      </div>
    </header>

  );
}
