import { Sidebar } from "@/components/Sidebar/page";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Sidebar/>
      {children}
      </>
  );
}
