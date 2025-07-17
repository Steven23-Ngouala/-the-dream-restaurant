"use client";

import { createContext, useContext, useEffect, useState } from 'react';

export type PlatPanier = {
  id: number;
  nom: string;
  prix: number;
  image_url: string;
  quantite: number;
};

export type PanierContextType = {
  panier: PlatPanier[];
  ajouterPlat: (plat: PlatPanier) => void;
  retirerPlat: (id: number) => void;
  viderPanier: () => void;
  incrementerQuantite: (id: number) => void;
  decrementerQuantite: (id: number) => void;
};

const PanierContext = createContext<PanierContextType | undefined>(undefined);

export function PanierProvider({ children }: { children: React.ReactNode }) {
  const [panier, setPanier] = useState<PlatPanier[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('panier');
    if (data) setPanier(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem('panier', JSON.stringify(panier));
  }, [panier]);

  const ajouterPlat = (plat: PlatPanier) => {
    setPanier((prev) => {
      const exist = prev.find((p) => p.id === plat.id);
      if (exist) {
        return prev.map((p) =>
          p.id === plat.id ? { ...p, quantite: p.quantite + plat.quantite } : p
        );
      }
      return [...prev, plat];
    });
  };

  const retirerPlat = (id: number) => {
    setPanier((prev) => prev.filter((p) => p.id !== id));
  };

  const incrementerQuantite = (id: number) => {
    setPanier((prev) => prev.map((p) =>
      p.id === id ? { ...p, quantite: p.quantite + 1 } : p
    ));
  };

  const decrementerQuantite = (id: number) => {
    setPanier((prev) => prev.map((p) =>
      p.id === id ? { ...p, quantite: Math.max(1, p.quantite - 1) } : p
    ));
  };

  const viderPanier = () => setPanier([]);

  return (
    <PanierContext.Provider value={{ panier, ajouterPlat, retirerPlat, viderPanier, incrementerQuantite, decrementerQuantite }}>
      {children}
    </PanierContext.Provider>
  );
}

export function usePanier() {
  const context = useContext(PanierContext);
  if (!context) throw new Error('usePanier must be used within PanierProvider');
  return context;
} 