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
    <header
      className={`${ps2.className} w-full text-white text-xs bg-stone-900 h-[10%] flex flex-row-reverse min-h-[50px] min-w-[300px]`}
    >
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
