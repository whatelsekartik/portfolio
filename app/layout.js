import './globals.css';

export const metadata = {
  title: 'Kartik Gaikwad | Personal Brand Portfolio',
  description:
    'Premium animated Next.js portfolio for Kartik Gaikwad featuring academics, GitHub projects, mobile app work, and a modern tech-forward identity.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
