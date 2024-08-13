import Navbar from '@/components/Navbar'
import { SelectedColorProvider } from '@/contexts/SelectedColorContext'
import { SelectedItemProvider } from '@/contexts/SelectedItemContext'
import { CategorySidebarProvider } from '@/contexts/CategorySidebarContext'
import '@/styles/global.css'
import localFont from 'next/font/local'
import type { Viewport } from 'next'
import Providers from './providers'

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
})

export const metadata = {
  title: '옷짱: OZZ',
  description: '내 손안의 작은 옷장',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${pretendard.variable}`}>
      <body className={`${pretendard.className}`}>
        <Providers>
          <CategorySidebarProvider>
            <SelectedItemProvider>
              <SelectedColorProvider>
                <div id="wrapper">
                  <div className="pt-20">{children}</div>
                  <Navbar />
                </div>
              </SelectedColorProvider>
            </SelectedItemProvider>
          </CategorySidebarProvider>
        </Providers>
      </body>
    </html>
  )
}
