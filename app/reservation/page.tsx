"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Users, Phone } from "lucide-react"

export default function ReservationPage() {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: "",
    name: "",
    phone: "",
    email: "",
    notes: "",
  })

  const [status, setStatus] = useState<string | null>(null)

  const timeSlots = ["12:00", "12:30", "13:00", "13:30", "14:00", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"]

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
        setStatus("Votre réservation a bien été envoyée !")
        setFormData({ date: "", time: "", guests: "", name: "", phone: "", email: "", notes: "" })
      } else {
        setStatus("Erreur lors de l'envoi. Veuillez réessayer.")
      }
    } catch {
      setStatus("Erreur lors de l'envoi. Veuillez réessayer.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Réserver une table</h1>
          <p className="text-xl text-gray-600">
            Réservez votre table au Dream pour une expérience culinaire inoubliable
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Reservation Form */}
          <Card>
            <CardHeader>
              <CardTitle>Détails de la réservation</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Heure
                    </Label>
                    <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir l'heure" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Nombre de personnes
                  </Label>
                  <Select
                    value={formData.guests}
                    onValueChange={(value) => setFormData({ ...formData, guests: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Nombre de convives" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "personne" : "personnes"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800">Informations de contact</h3>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Téléphone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes spéciales (optionnel)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Allergies, régime alimentaire, occasion spéciale..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 py-3">
                  Confirmer la réservation
                </Button>
                {status && <div className="text-center text-sm mt-2 text-orange-700">{status}</div>}
              </form>
            </CardContent>
          </Card>

          {/* Restaurant Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations pratiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Horaires d'ouverture</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Lundi - Dimanche</div>
                    <div>12h00 - 14h30</div>
                    <div>18h30 - 23h00</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Contact</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>📞 068005454 / 069019696 / 053340606</div>
                    <div>📧 thedreamrestau@gmail.com</div>
                    <div>📍 Sur la route de l’aéroport en diagonale du commissariat tampis</div>
                    <a href="https://www.google.com/maps?q=sur+la+route+de+l'aéroport+en+diagonale+du+commissariat+tampis+Congo+Brazzaville" target="_blank" rel="noopener noreferrer" className="text-orange-700 underline">Voir sur Google Maps</a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Politique de réservation</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <p>• Les réservations sont confirmées par email ou SMS</p>
                <p>• Annulation gratuite jusqu'à 2h avant</p>
                <p>• Table maintenue 15 minutes après l'heure de réservation</p>
                <p>• Pour les groupes de plus de 8 personnes, nous contacter directement</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
