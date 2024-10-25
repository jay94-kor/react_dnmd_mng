import { useParams, useNavigate } from 'react-router-dom'
import { Download, ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { usePO, useApprovePO, useRejectPO } from '@/hooks/usePOs'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { Dialog } from '@/components/ui/Dialog'
import { useState } from 'react'

export const PODetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: po, isLoading } = usePO(Number(id))
  const { mutate: approvePO } = useApprovePO()
  const { mutate: rejectPO } = useRejectPO()
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  if (isLoading) return <div>Loading...</div>
  if (!po) return <div>PO not found</div>

  const handleApprove = () => {
    if (confirm('해당 PO를 승인하시겠습니까?')) {
      approvePO(Number(id))
    }
  }

  const handleReject = () => {
    if (!rejectReason.trim()) return
    rejectPO({ id: Number(id), reason: rejectReason })
    setRejectDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
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
            <h1 className="text-2xl font-bold">{po.supplierName}</h1>
          </div>
        </div>

        {user?.isAdmin && po.status === '대기중' && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(true)}
              className="text-red-600 hover:bg-red-50"
            >
              <XCircle className="mr-2 h-4 w-4" />
              반려
            </Button>
            <Button onClick={handleApprove}>
              <CheckCircle className="mr-2 h-4 w-4" />
              승인
            </Button>
          </div>
        )}
      </div>

      {/* 기본 정보 */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">프로젝트</dt>
                <dd className="font-medium">{po.project.name}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">거래 분류</dt>
                <dd className="font-medium">{po.category}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">발행일</dt>
                <dd className="font-medium">{formatDate(po.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">발행자</dt>
                <dd className="font-medium">{po.createdBy.name}</dd>
              </div>
              {po.status !== '대기중' && (
                <>
                  <div>
                    <dt className="text-sm text-gray-500">
                      {po.status === '승인' ? '승인일' : '반려일'}
                    </dt>
                    <dd className="font-medium">{formatDate(po.updatedAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">
                      {po.status === '승인' ? '승인자' : '반려자'}
                    </dt>
                    <dd className="font-medium">{po.approvedBy?.name}</dd>
                  </div>
                </>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>금액 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-gray-500">총액</dt>
                <dd className="text-2xl font-bold">
                  {formatCurrency(po.totalAmount)}
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">공급가액</dt>
                  <dd className="font-medium">
                    {formatCurrency(po.supplyAmount)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">세액</dt>
                  <dd className="font-medium">
                    {formatCurrency(po.taxAmount)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">선금</dt>
                  <dd className="font-medium">
                    {formatCurrency(po.advanceAmount)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">잔금</dt>
                  <dd className="font-medium">
                    {formatCurrency(po.balanceAmount)}
                  </dd>
                </div>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* 적요 및 메모 */}
      <Card>
        <CardHeader>
          <CardTitle>적요 및 메모</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">적요</h3>
            <p className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
              {po.description}
            </p>
          </div>
          {po.detailedMemo && (
            <div>
              <h3 className="text-sm font-medium mb-2">상세 메모</h3>
              <p className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                {po.detailedMemo}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 첨부파일 */}
      <Card>
        <CardHeader>
          <CardTitle>첨부파일</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: '계약서', key: 'contract' },
              { label: '견적서', key: 'estimate' },
              { label: '사업자등록증', key: 'businessCert' },
              { label: '통장사본', key: 'bankAccount' },
            ].map((file) => (
              <Button
                key={file.key}
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => window.open(`/api/files/${po.id}/${file.key}`)}
              >
                <Download className="h-5 w-5" />
                <span>{file.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 반려 다이얼로그 */}
      <Dialog 
        open={rejectDialogOpen} 
        onClose={() => setRejectDialogOpen(false)}
      >
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">PO 반려</h2>
          <div>
            <label className="block text-sm font-medium mb-2">
              반려 사유
            </label>
            <textarea
              className="w-full rounded-lg border p-2 min-h-[100px]"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="반려 사유를 입력하세요"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              onClick={handleReject}
              disabled={!rejectReason.trim()}
            >
              반려
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}