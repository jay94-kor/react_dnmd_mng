import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'

interface LoginData {
  username: string
  password: string
}

interface User {
  id: number
  username: string
  name: string
  email: string
  isAdmin: boolean
}

export function useAuth() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: user } = useQuery<User>({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const response = await api.get('/auth/me')
        return response.data
      } catch (error) {
        // 401 에러시 로그인 페이지로 리다이렉트
        navigate('/login', { replace: true })
        throw error
      }
    },
  })

  const login = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await api.post('/auth/login', data)
      return response.data
    },
    onSuccess: (data) => {
      // 토큰 저장
      localStorage.setItem('token', data.access_token)
      // 사용자 정보 갱신
      queryClient.invalidateQueries({ queryKey: ['user'] })
      navigate('/', { replace: true })
    },
  })

  const logout = () => {
    localStorage.removeItem('token')
    queryClient.clear()
    navigate('/login', { replace: true })
  }

  return {
    user,
    login,
    logout,
  }
}
