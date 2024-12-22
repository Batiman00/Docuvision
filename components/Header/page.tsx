'use client'
import { Press_Start_2P } from 'next/font/google'
import { useSession } from "next-auth/react";
 
const ps2 = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
})
 
export default function Header() {
  const { data: session } = useSession();
    return (
        <header className={`${ps2.className} pr-4 py-2 w-full text-white text-xs flex md:flex md:flex-grow space bg-stone-900 justify-between h-[10%]`}> 
        <div className='mx-4 grid grid-rows-2 items-center justify-items-start'>
          <h3 className=' text-lg font-semibold text-amber-300'>Player</h3>
          <p >{session ? `${session?.user?.name}` : 'Guest'}</p>
        </div>
        <h1 className=' text-lg font-semibold justify-items-begin text-amber-300'>Docuvision</h1>
      </header>
    );
  }
  