import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface PO {
  id: number
  poNumber: string
  project: {
    id: number
    name: string
  }
  supplierName: string
  totalAmount: number
  supplyAmount: number
  taxAmount: number
  advanceAmount: number
  balanceAmount: number
  advanceRate: number
  balanceRate: number
  category: string
  status: string
  description: string
  detailedMemo?: string
  createdAt: string
  updatedAt: string
  createdBy: {
    id: number
    name: string
  }
  approvedBy?: {
    id: number
    name: string
  }
}

export function usePOs(projectId?: number) {
  return useQuery<PO[]>({
    queryKey: ['pos', { projectId }],
    queryFn: async () => {
      const response = await api.get('/pos', {
        params: { projectId },
      })
      return response.data
    },
  })
}

export function usePO(id: number) {
  return useQuery<PO>({
    queryKey: ['pos', id],
    queryFn: async () => {
      const response = await api.get(`/pos/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreatePO() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.post('/pos', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pos'] })
      queryClient.invalidateQueries({ queryKey: ['projects', data.project.id] })
    },
  })
}

export function useApprovePO() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/pos/${id}/approve`)
      return response.data
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['pos'] })
      queryClient.invalidateQueries({ queryKey: ['pos', id] })
    },
  })
}

export function useRejectPO() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      const response = await api.post(`/pos/${id}/reject`, { reason })
      return response.data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['pos'] })
      queryClient.invalidateQueries({ queryKey: ['pos', id] })
    },
  })
}
