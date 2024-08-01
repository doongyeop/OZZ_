import Header from '@/components/Header'
import { SelectedItemProvider } from '@/contexts/SelectedItemContext'
import { SelectedColorProvider } from '@/contexts/SelectedColorContext'

export default function CoordiRecommendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      <Header title="추천 코디" />
      {children}
    </section>
  )
}
