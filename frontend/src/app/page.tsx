import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-obsidian text-brand-silver selection:bg-brand-cyan selection:text-brand-obsidian font-sans">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-brand-ash bg-brand-obsidian/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter text-brand-cyan">
            LensLoom<span className="text-brand-teal">.</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="text-sm font-medium hover:text-brand-cyan transition-colors">
              Log in
            </Link>
            <Link href="/register" className="text-sm font-medium bg-brand-cyan text-brand-obsidian px-5 py-2.5 rounded hover:bg-white transition-colors duration-300">
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-brand-ash)_0%,_transparent_40%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--color-brand-teal)_0%,_transparent_30%)] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-start gap-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-teal/30 bg-brand-teal/10 text-brand-cyan text-xs font-mono uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>
              Now connecting globally
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1] text-white">
              Capture your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-teal">
                masterpiece.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-brand-silver/80 max-w-lg leading-relaxed">
              Discover and book talented photographers worldwide for your next project, event, or creative vision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
              <Link href="/photographers" className="group flex items-center justify-center gap-2 bg-brand-cyan text-brand-obsidian px-8 py-4 rounded font-semibold hover:bg-white transition-all duration-300">
                Find a Photographer
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link href="/register" className="flex items-center justify-center px-8 py-4 rounded font-semibold border border-brand-ash hover:border-brand-cyan text-white transition-all duration-300">
                Become a Photographer
              </Link>
            </div>
          </div>
          
          <div className="relative aspect-[4/5] lg:aspect-square rounded-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-brand-cyan/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
            <Image 
              src="https://images.unsplash.com/photo-1554046920-90dc5f212265?q=80&w=2000&auto=format&fit=crop" 
              alt="Professional photographer in action" 
              fill
              className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0"
              priority
            />
            
            {/* Floating badge */}
            <div className="absolute bottom-8 left-8 z-20 bg-brand-obsidian/90 backdrop-blur border border-brand-ash p-4 rounded-lg flex items-center gap-4 shadow-2xl translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
              <div className="w-12 h-12 rounded-full overflow-hidden relative">
                <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" alt="Avatar" fill className="object-cover" />
              </div>
              <div>
                <div className="text-white font-medium text-sm">Elena Rodriguez</div>
                <div className="text-brand-cyan text-xs">Editorial & Fashion</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Photographers */}
      <section className="py-24 bg-brand-ash px-6 relative border-y border-brand-teal/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Elite Lenses</h2>
              <p className="text-brand-silver">Top-rated professionals ready to bring your vision to life.</p>
            </div>
            <Link href="/photographers" className="text-brand-cyan hover:text-white transition-colors flex items-center gap-2 text-sm font-medium uppercase tracking-wider">
              View all directory
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Photographer Card 1 */}
            <div className="group bg-brand-obsidian rounded-xl overflow-hidden border border-brand-silver/10 hover:border-brand-cyan/50 transition-colors duration-300">
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1493863641943-9b68992a8d07?q=80&w=800&auto=format&fit=crop" alt="Portfolio 1" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="px-2 py-1 bg-brand-obsidian/80 backdrop-blur text-xs font-medium text-brand-silver rounded">Portrait</span>
                  <span className="px-2 py-1 bg-brand-obsidian/80 backdrop-blur text-xs font-medium text-brand-silver rounded">Studio</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Marcus Chen</h3>
                    <p className="text-sm text-brand-teal">Brooklyn, NY</p>
                  </div>
                  <div className="flex items-center gap-1 text-brand-cyan">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-bold">4.9</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-brand-ash pt-4 mt-4">
                  <span className="text-sm text-brand-silver">Starting at $250/hr</span>
                  <Link href="/photographers/1" className="text-sm font-semibold text-white group-hover:text-brand-cyan transition-colors">View Profile &rarr;</Link>
                </div>
              </div>
            </div>

            {/* Photographer Card 2 */}
            <div className="group bg-brand-obsidian rounded-xl overflow-hidden border border-brand-silver/10 hover:border-brand-cyan/50 transition-colors duration-300">
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?q=80&w=800&auto=format&fit=crop" alt="Portfolio 2" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="px-2 py-1 bg-brand-obsidian/80 backdrop-blur text-xs font-medium text-brand-silver rounded">Wedding</span>
                  <span className="px-2 py-1 bg-brand-obsidian/80 backdrop-blur text-xs font-medium text-brand-silver rounded">Events</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Sarah Jenkins</h3>
                    <p className="text-sm text-brand-teal">Austin, TX</p>
                  </div>
                  <div className="flex items-center gap-1 text-brand-cyan">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-bold">5.0</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-brand-ash pt-4 mt-4">
                  <span className="text-sm text-brand-silver">Packages from $2k</span>
                  <Link href="/photographers/2" className="text-sm font-semibold text-white group-hover:text-brand-cyan transition-colors">View Profile &rarr;</Link>
                </div>
              </div>
            </div>

            {/* Photographer Card 3 */}
            <div className="group bg-brand-obsidian rounded-xl overflow-hidden border border-brand-silver/10 hover:border-brand-cyan/50 transition-colors duration-300">
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1621360841013-c76831f18529?q=80&w=800&auto=format&fit=crop" alt="Portfolio 3" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="px-2 py-1 bg-brand-obsidian/80 backdrop-blur text-xs font-medium text-brand-silver rounded">Commercial</span>
                  <span className="px-2 py-1 bg-brand-obsidian/80 backdrop-blur text-xs font-medium text-brand-silver rounded">Product</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">David Okafor</h3>
                    <p className="text-sm text-brand-teal">London, UK</p>
                  </div>
                  <div className="flex items-center gap-1 text-brand-cyan">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-bold">4.8</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-brand-ash pt-4 mt-4">
                  <span className="text-sm text-brand-silver">Starting at $150/hr</span>
                  <Link href="/photographers/3" className="text-sm font-semibold text-white group-hover:text-brand-cyan transition-colors">View Profile &rarr;</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Seamless Process</h2>
            <p className="text-lg text-brand-silver max-w-2xl mx-auto">From discovery to final delivery, our platform ensures a friction-free experience for both clients and creatives.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-[1px] bg-brand-ash">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-brand-cyan to-transparent opacity-20"></div>
            </div>

            {/* Step 1 */}
            <div className="relative text-center">
              <div className="w-16 h-16 mx-auto bg-brand-obsidian border-2 border-brand-teal rounded-full flex items-center justify-center mb-6 relative z-10 text-brand-cyan">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1. Discover</h3>
              <p className="text-brand-silver/80">Search our curated directory by location, style, and budget to find your perfect match.</p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="w-16 h-16 mx-auto bg-brand-obsidian border-2 border-brand-cyan rounded-full flex items-center justify-center mb-6 relative z-10 text-brand-cyan shadow-[0_0_15px_rgba(102,252,241,0.3)]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">2. Book & Plan</h3>
              <p className="text-brand-silver/80">Connect directly, finalize details, and secure your session through our platform.</p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center">
              <div className="w-16 h-16 mx-auto bg-brand-obsidian border-2 border-brand-teal rounded-full flex items-center justify-center mb-6 relative z-10 text-brand-cyan">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">3. Create</h3>
              <p className="text-brand-silver/80">Execute the shoot and receive stunning, high-quality deliverables efficiently.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-ash/50"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-cyan/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Ready to frame your next project?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/photographers" className="bg-white text-brand-obsidian px-8 py-4 rounded font-semibold hover:bg-brand-cyan transition-colors duration-300">
              Explore Directory
            </Link>
            <Link href="/register" className="px-8 py-4 rounded font-semibold border border-brand-silver text-white hover:bg-brand-ash transition-colors duration-300">
              Join as a Professional
            </Link>
          </div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="py-8 text-center text-sm text-brand-silver/50 border-t border-brand-ash">
        <p>&copy; {new Date().getFullYear()} LensLoom. All rights reserved.</p>
      </footer>

    </div>
  );
}
