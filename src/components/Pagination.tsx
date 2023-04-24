import React from 'react';

const Pagination = ({ totalElements, currentPage, elementsPerPage, onPageChange }: any) => {
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalElements / elementsPerPage);

  // Helper function to handle page change
  const handlePageChange = (page: any) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-center mt-8">
      {/* Previous Page Arrow */}
      <button
        className="mr-2 px-3 py-2 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 transition duration-200"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      {/* Page Numbers */}
      <div className="flex">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`mx-1 px-3 py-2 rounded-md ${currentPage === index + 1
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300 transition duration-200'
              }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Next Page Arrow */}
      <button
        className="ml-2 px-3 py-2 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 transition duration-200"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
