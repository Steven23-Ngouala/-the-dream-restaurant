"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Menu, ShoppingCart, User, Phone } from "lucide-react"
import { usePanier } from "@/context/PanierContext"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { panier } = usePanier();
  const cartItemsCount = panier.reduce((sum, item) => sum + item.quantite, 0);

  const navItems = [
    { href: "/", label: "Accueil" },
    { href: "/menu", label: "Menu" },
    { href: "/reservation", label: "Réservation" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/placeholder-logo.png" alt="Logo du restaurant" width={100} height={100} className="rounded-full" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/connexion">
                <User className="w-4 h-4 mr-2" />
                Connexion
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="relative bg-transparent">
              <Link href="/panier">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Panier
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs px-1.5 py-0.5">
                    {cartItemsCount}
                  </Badge>
                )}
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700">
              <Link href="/commande">
                <Phone className="w-4 h-4 mr-2" />
                Commander
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium text-gray-700 hover:text-orange-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="border-t pt-4 space-y-3">
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/connexion" onClick={() => setIsOpen(false)}>
                      <User className="w-4 h-4 mr-2" />
                      Connexion
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start relative bg-transparent">
                    <Link href="/panier" onClick={() => setIsOpen(false)}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Panier
                      {cartItemsCount > 0 && (
                        <Badge className="ml-auto bg-orange-600 text-white">{cartItemsCount}</Badge>
                      )}
                    </Link>
                  </Button>
                  <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                    <Link href="/commande" onClick={() => setIsOpen(false)}>
                      <Phone className="w-4 h-4 mr-2" />
                      Commander
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
