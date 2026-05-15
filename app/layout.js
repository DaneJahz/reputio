import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'OwnerReply — AI-Powered Google Review Responses',
  description: 'Automatically respond to Google reviews with AI. Save time and protect your reputation.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard">
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
        <head>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-DCHE6BN1FD"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-DCHE6BN1FD');
            `}
          </Script>
        </head>
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}