export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 15,
  MAX_LIMIT: 100,
};

export const PAGINATION_LABELS = {
  totalDocs: "totalCount",
  docs: "data",
  limit: "perPage",
  page: "currentPage",
  nextPage: "next",
  prevPage: "prev",
  totalPages: "pageCount",
  hasPrevPage: "hasPrev",
  hasNextPage: "hasNext",
  pagingCounter: "pageCounter",
};

export const PAGINATION_OPTIONS = {
  page: PAGINATION.DEFAULT_PAGE,
  limit: PAGINATION.DEFAULT_LIMIT,
  customLabels: PAGINATION_LABELS,
};