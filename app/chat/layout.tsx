import Header from "@/components/Header/page";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="transition-all duration-300 ml-[270px] h-dvh" id="content">
      <Header/>
        {children}
      </div>
  );
}
