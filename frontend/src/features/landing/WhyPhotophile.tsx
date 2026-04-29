const points = [
  {
    title: "Public profile URL",
    description: "Each photographer gets a clean shareable page at /photographers/[username].",
  },
  {
    title: "Portfolio-first experience",
    description: "Visitors immediately see real work, styles, pricing context, and location.",
  },
  {
    title: "Direct contact",
    description: "Customers can connect directly without booking or review complexity in MVP.",
  },
];

export function WhyPhotophile() {
  return (
    <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-gray-900">Built for photographers who want visibility</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {points.map((point) => (
            <article key={point.title} className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">{point.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{point.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyPhotophile;
