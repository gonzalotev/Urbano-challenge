export default interface CourseQuery {
  name?: string;
  description?: string;
  imageUrl?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
}
