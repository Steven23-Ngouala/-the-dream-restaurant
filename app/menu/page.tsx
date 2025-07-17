"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ChefHat } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { usePanier } from "@/context/PanierContext"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

export default function MenuPage() {
  const [menu, setMenu] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  // Recherche et filtres
  const [search, setSearch] = useState("")
  // const [filterVeg, setFilterVeg] = useState(false)
  // const [filterSpicy, setFilterSpicy] = useState(false)
  // const [sortPrice, setSortPrice] = useState<"asc"|"desc"|"">("")

  const { ajouterPlat } = usePanier();

  useEffect(() => {
    fetchMenu()
  }, [])

  async function fetchMenu() {
    setLoading(true)
    const { data } = await supabase
      .from("menu")
      .select("*")
      .eq("archived", false)
      .order("created_at", { ascending: false })
    setMenu(data || [])
    setLoading(false)
  }

  // Recherche et filtres simples
  let filtered = menu
  if (search) {
    filtered = filtered.filter((item: any) =>
      item.nom.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
    )
  }
  // if (filterVeg) {
  //   filtered = filtered.filter((item: any) => item.vegetarian)
  // }
  // if (filterSpicy) {
  //   filtered = filtered.filter((item: any) => item.spicy)
  // }
  // if (sortPrice) {
  //   filtered = [...filtered].sort((a: any, b: any) => sortPrice === "asc" ? a.prix - b.prix : b.prix - a.prix)
  // }

  const addToCart = (item: any) => {
    ajouterPlat({
      id: item.id,
      nom: item.nom,
      prix: item.prix,
      image_url: item.image_url,
      quantite: 1
    });
    toast({
      title: "Ajouté au panier !",
      description: `${item.nom} a été ajouté à votre panier.`
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Notre Menu</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez nos plats authentiques préparés avec passion et des ingrédients frais
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Barre de recherche et filtres */}
        <div className="flex flex-wrap gap-4 mb-8 items-center justify-between">
          <input
            type="text"
            placeholder="Rechercher un plat ou une boisson..."
            className="border rounded px-4 py-2 w-full md:w-1/3"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {/*
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={filterVeg} onChange={e => setFilterVeg(e.target.checked)} /> Végétarien
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={filterSpicy} onChange={e => setFilterSpicy(e.target.checked)} /> Épicé
          </label>
          <select
            className="border rounded px-2 py-2"
            value={sortPrice}
            onChange={e => setSortPrice(e.target.value as any)}
          >
            <option value="">Trier par prix</option>
            <option value="asc">Prix croissant</option>
            <option value="desc">Prix décroissant</option>
          </select>
          */}
        </div>

        {/* Menu Items */}
        {loading ? (
          <div>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div>Aucun plat ou boisson trouvé.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item: any) => (
              <Card
                key={item.id}
                className={`overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className="relative h-48 group">
                  <Image
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.nom}
                    fill
                    className="object-cover rounded-xl border-4 border-orange-500 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex gap-2">
                    {item.is_plat_du_jour && (
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                        <ChefHat className="w-3 h-3 mr-1" />
                        Plat du Jour
                      </Badge>
                    )}
                    {item.is_specialite && <Badge className="bg-orange-600">Spécialité</Badge>}
                    {item.vegetarian && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Végétarien
                      </Badge>
                    )}
                    {item.spicy && <Badge variant="destructive">Épicé</Badge>}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800">{item.nom}</h3>
                    <span className="text-xl font-bold text-orange-600">{item.prix} FCFA</span>
                  </div>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    {item.rating && (
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">{item.rating}</span>
                      </div>
                    )}
                    <div className="flex gap-2 w-full">
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700 flex-1" onClick={() => addToCart(item)}>
                        Ajouter au panier
                      </Button>
                      <Link href="/panier" className="self-center text-orange-700 underline text-sm ml-2">Voir panier</Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* Bloc info plat du jour en bas de page */}
      <div className="max-w-xl mx-auto mt-16 mb-8 p-8 rounded-lg border bg-gradient-to-br from-orange-50 to-red-50 text-center">
        <h2 className="text-xl font-bold mb-2">Ne manquez pas notre plat du jour !</h2>
        <p className="mb-4 text-gray-700">Chaque jour, notre chef vous propose une création unique inspirée des saveurs traditionnelles africaines.</p>
        <div className="flex justify-center gap-4">
          <Link href="/panier" className="underline">Voir mon panier</Link>
          <Link href="/reservation" className="underline">Réserver une table</Link>
        </div>
      </div>
    </div>
  )
}
