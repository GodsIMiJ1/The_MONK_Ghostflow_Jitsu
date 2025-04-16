import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import './monk-theme.css';
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from '@/lib/theme-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'GodsIMiJ Empire',
  description: 'The GodsIMiJ Empire Knowledge Core',
  icons: {
    icon: ['/favicon.ico', '/monk-logo.svg'],
    apple: '/monk-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/monk-logo.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <TooltipProvider delayDuration={0}>
            <div className="min-h-screen">
              {children}
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
