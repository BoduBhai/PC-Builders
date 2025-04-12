import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
  maxDisplayedPages = 5,
}) => {
  // If we're still loading or have no pages, don't show pagination
  if (loading || totalPages <= 1) return null;

  // Calculate visible page numbers with ellipsis
  const getDisplayedPages = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    // Calculate start and end of pages to display
    let startPage = Math.max(
      2,
      currentPage - Math.floor(maxDisplayedPages / 2),
    );
    let endPage = Math.min(totalPages - 1, startPage + maxDisplayedPages - 3);

    // Adjust if we're at the beginning
    if (startPage > 2) {
      pages.push("...");
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const displayedPages = getDisplayedPages();

  return (
    <div className="mt-10 flex justify-center">
      <div className="join">
        {/* Previous Page Button */}
        <button
          className="join-item btn"
          disabled={currentPage === 1 || loading}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Page Numbers */}
        {displayedPages.map((page, index) =>
          page === "..." ? (
            <button
              key={`ellipsis-${index}`}
              className="join-item btn"
              disabled={true}
            >
              ...
            </button>
          ) : (
            <button
              key={page}
              className={`join-item btn ${currentPage === page ? "btn-primary" : ""}`}
              onClick={() => (page !== currentPage ? onPageChange(page) : null)}
              disabled={loading}
            >
              {page}
            </button>
          ),
        )}

        {/* Next Page Button */}
        <button
          className="join-item btn"
          disabled={currentPage === totalPages || loading}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
