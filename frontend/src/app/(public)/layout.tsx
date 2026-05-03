import { MainHeader } from "@/components/layout/Header/MainHeader";

export default function PublicLayout({
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
      
      {/* Editorial Stark Black Footer */}
      <footer className="py-16 md:py-24 bg-black text-white">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
            
            <div className="flex flex-col gap-2">
              <span className="text-2xl font-bold tracking-[0.2em] uppercase">Photophile</span>
              <span className="text-sm font-light text-gray-400">The premier platform for professional photographers.</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 md:gap-12 text-sm font-light tracking-widest uppercase text-gray-400">
               <a href="#" className="hover:text-white transition-colors">Privacy</a>
               <a href="#" className="hover:text-white transition-colors">Terms</a>
               <a href="#" className="hover:text-white transition-colors">Contact</a>
               <a href="#" className="hover:text-white transition-colors">Instagram</a>
            </div>
         </div>
      </footer>
    </div>
  );
}
