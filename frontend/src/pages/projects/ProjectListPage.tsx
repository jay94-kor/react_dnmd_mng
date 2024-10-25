import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Filter, SortAsc } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useProjects } from '@/hooks/useProjects'
import { formatCurrency, formatDate } from '@/lib/utils'

export const ProjectListPage = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const { data: projects, isLoading } = useProjects()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">프로젝트 관리</h1>
          <p className="text-sm text-gray-500">
            전체 {projects?.length || 0}개의 프로젝트
          </p>
        </div>
        <Button onClick={() => navigate('/projects/new')}>
          <Plus className="mr-2 h-4 w-4" />
          새 프로젝트
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="프로젝트명, 담당자 검색..."
            className="w-full rounded-lg border pl-10 pr-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          필터
        </Button>
        <Button variant="outline">
          <SortAsc className="mr-2 h-4 w-4" />
          정렬
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {projects?.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer hover:border-primary-500"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {project.code}
                      </span>
                      <span className="rounded-full px-2 py-1 text-xs bg-blue-100 text-blue-800">
                        {project.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">계약금액</p>
                    <p className="font-semibold">
                      {formatCurrency(project.contractAmount)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">담당자</p>
                    <p className="font-medium">{project.manager.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">시작일</p>
                    <p className="font-medium">
                      {formatDate(project.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">종료일</p>
                    <p className="font-medium">{formatDate(project.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">진행률</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-primary-500 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {project.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
