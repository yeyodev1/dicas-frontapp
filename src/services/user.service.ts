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

class UserService extends APIBase {
  getUsers() {
    return this.get<AppUser[]>('users')
  }

  createUser(data: CreateUserData) {
    return this.post<AppUser>('users', data)
  }
}

export default new UserService()
