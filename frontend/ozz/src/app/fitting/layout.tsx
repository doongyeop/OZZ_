import Header from '@/components/Header'

export default function FittingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      <Header title="가상 피팅" />
      {children}
    </section>
  )
}
