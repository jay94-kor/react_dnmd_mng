export const PROJECT_STATUS_MAP = {
  '준비중': {
    label: '준비중',
    color: 'gray',
  },
  '진행중': {
    label: '진행중',
    color: 'blue',
  },
  '완료': {
    label: '완료',
    color: 'green',
  },
  '보류': {
    label: '보류',
    color: 'yellow',
  },
} as const

export const PO_STATUS_MAP = {
  '대기중': {
    label: '대기중',
    color: 'yellow',
  },
  '승인': {
    label: '승인',
    color: 'green',
  },
  '반려': {
    label: '반려',
    color: 'red',
  },
} as const

export const PO_CATEGORY_MAP = {
  '부가세 10%': {
    label: '부가세 10%',
    taxRate: 0.1,
    description: '일반과세자 간 거래',
  },
  '원천세 3.3%': {
    label: '원천세 3.3%',
    taxRate: 0.033,
    description: '사업소득에 대한 원천징수',
  },
  '강사 인건비 8.8%': {
    label: '강사 인건비 8.8%',
    taxRate: 0.088,
    description: '기타소득에 대한 원천징수',
  },
} as const
