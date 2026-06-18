import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/components/Toast'

export const metadata: Metadata = {
  title: 'Stageside Recruitment — Music Industry Staffing',
  description: 'Specialist music industry temporary staffing across UK, Ireland, Ibiza, Croatia, Netherlands and Belgium.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
