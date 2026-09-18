import type { Metadata } from 'next';
import localFont from 'next/font/local';

import '@/styles/global.css';
import { themeClass } from '@/styles/theme.css';

import Providers from './providers';

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  weight: '45 920',
  display: 'swap',
  variable: '--font-pretendard',
});

// Montserrat : 영문
// Pretendard : 한글, 숫자
const montserrat = localFont({
  src: '../fonts/Montserrat-VariableFont_wght.ttf',
  weight: '100 900',
  display: 'swap',
  variable: '--font-montserrat',
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'U+0041-005A, U+0061-007A, U+00C0-024F' }],
});

export const metadata: Metadata = {
  title: 'To You',
  description: 'To You',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} ${montserrat.variable} ${themeClass}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
