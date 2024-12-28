'use client'
import Header from "@/components/Header/page";
import { Sidebar } from "@/components/Sidebar/page";
import { useUserContext } from "@/contexts/UserContext";
import { Suspense } from "react";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const {menuChatShow} = useUserContext()
  return (

    <Suspense>
      <Sidebar />
      <div className={`transition-all duration-300 min-w-[220px] ${menuChatShow  ? "ml-[270px]" : "ml-0"} h-dvh id="content`}>
        <Header />
        {children}
      </div>
    </Suspense>
  );
}