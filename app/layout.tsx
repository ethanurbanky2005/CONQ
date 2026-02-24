import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'CONQ — See the Invisible. Move Sooner. Recover Better.',
  description:
    'CONQ builds biometric wearable technology for objective concussion monitoring and recovery guidance. Empowering athletes, clinicians, and organizations with real-time cognitive health data.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      {
        url: '/conq-icon-32.png',
        sizes: '32x32',
        type: 'image/png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/conq-icon-dark-32.png',
        sizes: '32x32',
        type: 'image/png',
        media: '(prefers-color-scheme: dark)',
      },
      { url: '/conq-icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/conq-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/conq-icon-180.png',
  },
  openGraph: {
    title: 'CONQ — See the Invisible. Move Sooner. Recover Better.',
    description:
      'Biometric smart glasses for objective concussion monitoring. Presidents Challenge 2026 — University of Western Ontario.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0F172A',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
