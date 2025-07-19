"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Phone } from "lucide-react";

export default function CommandeInfoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-orange-600">Commander au Dream</h1>
        <p className="mb-6 text-gray-700">
          Pour commander, sélectionnez vos plats dans le menu en ligne ou contactez-nous directement par téléphone.
        </p>
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-center gap-2 text-gray-800">
            <Phone className="w-5 h-5 text-orange-600" />
            <span className="font-semibold">068005454 / 069019696 / 053340606</span>
        </div>
          <div className="flex items-center justify-center gap-2 text-gray-800">
            <MapPin className="w-5 h-5 text-orange-600" />
            <span>Sur la route de l’aéroport en diagonale du commissariat tampis</span>
          </div>
                    </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button asChild className="bg-orange-600 hover:bg-orange-700 flex-1">
            <Link href="/menu">Voir le menu</Link>
                      </Button>
          <Button asChild variant="outline" className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
            <a href="tel:068005454">Appeler le restaurant</a>
                      </Button>
                    </div>
        <div className="mt-8">
          <iframe
            src="https://www.google.com/maps?q=sur+la+route+de+l'aéroport+en+diagonale+du+commissariat+tampis+Congo+Brazzaville&output=embed"
            width="100%"
            height="180"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localisation Google Maps"
          ></iframe>
        </div>
      </div>
    </div>
  );
}