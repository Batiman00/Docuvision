import Chat from "@/components/Chat/Page";
import Header from "@/components/Header/page";
import { Sidebar } from "@/components/Sidebar/page";

export default function Home() {
  return (
    <>
    <Sidebar/>
     <div className="transition-all duration-300 ml-[270px] h-dvh" id="content">
    <Header/>
    <Chat/>
    </div>
    
    </>
  );
}
