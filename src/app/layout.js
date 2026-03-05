import '@ant-design/v5-patch-for-react-19';
import "./globals.css";
import { Cookie } from 'next/font/google'
import { Icon } from 'lucide-react';


const cookie = Cookie({
  variable: '--font-cookie',
  weight: '400',
  fontFamily: 'Cookie, cursive',
  fontStyle: 'normal',
})

export const metadata = {
  title: "Poppi Makecup",
  description: "Poppi Makecup website",
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
