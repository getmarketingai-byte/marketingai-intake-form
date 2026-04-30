import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pre-Call Intake Form — MarketingAI',
  description: 'Tell us about your business before your strategy call so we can make every minute count.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-2Q8MGZ47BC" />
        <script dangerouslySetInnerHTML={{__html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-2Q8MGZ47BC');
        `}} />
        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7076137753154472" crossOrigin="anonymous" />
        {/* Vercel Analytics */}
        <script dangerouslySetInnerHTML={{__html: `window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };`}} />
        <script defer src="/_vercel/insights/script.js" />
        {/* Vercel Speed Insights */}
        <script dangerouslySetInnerHTML={{__html: `window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };`}} />
        <script defer src="/_vercel/speed-insights/script.js" />
      </head>
      <body>{children}</body>
    </html>
  )
}
