import APIBase from '@/services/httpBase'
import type { Post, PostFormData } from '@/stores/blog'

interface PaginatedPosts {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  message: string;
}

interface SinglePostResponse {
  post: Post;
  message: string;
}

interface AdminPostsResponse {
  posts: Post[];
  message: string;
}

class BlogService extends APIBase {
  getPosts(page: number = 1, limit: number = 10) {
    return this.get<PaginatedPosts>(`blog?page=${page}&limit=${limit}`)
  }

  getPostBySlug(slug: string) {
    return this.get<SinglePostResponse>(`blog/${slug}`)
  }

  getAdminPosts() {
    return this.get<AdminPostsResponse>('blog/admin/all')
  }

  createPost(data: PostFormData) {
    return this.post<SinglePostResponse>('blog', data)
  }

  updatePost(id: string, data: Partial<PostFormData>) {
    return this.put<SinglePostResponse>(`blog/${id}`, data)
  }

  deletePost(id: string) {
    return this.delete<void>(`blog/${id}`)
  }

  togglePublish(id: string) {
    return this.patch<SinglePostResponse>(`blog/${id}/publish`, {})
  }
}

export default new BlogService()
