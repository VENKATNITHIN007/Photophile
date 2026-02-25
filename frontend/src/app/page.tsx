import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-extrabold tracking-tight text-black">
            Dukan<span className="text-blue-600">.</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
              Log in
            </Link>
            <Button asChild variant="default" className="rounded-full">
              <Link href="/register">Sign up</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-start gap-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              Top photographers in India
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-gray-900">
              Capture your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                masterpiece.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-lg leading-relaxed">
              Discover and book talented photographers for your next project, event, or creative vision without any hassle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
              <Button asChild size="lg" className="rounded-full text-base px-8 h-14">
                <Link href="/photographers">
                  Find a Photographer
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full text-base px-8 h-14">
                <Link href="/register">Become a Photographer</Link>
              </Button>
            </div>
          </div>
          
          <div className="relative aspect-[4/5] lg:aspect-square rounded-2xl overflow-hidden group shadow-2xl">
            <Image 
              src="https://images.unsplash.com/photo-1554046920-90dc5f212265?q=80&w=2000&auto=format&fit=crop" 
              alt="Professional photographer in action" 
              fill
              className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700 ease-out"
              priority
            />
            
            {/* Floating badge */}
            <div className="absolute bottom-8 left-8 z-20 bg-white/95 backdrop-blur-md border border-gray-200 p-4 rounded-xl flex items-center gap-4 shadow-xl translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
              <div className="w-12 h-12 rounded-full overflow-hidden relative">
                <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" alt="Avatar" fill className="object-cover" />
              </div>
              <div>
                <div className="text-gray-900 font-bold text-sm">Elena Rodriguez</div>
                <div className="text-blue-600 font-medium text-xs">Editorial & Fashion</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Photographers */}
      <section className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8 border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Featured Professionals</h2>
              <p className="text-gray-600 text-lg">Top-rated professionals ready to bring your vision to life.</p>
            </div>
            <Link href="/photographers" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
              Browse Directory
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Photographer Card 1 */}
            <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1493863641943-9b68992a8d07?q=80&w=800&auto=format&fit=crop" alt="Portfolio 1" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur text-xs font-semibold text-gray-900 rounded-md">Portrait</span>
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur text-xs font-semibold text-gray-900 rounded-md">Studio</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Marcus Chen</h3>
                    <p className="text-sm text-gray-500 font-medium">Mumbai, India</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-bold text-gray-900">4.9</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
                  <span className="text-sm font-medium text-gray-600">Starting at $250/hr</span>
                  <Link href="/photographers" className="text-sm font-bold text-blue-600 group-hover:text-blue-800 transition-colors">View Profile &rarr;</Link>
                </div>
              </div>
            </div>

            {/* Photographer Card 2 */}
            <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?q=80&w=800&auto=format&fit=crop" alt="Portfolio 2" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur text-xs font-semibold text-gray-900 rounded-md">Wedding</span>
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur text-xs font-semibold text-gray-900 rounded-md">Events</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Sarah Jenkins</h3>
                    <p className="text-sm text-gray-500 font-medium">Delhi, India</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-bold text-gray-900">5.0</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
                  <span className="text-sm font-medium text-gray-600">Packages from $2k</span>
                  <Link href="/photographers" className="text-sm font-bold text-blue-600 group-hover:text-blue-800 transition-colors">View Profile &rarr;</Link>
                </div>
              </div>
            </div>

            {/* Photographer Card 3 */}
            <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1621360841013-c76831f18529?q=80&w=800&auto=format&fit=crop" alt="Portfolio 3" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur text-xs font-semibold text-gray-900 rounded-md">Commercial</span>
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur text-xs font-semibold text-gray-900 rounded-md">Product</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">David Okafor</h3>
                    <p className="text-sm text-gray-500 font-medium">Bangalore, India</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-bold text-gray-900">4.8</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
                  <span className="text-sm font-medium text-gray-600">Starting at $150/hr</span>
                  <Link href="/photographers" className="text-sm font-bold text-blue-600 group-hover:text-blue-800 transition-colors">View Profile &rarr;</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">Seamless Process</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">From discovery to final delivery, our platform ensures a friction-free experience for both clients and creatives.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-[2px] bg-gray-100">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20"></div>
            </div>

            {/* Step 1 */}
            <div className="relative text-center">
              <div className="w-20 h-20 mx-auto bg-white border-4 border-gray-50 rounded-full flex items-center justify-center mb-6 relative z-10 text-blue-600 shadow-sm">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Discover</h3>
              <p className="text-gray-600 leading-relaxed">Search our curated directory by location, style, and budget to find your perfect match.</p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="w-20 h-20 mx-auto bg-blue-600 border-4 border-blue-50 rounded-full flex items-center justify-center mb-6 relative z-10 text-white shadow-lg shadow-blue-600/30">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Book & Plan</h3>
              <p className="text-gray-600 leading-relaxed">Connect directly, finalize details, and request a consultation through our platform.</p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center">
              <div className="w-20 h-20 mx-auto bg-white border-4 border-gray-50 rounded-full flex items-center justify-center mb-6 relative z-10 text-blue-600 shadow-sm">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Create</h3>
              <p className="text-gray-600 leading-relaxed">Execute the shoot and receive stunning, high-quality deliverables efficiently.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop')] opacity-10 bg-cover bg-center"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8">Ready to frame your next project?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" variant="default" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white border-none h-14 px-8 text-base">
              <Link href="/photographers">Explore Directory</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full bg-transparent text-white border-white hover:bg-white/10 hover:text-white h-14 px-8 text-base">
              <Link href="/register">Join as a Professional</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="py-8 text-center text-sm text-gray-500 border-t border-gray-200 bg-white">
        <p>&copy; {new Date().getFullYear()} Dukan. All rights reserved.</p>
      </footer>

    </div>
  );
}