import React from "react";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "情报引擎",
  description: "面向多维信息检索、筛选和每日情报查看的情报引擎",
  icons: {
    icon: "/Logo.png",
    apple: "/Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
