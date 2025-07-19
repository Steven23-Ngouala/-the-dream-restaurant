"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [status, setStatus] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setStatus("Votre message a bien été envoyé !")
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      } else {
        setStatus("Erreur lors de l'envoi. Veuillez réessayer.")
      }
    } catch {
      setStatus("Erreur lors de l'envoi. Veuillez réessayer.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Contactez-nous</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une question, une suggestion ou envie de nous rendre visite ? Nous sommes là pour vous accompagner !
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="w-5 h-5 mr-2" />
                Envoyez-nous un message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      placeholder="Votre nom"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone (optionnel)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="068005454 / 069019696 / 053340606"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet</Label>
                  <Input
                    id="subject"
                    placeholder="Objet de votre message"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Votre message..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 py-3">
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer le message
                </Button>
                {status && <div className="text-center text-sm mt-2 text-orange-700">{status}</div>}
              </form>
            </CardContent>
          </Card>

          {/* Contact Information & Map */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="grid gap-6">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-orange-600 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg mb-2">Adresse</h3>
                      <p className="text-gray-600">
                        Sur la route de l’aéroport en diagonale du commissariat tampis
                      </p>
                      <Button asChild variant="outline" size="sm" className="mt-4 bg-transparent">
                        <a href="https://www.google.com/maps?q=sur+la+route+de+l'aéroport+en+diagonale+du+commissariat+tampis+Congo+Brazzaville" target="_blank" rel="noopener noreferrer">Voir sur Google Maps</a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 text-orange-600 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg mb-2">Téléphone</h3>
                      <p className="text-gray-600">
                        068005454 / 069019696 / 053340606
                        <br />
                        <span className="text-sm">Réservations et renseignements</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-orange-600 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg mb-2">Email</h3>
                      <p className="text-gray-600">
                        thedreamrestau@gmail.com
                        <br />
                        <span className="text-sm">Nous répondons sous 24h</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Clock className="w-6 h-6 text-orange-600 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg mb-2">Horaires</h3>
                      <div className="text-gray-600 space-y-1">
                        <p>
                          <strong>Lundi - Dimanche</strong>
                        </p>
                        <p>Déjeuner: 12h00 - 14h30</p>
                        <p>Dîner: 18h30 - 23h00</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Google Maps Integration */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Nous trouver</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <iframe
                  src="https://www.google.com/maps?q=sur+la+route+de+l'aéroport+en+diagonale+du+commissariat+tampis+Congo+Brazzaville&output=embed"
                  width="100%"
                  height="260"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localisation Google Maps"
                ></iframe>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
