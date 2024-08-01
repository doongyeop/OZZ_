import Header from '@/components/Header'
import { WeatherProvider } from '@/contexts/WeatherContext'

export default function CoordiRecommendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WeatherProvider>
      <section>
        <Header title="추천 코디" />
        {children}
      </section>
    </WeatherProvider>
  )
}
