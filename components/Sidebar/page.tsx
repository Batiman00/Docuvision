'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prevState) => !prevState);
    const content = document.getElementById("content");
    if (content) {
      content.style.marginLeft = isCollapsed ? '270px' : '70px'; 
    }
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 border-r bg-cyan-900 transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-[270px]',
        'h-full'
      )}
    >
      <div className='h-full px-3 py-4 flex flex-col justify-between'>
        <div className='mt-5'>
          <div className='flex flex-col gap-1 w-full'>
            {/* Add more links here as needed */}
            <Link href="/teste" className='text-white hover:text-cyan-300'>
              Test Link
            </Link>
            <Link href="/conversations" className='text-white hover:text-cyan-300'>
              Conversations
            </Link>
          </div>
        </div>

        <div className='flex gap-2 flex-col w-full'>
          <Button
            className='w-full'
            onClick={() => { router.push('/auth/login'); }}
          >
            Login
          </Button>

          <Button
            variant='secondary'
            className='w-full'
            onClick={toggleSidebar}
          >
            {isCollapsed ? 'Expand' : 'Collapse'}
          </Button>
        </div>
      </div>
    </aside>
  );
}
