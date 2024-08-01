import Header from '@/components/Header'

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
