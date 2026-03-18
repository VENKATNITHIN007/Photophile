export function HowItWorks() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">Seamless Process</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From discovery to final delivery, our platform ensures a friction-free experience for both clients and creatives.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-[2px] bg-gray-100">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20"></div>
          </div>

          <div className="relative text-center">
            <div className="w-20 h-20 mx-auto bg-white border-4 border-gray-50 rounded-full flex items-center justify-center mb-6 relative z-10 text-blue-600 shadow-sm">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">1. Discover</h3>
            <p className="text-gray-600 leading-relaxed">
              Search our curated directory by location, style, and budget to find your perfect match.
            </p>
          </div>

          <div className="relative text-center">
            <div className="w-20 h-20 mx-auto bg-blue-600 border-4 border-blue-50 rounded-full flex items-center justify-center mb-6 relative z-10 text-white shadow-lg shadow-blue-600/30">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">2. Book & Plan</h3>
            <p className="text-gray-600 leading-relaxed">
              Connect directly, finalize details, and request a consultation through our platform.
            </p>
          </div>

          <div className="relative text-center">
            <div className="w-20 h-20 mx-auto bg-white border-4 border-gray-50 rounded-full flex items-center justify-center mb-6 relative z-10 text-blue-600 shadow-sm">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">3. Create</h3>
            <p className="text-gray-600 leading-relaxed">
              Execute the shoot and receive stunning, high-quality deliverables efficiently.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
