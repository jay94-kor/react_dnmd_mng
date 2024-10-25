import { useParams, useNavigate } from 'react-router-dom'
import { Edit, FileText, Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useProject } from '@/hooks/useProjects'
import { formatCurrency, formatDate } from '@/lib/utils'
import { POList } from '@/components/po/POList'
import { ProjectBudgetChart } from '@/components/projects/ProjectBudgetChart'

export const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: project, isLoading } = useProject(Number(id))

  if (isLoading) return <div>Loading...</div>
  if (!project) return <div>Project not found</div>

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-gray-500">{project.code}</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              project.status === '진행중' 
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {project.status}
            </span>
          </div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(`/projects/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            수정
          </Button>
          <Button onClick={() => navigate(`/pos/new?projectId=${id}`)}>
            <Plus className="mr-2 h-4 w-4" />
            PO 발행
          </Button>
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>프로젝트 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">담당자</dt>
                <dd className="font-medium">{project.manager.name}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">부서</dt>
                <dd className="font-medium">{project.manager.department}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">시작일</dt>
                <dd className="font-medium">{formatDate(project.startDate)}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">종료일</dt>
                <dd className="font-medium">{formatDate(project.endDate)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>계약 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-gray-500">계약금액</dt>
                <dd className="text-2xl font-bold">
                  {formatCurrency(project.contractAmount)}
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">공급가액</dt>
                  <dd className="font-medium">
                    {formatCurrency(project.supplyAmount)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">부가세</dt>
                  <dd className="font-medium">
                    {formatCurrency(project.taxAmount)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">선금 비율</dt>
                  <dd className="font-medium">{project.advanceRate}%</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">잔금 비율</dt>
                  <dd className="font-medium">{project.balanceRate}%</dd>
                </div>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* 예산 현황 */}
      <Card>
        <CardHeader>
          <CardTitle>예산 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <ProjectBudgetChart project={project} />
          </div>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500">총 예산</p>
              <p className="text-lg font-bold">{formatCurrency(project.totalBudget)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">집행액</p>
              <p className="text-lg font-bold">{formatCurrency(project.usedBudget)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">잔여 예산</p>
              <p className="text-lg font-bold">{formatCurrency(project.remainingBudget)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">집행률</p>
              <p className="text-lg font-bold">{project.budgetUsageRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PO 목록 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>PO 목록</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`/pos/new?projectId=${id}`)}
          >
            PO 발행
          </Button>
        </CardHeader>
        <CardContent>
          <POList projectId={Number(id)} />
        </CardContent>
      </Card>
    </div>
  )
}
