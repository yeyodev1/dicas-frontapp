import APIBase from '@/services/httpBase'
import type { Post, PostFormData } from '@/stores/blog'

class BlogService extends APIBase {
  getPosts() {
    return this.get<Post[]>('blog')
  }

  getPostBySlug(slug: string) {
    return this.get<Post>(`blog/${slug}`)
  }

  getAdminPosts() {
    return this.get<Post[]>('blog/admin/all')
  }

  createPost(data: PostFormData) {
    return this.post<Post>('blog', data)
  }

  updatePost(id: string, data: Partial<PostFormData>) {
    return this.put<Post>(`blog/${id}`, data)
  }

  deletePost(id: string) {
    return this.delete<void>(`blog/${id}`)
  }

  togglePublish(id: string) {
    return this.patch<Post>(`blog/${id}/publish`, {})
  }
}

export default new BlogService()
