export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  coverImage?: string;
  genre?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}
