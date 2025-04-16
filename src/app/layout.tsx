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
  title: 'The MONK',
  description: 'A temple for those who seek to code, write, or think with intention.',
  icons: {
    icon: ['/the_MONK-ICON.png'],
    apple: '/the_MONK-APP_ICON.png',
    shortcut: '/the_MONK-ICON.png',
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
        <link rel="icon" href="/the_MONK-ICON.png" type="image/png" />
        <link rel="apple-touch-icon" href="/the_MONK-APP_ICON.png" />
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
