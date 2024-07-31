import Header from '@/components/Header'
import ProfileEdit from '@/containers/my-page/edit'

export default function ProfileEditPage() {
  return (
    <div className="space-y-12">
      <Header title="회원 정보 수정" />
      <ProfileEdit />
    </div>
  )
}
