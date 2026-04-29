import Link from "next/link";

const categories = [
  "Wedding",
  "Portrait",
  "Event",
  "Commercial",
  "Maternity",
  "Product",
  "Food",
  "Fashion",
];

export function CategoryHighlights() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-amber-700">
              Popular categories
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Find photographers by style
            </h2>
          </div>
          <Link href="/photographers" className="text-sm font-semibold text-gray-700 hover:text-black">
            Browse all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/photographers?specialty=${encodeURIComponent(category.toLowerCase())}`}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-center text-sm font-medium text-gray-800 transition hover:border-gray-300 hover:bg-white"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryHighlights;
