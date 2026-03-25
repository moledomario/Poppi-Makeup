import '@ant-design/v5-patch-for-react-19';
import "./globals.css";
import { Cookie, Anton, Work_Sans, Vidaloka } from 'next/font/google'


const vidaloka = Vidaloka({
  variable: '--font-vidaloka',
  weight: '400',
  fontFamily: 'Vidaloka, serif',
  fontStyle: 'normal',
})

const cookie = Cookie({
  variable: '--font-cookie',
  weight: '400',
  fontFamily: 'Cookie, cursive',
  fontStyle: 'normal',
})
const anton = Anton({
  variable: '--font-anton',
  weight: '400',
  fontFamily: 'Anton, sans-serif',
  fontStyle: 'normal',
})

const work_sans = Work_Sans({
  variable: '--font-work_sans',
  weight: '400',
  fontFamily: 'Work Sans, sans-serif',
  fontStyle: 'normal',
})
export const metadata = {
  title: "Poppi Makeup",
  description: "Poppi Makeup website",
  icons: '/hero-img.jpeg',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
