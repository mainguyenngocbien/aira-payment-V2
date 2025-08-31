import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthRedirectHandler from '@/components/AuthRedirectHandler'
import FirebaseDebug from '@/components/FirebaseDebug'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AIRA Payment - Authentication',
  description: 'Secure authentication system with Google and Apple Sign-In',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="aira">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <AuthRedirectHandler />
          <FirebaseDebug />
          {children}
        </div>
      </body>
    </html>
  )
}
