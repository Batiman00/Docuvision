import Header from "@/components/Header/page";

export default function AuthLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <>
            <Header/>
          {children}
        </>
    );
  }