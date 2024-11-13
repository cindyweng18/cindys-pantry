'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import theme from "./theme";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

const inter = Inter({ subsets: ["latin"] });
const newTheme = createTheme(theme('light'));

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <ThemeProvider theme={newTheme}>
      <html lang="en">
        <head>
          <title>Cindy&apos;s Pantry</title>
        </head>
        <body className={inter.className}>{children}</body>
      </html>
    </ThemeProvider>
    </ClerkProvider>
      
  );
}
