import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinOrchestra — AI CFO Agent Portfolio",
  description: "An elite AI Chief Financial Officer powered by Claude 3.5 Sonnet. Real-time access to 16 financial tools including bank balances, tax calculation, fraud detection, and revenue forecasting.",
  keywords: ["AI CFO", "financial automation", "n8n", "Claude", "AWS Bedrock", "FinTech"],
  authors: [{ name: "Faisal" }],
  openGraph: {
    title: "FinOrchestra — AI CFO Agent",
    description: "AI-powered financial operations with 16 integrated tools",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💼</text></svg>" />
      </head>
      <body className="h-full">{children}</body>
    </html>
  );
}