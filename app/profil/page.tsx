"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Star, Clock, Gift, Edit, Save } from "lucide-react"

export default function ProfilPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    firstName: "Marie",
    lastName: "Dubois",
    email: "marie.dubois@email.com",
    phone: "06 12 34 56 78",
  })

  const orderHistory = [
    {
      id: "#CMD-001",
      date: "15 Jan 2024",
      items: ["Thieboudienne", "Bissap"],
      total: 22,
      status: "Livrée",
    },
    {
      id: "#CMD-002",
      date: "08 Jan 2024",
      items: ["Mafé Bœuf", "Yassa Poulet"],
      total: 31,
      status: "Livrée",
    },
    {
      id: "#CMD-003",
      date: "02 Jan 2024",
      items: ["Accras de Morue", "Thiakry"],
      total: 14,
      status: "Livrée",
    },
  ]

  const loyaltyPoints = 245
  const nextRewardAt = 300

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Mon Profil</h1>
          <p className="text-xl text-gray-600">Gérez vos informations et suivez vos commandes</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="text-2xl bg-orange-100 text-orange-600">
                    {userInfo.firstName[0]}
                    {userInfo.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {userInfo.firstName} {userInfo.lastName}
                </h2>
                <p className="text-gray-600 mb-4">{userInfo.email}</p>

                {/* Loyalty Points */}
                <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center mb-2">
                    <Gift className="w-5 h-5 text-orange-600 mr-2" />
                    <span className="font-medium">Points Fidélité</span>
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">{loyaltyPoints}</div>
                  <div className="text-sm text-gray-600">
                    Plus que {nextRewardAt - loyaltyPoints} points pour votre prochaine récompense
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(loyaltyPoints / nextRewardAt) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <Badge variant="secondary" className="mb-4">
                  <Star className="w-4 h-4 mr-1" />
                  Client VIP
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Informations</TabsTrigger>
                <TabsTrigger value="orders">Commandes</TabsTrigger>
                <TabsTrigger value="rewards">Récompenses</TabsTrigger>
              </TabsList>

              {/* Personal Information */}
              <TabsContent value="info">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Informations personnelles
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                      {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                      {isEditing ? "Sauvegarder" : "Modifier"}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                          id="firstName"
                          value={userInfo.firstName}
                          onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          value={userInfo.lastName}
                          onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Order History */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Historique des commandes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orderHistory.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{order.id}</h4>
                              <p className="text-sm text-gray-500">{order.date}</p>
                            </div>
                            <Badge variant="secondary">{order.status}</Badge>
                          </div>
                          <div className="mb-2">
                            <p className="text-sm text-gray-600">{order.items.join(", ")}</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{order.total}€</span>
                            <Button variant="outline" size="sm">
                              Voir détails
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Rewards */}
              <TabsContent value="rewards">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Gift className="w-5 h-5 mr-2" />
                      Mes récompenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-2">Programme de fidélité</h3>
                        <p className="text-gray-600 mb-4">
                          Gagnez 1 point pour chaque euro dépensé. Échangez vos points contre des récompenses !
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{loyaltyPoints}</div>
                            <div className="text-sm text-gray-600">Points disponibles</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">3</div>
                            <div className="text-sm text-gray-600">Récompenses utilisées</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Plat gratuit</h4>
                          <p className="text-sm text-gray-600 mb-3">300 points</p>
                          <Button
                            className="w-full"
                            disabled={loyaltyPoints < 300}
                            variant={loyaltyPoints >= 300 ? "default" : "outline"}
                          >
                            {loyaltyPoints >= 300 ? "Échanger" : "Pas assez de points"}
                          </Button>
                        </div>
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Réduction 20%</h4>
                          <p className="text-sm text-gray-600 mb-3">150 points</p>
                          <Button className="w-full bg-orange-600 hover:bg-orange-700">Échanger</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
