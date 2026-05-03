import { MainHeader } from "@/components/layout/Header/MainHeader";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainHeader />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
