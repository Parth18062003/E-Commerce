import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import React from 'react';
import { usePagination, UsePaginationProps } from 'react-instantsearch';

// Pagination item component to handle disabled links and clicks
type PaginationItemProps = Omit<React.ComponentProps<'a'>, 'onClick'> & {
  onClick: NonNullable<React.ComponentProps<'a'>['onClick']>;
  isDisabled: boolean;
};

function PaginationItem({
  isDisabled,
  href,
  onClick,
  ...props
}: PaginationItemProps) {
  if (isDisabled) {
    return (
      <li>
        <span
          className="px-4 py-2 text-gray-400 cursor-not-allowed"
          {...props}
        />
      </li>
    );
  }

  return (
    <li>
      <a
        href={href}
        onClick={(event) => {
          if (isModifierClick(event)) {
            return;
          }

          event.preventDefault();
          onClick(event);
        }}
        className="px-4 py-2 text-indigo-500 rounded-md cursor-pointer"
        {...props}
      />
    </li>
  );
}

// Helper to determine if a modifier key is pressed
function isModifierClick(event: React.MouseEvent) {
  const isMiddleClick = event.button === 1;

  return Boolean(
    isMiddleClick ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
  );
}

// Main CustomPagination component
function CustomPagination(props: UsePaginationProps) {
  const {
    pages,
    currentRefinement,
    nbPages,
    isFirstPage,
    isLastPage,
    refine,
    createURL,
  } = usePagination(props);

  // Calculate page indexes
  const firstPageIndex = 0;
  const previousPageIndex = currentRefinement - 1;
  const nextPageIndex = currentRefinement + 1;
  const lastPageIndex = nbPages - 1;

  return (
    <ul className="flex justify-center items-center space-x-2">
      {/* First Page */}
      <PaginationItem
        isDisabled={isFirstPage}
        href={createURL(firstPageIndex)}
        onClick={() => refine(firstPageIndex)}
      >
        <ChevronsLeft />
      </PaginationItem>

      {/* Previous Page */}
      <PaginationItem
        isDisabled={isFirstPage}
        href={createURL(previousPageIndex)}
        onClick={() => refine(previousPageIndex)}
      >
        <ChevronLeft />
      </PaginationItem>

      {/* Loop through page numbers */}
      {pages.map((page) => {
        const label = page + 1; // Displaying page starting from 1
        return (
          <PaginationItem
            key={page}
            isDisabled={false}
            aria-label={`Page ${label}`}
            href={createURL(page)}
            onClick={() => refine(page)}
            className={currentRefinement === page ? 'mx-auto px-3 py-1 rounded-full bg-zinc-500 text-white' : 'px-3 py-1 rounded-full text-zinc-600'}
          >
            {label}
          </PaginationItem>
        );
      })}

      {/* Next Page */}
      <PaginationItem
        isDisabled={isLastPage}
        href={createURL(nextPageIndex)}
        onClick={() => refine(nextPageIndex)}
      >
        <ChevronRight />
      </PaginationItem>

      {/* Last Page */}
      <PaginationItem
        isDisabled={isLastPage}
        href={createURL(lastPageIndex)}
        onClick={() => refine(lastPageIndex)}
      >
        <ChevronsRight />
      </PaginationItem>
    </ul>
  );
}

export default CustomPagination;
