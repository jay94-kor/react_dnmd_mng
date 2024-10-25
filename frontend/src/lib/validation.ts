import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, '아이디를 입력하세요'),
  password: z.string().min(1, '비밀번호를 입력하세요'),
})

export const projectSchema = z.object({
  code: z.string().min(1, '프로젝트 코드를 입력하세요'),
  name: z.string().min(1, '프로젝트명을 입력하세요'),
  managerId: z.number({
    required_error: '담당자를 선택하세요',
  }),
  contractAmount: z.number({
    required_error: '계약금액을 입력하세요',
  }).min(0, '0원 이상 입력하세요'),
  advanceRate: z.number({
    required_error: '선금 비율을 입력하세요',
  }).min(0, '0% 이상').max(100, '100% 이하'),
  startDate: z.string({
    required_error: '시작일을 선택하세요',
  }),
  endDate: z.string({
    required_error: '종료일을 선택하세요',
  }),
  description: z.string().optional(),
})

export const poSchema = z.object({
  projectId: z.number({
    required_error: '프로젝트를 선택하세요',
  }),
  supplierName: z.string().min(1, '거래처명을 입력하세요'),
  totalAmount: z.number({
    required_error: '금액을 입력하세요',
  }).min(0, '0원 이상 입력하세요'),
  advanceRate: z.number({
    required_error: '선금 비율을 입력하세요',
  }).min(0, '0% 이상').max(100, '100% 이하'),
  category: z.enum(['부가세 10%', '원천세 3.3%', '강사 인건비 8.8%'], {
    required_error: '거래 분류를 선택하세요',
  }),
  description: z.string().min(10, '적요는 10자 이상 입력하세요'),
  detailedMemo: z.string().optional(),
  files: z.object({
    contract: z.any().refine((file) => file instanceof File, '계약서를 첨부하세요'),
    estimate: z.any().refine((file) => file instanceof File, '견적서를 첨부하세요'),
    businessCert: z.any().refine((file) => file instanceof File, '사업자등록증을 첨부하세요'),
    bankAccount: z.any().refine((file) => file instanceof File, '통장사본을 첨부하세요'),
  }),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type ProjectFormData = z.infer<typeof projectSchema>
export type POFormData = z.infer<typeof poSchema>
