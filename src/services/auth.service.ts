import APIBase from '@/services/httpBase'

interface LoginResponse {
  access_token: string
  user: {
    id: string
    email: string
    name: string
    accountType: 'admin' | 'copywriter'
  }
}

class AuthService extends APIBase {
  async login(email: string, password: string) {
    return this.post<LoginResponse>('auth/login', { email, password })
  }
}

export default new AuthService()
