import type { Metadata } from 'next'
import { Inter, Quicksand } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
})

export const metadata: Metadata = {
  title: 'Pookie Todo - Your AI Task Assistant',
  description: 'A delightful AI-powered todo application with natural language processing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.variable + ' ' + quicksand.variable}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}
