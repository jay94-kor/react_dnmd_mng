import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuthContext } from '@/contexts/AuthContext'

export function SettingsPage() {
  const { user } = useAuthContext()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">설정</h1>

      <Card>
        <CardHeader>
          <CardTitle>사용자 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">이름</dt>
              <dd className="font-medium">{user?.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">이메일</dt>
              <dd className="font-medium">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">부서</dt>
              <dd className="font-medium">{user?.department || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">직책</dt>
              <dd className="font-medium">{user?.position || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">권한</dt>
              <dd className="font-medium">
                {user?.isAdmin ? '관리자' : '일반 사용자'}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
