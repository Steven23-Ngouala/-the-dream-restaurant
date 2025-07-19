import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"
import { PanierProvider } from "@/context/PanierContext";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "The Dream - Restaurant Africain",
  description: "Découvrez les saveurs authentiques de l'Afrique au restaurant The Dream",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <PanierProvider>
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </PanierProvider>
      </body>
    </html>
  )
}
