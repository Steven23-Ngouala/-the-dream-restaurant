"use client";

import { usePanier } from '@/context/PanierContext';
import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function PanierPage() {
  const { panier, retirerPlat, viderPanier, incrementerQuantite, decrementerQuantite } = usePanier();
  const [paiement, setPaiement] = useState<'mobile'|'airtel'|'especes'>('mobile');
  const [tel, setTel] = useState('');
  const [nom, setNom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [ville, setVille] = useState('');
  const [cp, setCp] = useState('');
  const [livraison, setLivraison] = useState(true);
  const [envoi, setEnvoi] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fraisLivraison = livraison ? 1000 : 0;
  const total = panier.reduce((sum, plat) => sum + plat.prix * plat.quantite, 0) + fraisLivraison;

  const handleCommande = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnvoi(true);
    setError(null);
    try {
      await supabase.from('commandes').insert([
        {
          nom,
          tel,
          mode: livraison ? 'livraison' : 'emporter',
          adresse: livraison ? `${adresse}, ${cp} ${ville}` : null,
          total,
          paiement,
          plats: panier.map(p => ({ id: p.id, nom: p.nom, quantite: p.quantite, prix: p.prix })),
          date: new Date().toISOString(),
        }
      ]);
      // Envoi email notification
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'commande',
          nom,
          tel,
          mode: livraison ? 'livraison' : 'emporter',
          adresse: livraison ? `${adresse}, ${cp} ${ville}` : null,
          total,
          paiement,
          plats: panier.map(p => ({ id: p.id, nom: p.nom, quantite: p.quantite, prix: p.prix })),
        }),
      });
      setOk(true);
      viderPanier();
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setEnvoi(false);
    }
  };

  if (ok)
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Merci pour votre commande !</h1>
        <p>Nous la préparons avec soin.</p>
      </div>
    );

  if (error)
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Erreur lors de la commande</h1>
        <pre className="bg-red-100 text-red-800 p-4 rounded max-w-xl mx-auto overflow-x-auto">{error}</pre>
        <button className="mt-4 px-4 py-2 bg-orange-600 text-white rounded" onClick={() => setError(null)}>Réessayer</button>
        </div>
    );

  if (panier.length === 0)
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
        <Link href="/menu" className="text-orange-600 underline">Voir le menu</Link>
      </div>
    );

  return (
    <div className="container mx-auto py-8">
      <form onSubmit={handleCommande} className="grid md:grid-cols-3 gap-8">
        {/* Colonne 1 : Liste des produits */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-6">Votre panier</h1>
          <ul>
            {panier.map((plat) => (
              <li key={plat.id} className="flex items-center gap-4 mb-4 bg-white p-4 rounded shadow">
                <img src={plat.image_url} alt={plat.nom} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                  <div className="font-semibold">{plat.nom}</div>
                  <div className="text-gray-500 text-sm">{plat.description}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <button type="button" className="px-2 py-1 bg-gray-200 rounded" onClick={() => decrementerQuantite(plat.id)}>-</button>
                    <span>{plat.quantite}</span>
                    <button type="button" className="px-2 py-1 bg-gray-200 rounded" onClick={() => incrementerQuantite(plat.id)} >+</button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-orange-600">{plat.prix * plat.quantite} FCFA</div>
                  <div className="text-xs text-gray-400">{plat.prix} FCFA l'unité</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex gap-4 mt-6">
            <button type="button" className="bg-gray-200 px-4 py-2 rounded" onClick={viderPanier}>Vider le panier</button>
                </div>
                </div>
        {/* Colonne 2 : Récap et paiement */}
        <div className="bg-white p-6 rounded shadow flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold mb-4">Récapitulatif de commande</h2>
            <div className="flex justify-between mb-2"><span>Sous-total</span><span>{(total-fraisLivraison).toFixed(2)} FCFA</span></div>
            {livraison && <div className="flex justify-between mb-2"><span>Livraison</span><span>{fraisLivraison.toFixed(2)} FCFA</span></div>}
            <div className="flex justify-between font-bold text-orange-600 text-lg mb-2"><span>Total</span><span>{total.toFixed(2)} FCFA</span></div>
            {livraison && <div className="text-xs text-gray-500 flex items-center gap-2"><span>⏱️</span> Temps de livraison estimé : 20-30 min</div>}
                  </div>
                    <div>
            <h2 className="text-lg font-bold mb-4">Informations client</h2>
            <input type="text" placeholder="Votre nom" className="border rounded px-2 py-1 w-full mb-2" value={nom} onChange={e=>setNom(e.target.value)} required />
            <input type="tel" placeholder="Téléphone" className="border rounded px-2 py-1 w-full mb-2" value={tel} onChange={e=>setTel(e.target.value)} required />
            <div className="flex items-center gap-2 mb-2">
              <input type="checkbox" checked={livraison} onChange={()=>setLivraison(!livraison)} id="livraison" />
              <label htmlFor="livraison">Livraison à domicile</label>
                    </div>
            {livraison && (
              <>
                <input type="text" placeholder="Adresse" className="border rounded px-2 py-1 w-full mb-2" value={adresse} onChange={e=>setAdresse(e.target.value)} required />
              </>
            )}
                      </div>
                      <div>
            <h2 className="text-lg font-bold mb-4">Méthode de paiement</h2>
            <div className="flex flex-col gap-2 mb-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="paiement" value="mobile" checked={paiement==='mobile'} onChange={()=>setPaiement('mobile')} /> Mobile Money
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="paiement" value="airtel" checked={paiement==='airtel'} onChange={()=>setPaiement('airtel')} /> Airtel Money
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="paiement" value="especes" checked={paiement==='especes'} onChange={()=>setPaiement('especes')} /> Espèces à la livraison
              </label>
                      </div>
            {(paiement==='mobile'||paiement==='airtel') && (
              <input
                type="tel"
                placeholder="Numéro de téléphone pour le paiement"
                className="border rounded px-2 py-1 w-full"
                value={tel}
                onChange={e=>setTel(e.target.value)}
                required
              />
            )}
          </div>
          <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded mt-4" disabled={envoi}>
            {envoi ? 'Envoi...' : `Finaliser la commande • ${total.toFixed(2)} FCFA`}
          </button>
        </div>
      </form>
    </div>
  );
}
