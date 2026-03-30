import './globals.css';

export const metadata = {
  title: '장위 365경희한의원 - 프리미엄 내원안내문',
  description: 'AI 기반 맞춤형 한의원 내원안내문 생성기',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
