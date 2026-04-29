import { defineStore } from 'pinia'
import BlogService from '@/services/blog.service'

export interface PostAuthor {
  _id: string
  name: string
  email: string
}

export interface Post {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  author: PostAuthor
  status: 'draft' | 'published'
  tags: string[]
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface PostFormData {
  title: string
  excerpt: string
  content: string
  coverImage?: string
  tags?: string[]
  status?: 'draft' | 'published'
}

export const useBlogStore = defineStore('blog', {
  state: () => ({
    posts: [] as Post[],
    currentPost: null as Post | null,
    adminPosts: [] as Post[],
    loading: false,
    loadingMore: false,
    error: null as string | null,
    // Pagination
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasMore: false,
  }),

  actions: {
    async fetchPosts(loadMore: boolean = false) {
      if (loadMore) {
        this.loadingMore = true
      } else {
        this.loading = true
        this.page = 1
      }
      this.error = null
      
      try {
        const res = await BlogService.getPosts(this.page, this.limit)
        const { posts, total, totalPages } = res.data
        
        if (loadMore) {
          this.posts = [...this.posts, ...posts]
        } else {
          this.posts = posts
        }
        
        this.total = total
        this.totalPages = totalPages
        this.hasMore = this.page < totalPages
      } catch (e: unknown) {
        this.error = (e as { message?: string })?.message || 'Error al cargar posts'
      } finally {
        this.loading = false
        this.loadingMore = false
      }
    },

    async loadNextPage() {
      if (this.hasMore && !this.loadingMore) {
        this.page++
        await this.fetchPosts(true)
      }
    },

    async fetchPostBySlug(slug: string) {
      this.loading = true
      this.error = null
      try {
        const res = await BlogService.getPostBySlug(slug)
        this.currentPost = res.data.post
      } catch (e: unknown) {
        this.error = (e as { message?: string })?.message || 'Post no encontrado'
        this.currentPost = null
      } finally {
        this.loading = false
      }
    },

    async fetchAdminPosts() {
      this.loading = true
      this.error = null
      try {
        const res = await BlogService.getAdminPosts()
        this.adminPosts = res.data.posts
      } catch (e: unknown) {
        this.error = (e as { message?: string })?.message || 'Error al cargar posts'
      } finally {
        this.loading = false
      }
    },

    async createPost(data: PostFormData) {
      const res = await BlogService.createPost(data)
      this.adminPosts.unshift(res.data.post)
      return res.data.post
    },

    async updatePost(id: string, data: Partial<PostFormData>) {
      const res = await BlogService.updatePost(id, data)
      const idx = this.adminPosts.findIndex((p) => p._id === id)
      if (idx !== -1) this.adminPosts[idx] = res.data.post
      return res.data.post
    },

    async deletePost(id: string) {
      await BlogService.deletePost(id)
      this.adminPosts = this.adminPosts.filter((p) => p._id !== id)
    },

    async togglePublish(id: string) {
      const res = await BlogService.togglePublish(id)
      const idx = this.adminPosts.findIndex((p) => p._id === id)
      if (idx !== -1) this.adminPosts[idx] = res.data.post
      return res.data.post
    },
  },
})
