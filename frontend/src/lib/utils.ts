import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// 클래스명 병합 유틸리티
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 통화 포맷팅
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount)
}

// 날짜 포맷팅
export function formatDate(dateString: string, showTime: boolean = false) {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(showTime && {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }
  
  return new Intl.DateTimeFormat('ko-KR', options).format(date)
}

// 파일 크기 포맷팅
export function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

// 숫자 포맷팅
export function formatNumber(number: number) {
  return new Intl.NumberFormat('ko-KR').format(number)
}

// 퍼센트 포맷팅
export function formatPercent(number: number) {
  return `${number.toFixed(1)}%`
}
