import { useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Pagination } from "@/lib/types/photographer";

interface PaginationControlsProps {
  pagination: Pagination;
  page: number;
  onPageChange: (page: number) => void;
}

// ── Helpers ────────────────────────────────────────────────────────

/**
 * Build a windowed page list: always shows first, last, and ~2 pages
 * around the current page, with `null` representing an ellipsis gap.
 *
 * Example for page 6 of 20: [1, null, 4, 5, 6, 7, 8, null, 20]
 */
function getPageWindow(current: number, total: number): (number | null)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | null)[] = [];
  const SIBLING = 2; // pages on each side of current

  // Always include page 1
  pages.push(1);

  const rangeStart = Math.max(2, current - SIBLING);
  const rangeEnd = Math.min(total - 1, current + SIBLING);

  // Ellipsis after page 1 if needed
  if (rangeStart > 2) pages.push(null);

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  // Ellipsis before last page if needed
  if (rangeEnd < total - 1) pages.push(null);

  // Always include last page
  pages.push(total);

  return pages;
}

// ── Component ──────────────────────────────────────────────────────

export function PaginationControls({ pagination, page, onPageChange }: PaginationControlsProps) {
  // --- Item #10: Keyboard navigation (← / →) ---
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && pagination.hasPrevPage) {
        onPageChange(page - 1);
      } else if (e.key === "ArrowRight" && pagination.hasNextPage) {
        onPageChange(page + 1);
      }
    },
    [page, pagination.hasPrevPage, pagination.hasNextPage, onPageChange],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (pagination.totalPages <= 1) return null;

  const window_ = getPageWindow(page, pagination.totalPages);

  return (
    <div className="mt-10 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-6">
      {/* Mobile: simple Prev / Next */}
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={!pagination.hasPrevPage}
        >
          <ChevronLeft className="mr-1 size-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!pagination.hasNextPage}
        >
          Next
          <ChevronRight className="ml-1 size-4" />
        </Button>
      </div>

      {/* Desktop: result count + windowed page numbers */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <p className="text-sm text-gray-700">
          Showing{" "}
          <span className="font-medium">{(pagination.currentPage - 1) * pagination.perPage + 1}</span>
          {" "}to{" "}
          <span className="font-medium">
            {Math.min(pagination.currentPage * pagination.perPage, pagination.totalCount)}
          </span>
          {" "}of <span className="font-medium">{pagination.totalCount}</span> results
        </p>

        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          {/* Previous arrow */}
          <Button
            variant="outline"
            size="icon"
            className="rounded-r-none"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={!pagination.hasPrevPage}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </Button>

          {/* Windowed page numbers */}
          {window_.map((pageNum, idx) =>
            pageNum === null ? (
              <span
                key={`ellipsis-${idx}`}
                className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 ring-1 ring-inset ring-gray-300"
              >
                …
              </span>
            ) : (
              <Button
                key={pageNum}
                variant={page === pageNum ? "default" : "outline"}
                size="icon"
                className="rounded-none"
                onClick={() => onPageChange(pageNum)}
                aria-current={page === pageNum ? "page" : undefined}
              >
                {pageNum}
              </Button>
            ),
          )}

          {/* Next arrow */}
          <Button
            variant="outline"
            size="icon"
            className="rounded-l-none"
            onClick={() => onPageChange(page + 1)}
            disabled={!pagination.hasNextPage}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </Button>
        </nav>
      </div>
    </div>
  );
}
