'use client'

import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { useEffect } from 'react'

const CoordiBookDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const { id } = params

  useEffect(() => {
    if (id) {
      console.log(`현재 ID: ${id}`)
    }
  }, [id])

  if (!id) return <p>Loading...</p>

  return (
    <div>
      <Header title={`코디북 ${id}`} />
      <h1>디테일 페이지입니다</h1>
      <p>ID: {id}</p>
    </div>
  )
}

export default CoordiBookDetailPage
