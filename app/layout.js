'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { theme } from "./theme";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <html lang="en">
        <head>
          <title>Cindy's Pantry</title>
        </head>
        <body className={inter.className}>{children}</body>
      </html>
    </ThemeProvider>
      
  );
}
