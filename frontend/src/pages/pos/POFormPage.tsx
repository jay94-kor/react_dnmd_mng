import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useCreatePO } from '@/hooks/usePOs'
import { useProjects } from '@/hooks/useProjects'
import { FileUpload } from '@/components/ui/FileUpload'

const poSchema = z.object({
  projectId: z.number(),
  supplierName: z.string().min(1, '거래처명을 입력하세요'),
  totalAmount: z.number().min(1, '금액을 입력하세요'),
  advanceRate: z.number().min(0).max(100),
  description: z.string().min(10, '적요는 10자 이상 입력하세요'),
  detailedMemo: z.string().optional(),
  category: z.enum(['부가세 10%', '원천세 3.3%', '강사 인건비 8.8%']),
  files: z.object({
    contract: z.any().refine((file) => file instanceof File, '계약서를 첨부하세요'),
    estimate: z.any().refine((file) => file instanceof File, '견적서를 첨부하세요'),
    businessCert: z.any().refine((file) => file instanceof File, '사업자등록증을 첨부하세요'),
    bankAccount: z.any().refine((file) => file instanceof File, '통장사본을 첨부하세요'),
  }),
})

type POFormData = z.infer<typeof poSchema>

export const POFormPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const projectId = searchParams.get('projectId')
  const { data: projects } = useProjects()
  const { mutate: createPO, isLoading } = useCreatePO()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<POFormData>({
    resolver: zodResolver(poSchema),
    defaultValues: {
      projectId: projectId ? Number(projectId) : undefined,
      advanceRate: 50,
      category: '부가세 10%',
    },
  })

  const watchTotalAmount = watch('totalAmount')
  const watchCategory = watch('category')
  const watchAdvanceRate = watch('advanceRate')

  // 자동 계산 결과
  const calculateAmounts = () => {
    if (!watchTotalAmount) return null

    const category = watchCategory
    let supplyAmount: number
    let taxAmount: number

    if (category === '부가세 10%') {
      supplyAmount = Math.floor(watchTotalAmount / 1.1)
      taxAmount = watchTotalAmount - supplyAmount
    } else {
      const taxRate = category === '원천세 3.3%' ? 0.033 : 0.088
      taxAmount = Math.floor(watchTotalAmount * taxRate)
      supplyAmount = watchTotalAmount - taxAmount
    }

    const advanceAmount = Math.floor(supplyAmount * (watchAdvanceRate / 100))
    const balanceAmount = supplyAmount - advanceAmount

    return {
      supplyAmount,
      taxAmount,
      advanceAmount,
      balanceAmount,
    }
  }

  const amounts = calculateAmounts()

  const onSubmit = (data: POFormData) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'files') {
        Object.entries(value).forEach(([fileKey, file]) => {
          formData.append(fileKey, file as File)
        })
      } else {
        formData.append(key, String(value))
      }
    })

    createPO(formData)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">PO 발행</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 프로젝트 선택 */}
        <Card>
          <CardHeader>
            <CardTitle>프로젝트 선택</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              className="w-full rounded-lg border p-2"
              {...register('projectId', { valueAsNumber: true })}
            >
              <option value="">프로젝트 선택</option>
              {projects?.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.code} - {project.name}
                </option>
              ))}
            </select>
            {errors.projectId && (
              <p className="mt-1 text-sm text-red-500">{errors.projectId.message}</p>
            )}
          </CardContent>
        </Card>

        {/* 거래처 및 금액 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>거래처 및 금액 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">거래처명</label>
              <Input {...register('supplierName')} error={errors.supplierName?.message} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">총액</label>
                <Input
                  type="number"
                  {...register('totalAmount', { valueAsNumber: true })}
                  error={errors.totalAmount?.message}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">거래 분류</label>
                <select
                  className="w-full rounded-lg border p-2"
                  {...register('category')}
                >
                  <option value="부가세 10%">부가세 10%</option>
                  <option value="원천세 3.3%">원천세 3.3%</option>
                  <option value="강사 인건비 8.8%">강사 인건비 8.8%</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">선금 비율 (%)</label>
              <Input
                type="number"
                {...register('advanceRate', { valueAsNumber: true })}
                error={errors.advanceRate?.message}
              />
            </div>

            {/* 자동 계산 결과 */}
            {amounts && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
                <p className="font-medium">계산 결과</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">공급가액</p>
                    <p className="font-medium">
                      {new Intl.NumberFormat('ko-KR').format(amounts.supplyAmount)}원
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">세액</p>
                    <p className="font-medium">
                      {new Intl.NumberFormat('ko-KR').format(amounts.taxAmount)}원
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">선금</p>
                    <p className="font-medium">
                      {new Intl.NumberFormat('ko-KR').format(amounts.advanceAmount)}원
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">잔금</p>
                    <p className="font-medium">
                      {new Intl.NumberFormat('ko-KR').format(amounts.balanceAmount)}원
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 적요 및 메모 */}
        <Card>
          <CardHeader>
            <CardTitle>적요 및 메모</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                적요 <span className="text-gray-500">(필수)</span>
              </label>
              <textarea
                className="w-full rounded-lg border p-2 min-h-[100px]"
                {...register('description')}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                상세 메모 <span className="text-gray-500">(선택)</span>
              </label>
              <textarea
                className="w-full rounded-lg border p-2 min-h-[100px]"
                {...register('detailedMemo')}
              />
            </div>
          </CardContent>
        </Card>

        {/* 파일 첨부 */}
        <Card>
          <CardHeader>
            <CardTitle>필수 첨부파일</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <FileUpload
              label="계약서"
              accept=".pdf,.doc,.docx"
              onChange={(file) => setValue('files.contract', file)}
              error={errors.files?.contract?.message}
            />
            <FileUpload
              label="견적서"
              accept=".pdf,.doc,.docx"
              onChange={(file) => setValue('files.estimate', file)}
              error={errors.files?.estimate?.message}
            />
            <FileUpload
              label="사업자등록증"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(file) => setValue('files.businessCert', file)}
              error={errors.files?.businessCert?.message}
            />
            <FileUpload
              label="통장사본"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(file) => setValue('files.bankAccount', file)}
              error={errors.files?.bankAccount?.message}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            취소
          </Button>
          <Button type="submit" loading={isLoading}>
            PO 발행
          </Button>
        </div>
      </form>
    </div>
  )
}