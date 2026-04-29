import APIBase from '@/services/httpBase'

export interface AppUser {
  _id: string
  email: string
  name: string
  accountType: 'admin' | 'copywriter'
  createdAt: string
}

interface CreateUserData {
  email: string
  password: string
  name: string
}

interface UpdateUserData {
  email?: string
  password?: string
  name?: string
  accountType?: 'admin' | 'copywriter'
}

class UserService extends APIBase {
  getUsers() {
    return this.get<{ message: string, users: AppUser[] }>('users')
  }

  createUser(data: CreateUserData) {
    return this.post<{ message: string, user: AppUser }>('users', data)
  }

  updateUser(id: string, data: UpdateUserData) {
    return this.put<{ message: string, user: AppUser }>(`users/${id}`, data)
  }

  deleteUser(id: string) {
    return this.delete<{ message: string }>(`users/${id}`)
  }
}

export default new UserService()
