export interface UserSummary {
  _id: string;
  fullName: string;
  avatar?: string | null;
  email?: string;
}

export interface PhotographerListItem {
  _id: string;
  userId: UserSummary;
  username: string;
  bio?: string;
  location?: string;
  specialties?: string[];
  priceFrom?: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  perPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PhotographerProfile {
  _id: string;
  userId: UserSummary;
  username: string;
  bio?: string;
  location?: string;
  specialties: string[];
  priceFrom?: number;
}

export interface PortfolioItem {
  _id: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  category?: string;
}

