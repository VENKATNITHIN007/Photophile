import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BecomePhotographerPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-4xl rounded-2xl border border-amber-100 bg-white p-8 shadow-sm sm:p-12">
        <p className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800">
          Creator program
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Become a photographer on Photophile
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
          Build your public profile, showcase your portfolio, and start receiving booking requests from clients looking
          for your style.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h2 className="text-sm font-semibold text-gray-900">Create profile</h2>
            <p className="mt-1 text-sm text-gray-600">Choose a username, location, and specialties.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h2 className="text-sm font-semibold text-gray-900">Show your work</h2>
            <p className="mt-1 text-sm text-gray-600">Upload your best images and attract the right clients.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h2 className="text-sm font-semibold text-gray-900">Get booked</h2>
            <p className="mt-1 text-sm text-gray-600">Receive requests and manage work from your dashboard.</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="bg-amber-600 text-white hover:bg-amber-700">
            <Link href="/photographer/onboard">Start onboarding</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/photographers">Explore photographers</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
