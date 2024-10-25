import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { usePOs } from '@/hooks/usePOs'
import { formatCurrency, formatDate } from '@/lib/utils'

export const POListPage = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const { data: pos, isLoading } = usePOs()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">PO 관리</h1>
          <p className="text-sm text-gray-500">
            전체 {pos?.length || 0}개의 PO
          </p>
        </div>
        <Button onClick={() => navigate('/pos/new')}>
          <Plus className="mr-2 h-4 w-4" />
          PO 발행
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="PO 번호, 거래처명 검색..."
            className="w-full rounded-lg border pl-10 pr-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          필터
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {pos?.map((po) => (
            <Card
              key={po.id}
              className="cursor-pointer hover:border-primary-500"
              onClick={() => navigate(`/pos/${po.id}`)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-500">{po.poNumber}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        po.status === '승인' 
                          ? 'bg-green-100 text-green-800'
                          : po.status === '반려' 
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {po.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">{po.supplierName}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">총액</p>
                    <p className="font-semibold">
                      {formatCurrency(po.totalAmount)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">프로젝트</p>
                    <p className="font-medium">{po.project.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">발행일</p>
                    <p className="font-medium">{formatDate(po.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">발행자</p>
                    <p className="font-medium">{po.createdBy.name}</p>
                  </div>
                  {po.status === '승인' && (
                    <div>
                      <p className="text-sm text-gray-500">승인자</p>
                      <p className="font-medium">{po.approvedBy?.name}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
