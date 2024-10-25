export interface User {
  id: number
  username: string
  name: string
  email: string
  department?: string
  position?: string
  isAdmin: boolean
  createdAt: string
  lastLogin?: string
}

export interface Project {
  id: number
  code: string
  name: string
  description?: string
  status: ProjectStatus
  contractAmount: number
  supplyAmount: number
  taxAmount: number
  advanceRate: number
  balanceRate: number
  startDate: string
  endDate: string
  totalBudget: number
  advanceBudget: number
  balanceBudget: number
  manager: User
  createdBy: User
  createdAt: string
  updatedAt: string
}

export type ProjectStatus = '준비중' | '진행중' | '완료' | '보류'

export interface PO {
  id: number
  poNumber: string
  project: Pick<Project, 'id' | 'name' | 'code'>
  supplierName: string
  totalAmount: number
  supplyAmount: number
  taxAmount: number
  advanceAmount: number
  balanceAmount: number
  advanceRate: number
  balanceRate: number
  category: POCategory
  status: POStatus
  description: string
  detailedMemo?: string
  createdBy: Pick<User, 'id' | 'name'>
  approvedBy?: Pick<User, 'id' | 'name'>
  createdAt: string
  updatedAt: string
  files: POFiles
}

export type POCategory = '부가세 10%' | '원천세 3.3%' | '강사 인건비 8.8%'
export type POStatus = '대기중' | '승인' | '반려'

export interface POFiles {
  contract: string
  estimate: string
  businessCert: string
  bankAccount: string
}
