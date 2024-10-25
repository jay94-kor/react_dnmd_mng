import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useCreateProject } from '@/hooks/useProjects'

const projectSchema = z.object({
  code: z.string().min(1, '프로젝트 코드를 입력하세요'),
  name: z.string().min(1, '프로젝트명을 입력하세요'),
  managerId: z.number(),
  contractAmount: z.number().min(0, '계약금액을 입력하세요'),
  advanceRate: z.number().min(0).max(100),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string().optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>

export const ProjectFormPage = () => {
  const { mutate: createProject, isLoading } = useCreateProject()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      advanceRate: 50,
    },
  })

  const onSubmit = (data: ProjectFormData) => {
    createProject(data)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">새 프로젝트 등록</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  프로젝트 코드
                </label>
                <Input {...register('code')} error={errors.code?.message} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  프로젝트명
                </label>
                <Input {...register('name')} error={errors.name?.message} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                계약금액
              </label>
              <Input
                type="number"
                {...register('contractAmount', { valueAsNumber: true })}
                error={errors.contractAmount?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                선금 비율 (%)
              </label>
              <Input
                type="number"
                {...register('advanceRate', { valueAsNumber: true })}
                error={errors.advanceRate?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  시작일
                </label>
                <Input
                  type="date"
                  {...register('startDate')}
                  error={errors.startDate?.message}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  종료일
                </label>
                <Input
                  type="date"
                  {...register('endDate')}
                  error={errors.endDate?.message}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                ��명
              </label>
              <textarea
                {...register('description')}
                className="w-full rounded-lg border p-2 min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button">
            취소
          </Button>
          <Button type="submit" loading={isLoading}>
            등록
          </Button>
        </div>
      </form>
    </div>
  )
}
