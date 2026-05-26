import { Ubuntu } from "next/font/google";
import "./globals.css";

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata = {
  title: "SABER | Parallel & Asynchronous Smart Contract Execution",
  description: "A high-performance paradigm for parallel and asynchronous smart contract execution. Blockchain Seminar Presentation by Aya khalila.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={ubuntu.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>{children}</body>
    </html>
  );
}
