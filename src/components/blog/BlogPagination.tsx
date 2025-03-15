import Link from 'next/link';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function BlogPagination({ currentPage, totalPages, basePath }: BlogPaginationProps) {
  // Generate an array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // Calculate range around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pageNumbers.push('...');
    }
    
    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className="flex justify-center items-center space-x-2">
      {/* Previous Page Button */}
      {currentPage > 1 && (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Previous
        </Link>
      )}
      
      {/* Page Numbers */}
      {pageNumbers.map((page, index) => (
        typeof page === 'number' ? (
          <Link
            key={index}
            href={`${basePath}?page=${page}`}
            className={`px-4 py-2 rounded-md ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            } transition-colors`}
          >
            {page}
          </Link>
        ) : (
          <span key={index} className="px-2">
            {page}
          </span>
        )
      ))}
      
      {/* Next Page Button */}
      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Next
        </Link>
      )}
    </div>
  );
} 