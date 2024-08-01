import { createClothing } from '@/services/clothingApi'
import ClothingForm from '@/containers/closet-page/ClothingForm'

export default function Page() {
  // const handleSubmit = async (data: FormData) => {
  //   try {
  //     await createClothing(data)
  //     // 성공 처리 (예: 알림 표시, 페이지 이동 등)
  //   } catch (error) {
  //     // 에러 처리
  //   }
  // }
  return (
    <main>
      <ClothingForm onSubmit={createClothing} submitButtonText="등록하기" />
    </main>
  )
}
