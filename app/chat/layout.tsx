import Header from "@/components/Header/page";
import { Sidebar } from "@/components/Sidebar/page";
import { Suspense } from "react";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
      <Sidebar />
      <div className="transition-all duration-300 sm:ml-[270px] ml-[2rem] h-dvh" id="content">
        <Header />
        {children}
      </div>
    </Suspense>
  );
}