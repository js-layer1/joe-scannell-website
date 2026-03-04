import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Geist } from 'next/font/google'
import './globals.css'
import { GoogleAnalytics } from '@next/third-parties/google

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Joe Scannell — Founder, Layer One Group',
  description:
    'Joe Scannell (also known as Joseph Scannell) is the Founder of Layer One Group, a New York PR, digital strategy, and AI advisory firm serving tech and finance.',
  openGraph: {
    title: 'Joe Scannell',
    description: 'Founder of Layer One Group — PR, digital strategy, and AI advisory.',
    url: 'https://joescannell.com',
    siteName: 'Joe Scannell',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Joe Scannell — Founder, Layer One Group',
      },
    ],
    type: 'profile',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joe Scannell — Founder, Layer One Group',
    description: 'Founder of Layer One Group — PR, digital strategy, and AI advisory.',
  },
  alternates: {
    canonical: 'https://joescannell.com',
  },
  verification: {
    // GSC verified via DNS (Domain name provider) — no HTML tag needed
  },
  robots: {
    index: true,
    follow: true,
  },
}

// Person JSON-LD -- MUST stay in this Server Component (not 'use client')
// sameAs uses confirmed social URLs from Plan 01-02 checkpoint
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Joe Scannell',
  alternateName: 'Joseph Scannell',
  url: 'https://joescannell.com',
  image: 'https://joescannell.com/headshot.jpg',
  jobTitle: 'Founder',
  worksFor: {
    '@type': 'Organization',
    name: 'Layer One Group',
    url: 'https://layeronegroup.com',
  },
  sameAs: [
    'https://www.linkedin.com/in/joe-scannell',
    'https://twitter.com/joe_scannell',
    'https://layeronegroup.com',
  ],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="antialiased">
                  <GoogleAnalytics gaId="G-GE2YJQ7E1J" />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema).replace(/</g, '\\u003c'),
          }}
        />
      </body>
    </html>
  )
}
