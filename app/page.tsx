"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, MapPin, Phone, Calendar, ChefHat } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { supabase } from "@/lib/supabaseClient"
import { useEffect, useState } from "react"
import { usePanier } from "@/context/PanierContext"
import { toast } from "@/hooks/use-toast"

export default function HomePage() {
  // --- Plat du jour dynamique ---
  const [platDuJour, setPlatDuJour] = useState<any>(null)
  const [specialites, setSpecialites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Plat du jour
      const { data: platJour } = await supabase
        .from("menu")
        .select("*")
        .eq("is_plat_du_jour", true)
        .eq("archived", false)
        .maybeSingle();
      setPlatDuJour(platJour);
      // Spécialités
      const { data: specs } = await supabase
        .from("menu")
        .select("*")
        .eq("is_specialite", true)
        .eq("archived", false);
      setSpecialites(specs || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const { ajouterPlat } = usePanier();

  // Fonction pour ajouter au panier depuis la page d'accueil
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
    <>
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Carousel
              className="h-full w-full"
              plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
              opts={{ duration: 40 }}
            >
              <CarouselContent>
                {[1,2,3,4,5].map((i) => (
                  <CarouselItem key={i} className="relative h-screen w-full">
                    <Image src={`/hero${i}.jpeg`} alt={`Ambiance restaurant ${i}`} fill className="object-cover" priority={i===1} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
          </div>
        <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 animate-fade-in drop-shadow-lg">
              Bienvenue au <span className="text-orange-400 animate-glow">Dream</span>
          </h1>
            <h2 className="text-lg md:text-2xl font-medium text-orange-100 mb-6 tracking-wide animate-fade-in-slow">
              L’expérience culinaire où le goût rencontre l’élégance
            </h2>
            <p className="text-xl md:text-2xl mb-10 leading-relaxed text-white/90 animate-fade-in-slow">
              <span className="font-semibold text-orange-300">Découvrez</span> une cuisine variée, généreuse et pleine de saveurs.<br />
              Des mets soigneusement préparés, des ingrédients de qualité, des recettes uniques.<br />
              Ici, chaque plat est une <span className="font-semibold text-orange-300">invitation au plaisir</span>.<br />
              Pour une pause déjeuner, un moment entre amis ou un dîner raffiné.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 text-lg px-10 py-4 shadow-xl transition-all duration-200">
              <Link href="/menu">Voir notre menu</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
                className="text-lg px-10 py-4 border-white text-white hover:bg-white hover:text-gray-900 bg-transparent shadow-xl transition-all duration-200"
            >
              <Link href="/reservation">Réserver une table</Link>
            </Button>
          </div>
        </div>
      </section>

        {/* Plat du Jour Section dynamique */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <ChefHat className="w-8 h-8 text-orange-600 mr-3" />
              <h2 className="text-4xl font-bold text-gray-800">Plat du Jour</h2>
            </div>
            <p className="text-xl text-gray-600">Notre chef vous propose une création spéciale chaque jour</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-full">
                    {loading ? (
                      <div className="flex items-center justify-center h-full bg-gray-100 animate-pulse text-gray-400">Chargement...</div>
                    ) : platDuJour ? (
                      <Image src={platDuJour.image_url || "/placeholder.jpg"} alt={platDuJour.nom} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">Aucun plat du jour</div>
                    )}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-orange-600 text-white px-3 py-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      Aujourd'hui
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                    {loading ? (
                      <div className="text-gray-400">Chargement...</div>
                    ) : platDuJour ? (
                      <div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-4">{platDuJour.nom}</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">{platDuJour.description}</p>
                  <div className="flex items-center justify-between mb-6">
                          <span className="text-3xl font-bold text-orange-600">{platDuJour.prix} FCFA</span>
                        </div>
                        <div className="flex gap-2 w-full">
                          <Button className="bg-orange-600 hover:bg-orange-700 flex-1 text-lg py-3" onClick={() => addToCart(platDuJour)}>
                            Ajouter au panier
                          </Button>
                          <Link href="/panier" className="self-center text-orange-700 underline text-sm ml-2">Voir panier</Link>
                    </div>
                  </div>
                    ) : (
                      <div className="text-gray-400">Aucun plat du jour pour aujourd'hui.</div>
                    )}
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Notre Histoire</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Fondé en 2024 par la famille MBEMBA, The Dream Restaurant est né d'un rêve : partager les saveurs authentiques de
                  l'Afrique avec le monde. Chaque plat raconte une histoire, chaque épice évoque un souvenir.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Nos recettes, transmises de génération en génération, sont préparées avec des ingrédients frais et
                importés directement d'Afrique. Nous créons une expérience culinaire unique qui célèbre la richesse de
                notre héritage.
              </p>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white bg-transparent"
              >
                <Link href="/contact">En savoir plus</Link>
              </Button>
            </div>
              <div className="relative w-full aspect-[3/4] max-h-[500px] rounded-lg shadow-lg overflow-hidden">
                <div className="relative w-full h-[500px]">
                  <Image
                    src="/placeholder.jpeg"
                    alt="Notre histoire"
                    width={400}
                    height={600}
                    style={{width: '100%', height: 'auto'}}
                    className="object-contain"
                    priority={true}
                    quality={100}
                    loading="eager"
                    unoptimized={true}
                  />
                </div>
            </div>
          </div>
        </div>
      </section>

        {/* Nos Spécialités dynamiques */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Nos Spécialités</h2>
            <p className="text-xl text-gray-600">Les plats qui ont fait notre réputation</p>
          </div>
            {loading ? (
              <div className="text-center text-gray-400">Chargement...</div>
            ) : specialites.length === 0 ? (
              <div className="text-center text-gray-400">Aucune spécialité trouvée.</div>
            ) : (
          <div className="grid md:grid-cols-3 gap-8">
                {specialites.map((dish) => (
              <Card
                    key={dish.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-48">
                      <Image src={dish.image_url || "/placeholder.svg"} alt={dish.nom} fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-800">{dish.nom}</h3>
                        <span className="text-xl font-bold text-orange-600">{dish.prix} FCFA</span>
                  </div>
                  <p className="text-gray-600 mb-4">{dish.description}</p>
                  <div className="flex items-center justify-between">
                        <div className="flex gap-2 w-full">
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700 flex-1" onClick={() => addToCart(dish)}>
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
      </section>

      {/* Informations Pratiques */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Informations Pratiques</h2>
            <p className="text-xl text-gray-600">Tout ce que vous devez savoir pour nous rendre visite</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <Clock className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-4">Horaires d'ouverture</h3>
              <div className="space-y-2 text-gray-600">
                <p>Lundi - Jeudi : 11h30 - 22h00</p>
                <p>Vendredi - Samedi : 11h30 - 23h00</p>
                <p>Dimanche : 12h00 - 21h00</p>
              </div>
            </Card>
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <MapPin className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-4">Adresse</h3>
              <div className="space-y-2 text-gray-600">
                  <p>Mpita Oci vers la brasserie en face PSP tempi<br/>Pointe-Noire, Republic of the Congo (Congo-Brazzaville)</p>
                <Button asChild variant="outline" size="sm" className="mt-4 bg-transparent">
                    <Link href="https://www.google.com/maps?q=Mpita+Oci+vers+la+brasserie+en+face+PSP+tempi,+Pointe-Noire,+Congo-Brazzaville" target="_blank" rel="noopener noreferrer">Voir sur Google Maps</Link>
                </Button>
              </div>
            </Card>
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <Phone className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-4">Contact</h3>
              <div className="space-y-2 text-gray-600">
                  <p>Tel : 068005454 / 069019696 / 053340606</p>
                  <p>thedreamrestau@gmail.com</p>
                <Button asChild variant="outline" size="sm" className="mt-4 bg-transparent">
                  <Link href="/contact">Nous contacter</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
