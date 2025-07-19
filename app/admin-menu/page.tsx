"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { FaStar, FaUtensils, FaList } from 'react-icons/fa';
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { value: "omelettes", label: "Omelettes" },
  { value: "sandwichs", label: "Sandwichs" },
  { value: "pattes", label: "Pattes" },
  { value: "volaille", label: "Volaille" },
  { value: "viandes", label: "Viandes" },
  { value: "poisson", label: "Poisson" },
  { value: "fruits-de-mer", label: "Fruits de Mer" },
  { value: "accompagnement", label: "Accompagnement" },
  { value: "boissons-jus", label: "Boissons et Jus sans Alcool" },
  { value: "boisson-energisante", label: "Boisson Énergisante" },
  { value: "bierre-importee", label: "Bierre Importé" },
  { value: "bierre-locale", label: "Bierre Local" },
  { value: "vin-mouelleux-mousseux", label: "Vin Moueleux et Mousseux" },
  { value: "spiritueux-apperitif-liqueurs", label: "Spiritueux Apperitif et Liqueurs" },
  { value: "whisky", label: "Whisky" },
  { value: "champagne", label: "Champagne" },
];

export default function AdminMenuPage() {
  const [tab, setTab] = useState("menu");
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nom: "", prix: "", description: "", categorie: "plat", image_url: "" });
  const [file, setFile] = useState<File | null>(null);
  const [adding, setAdding] = useState(false);
  const [platDuJourId, setPlatDuJourId] = useState<string | null>(null);
  const [specialites, setSpecialites] = useState<{[id: string]: boolean}>({});
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  // Ajout de l'état pour filtrer les plats archivés
  const [showArchived, setShowArchived] = useState(true);

  // Sécurité : redirection si non connecté
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/connexion");
        setIsAuth(false);
      } else {
        setIsAuth(true);
      }
      setCheckingAuth(false);
    });
  }, [router]);

  // Déconnexion
  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/connexion");
  }

  useEffect(() => { fetchMenu(); }, []);

  async function fetchMenu() {
    setLoading(true);
    const { data } = await supabase.from("menu").select("*").order("created_at", { ascending: false });
    setMenu(data || []);
    if (data) {
      const platJour = data.find((p: any) => p.is_plat_du_jour);
      setPlatDuJourId(platJour ? platJour.id : null);
      const spec: {[id: string]: boolean} = {};
      data.forEach((p: any) => { spec[p.id] = !!p.is_specialite; });
      setSpecialites(spec);
    }
    setLoading(false);
  }

  async function handleAdd(e: any) {
    e.preventDefault();
    setAdding(true);
    let image_url = form.image_url;
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from('menu-images').upload(fileName, file);
      if (error) {
        alert("Erreur upload image : " + error.message);
        setAdding(false);
        return;
      }
      const { data } = supabase.storage.from('menu-images').getPublicUrl(fileName);
      image_url = data.publicUrl;
    }
    const { nom, prix, description, categorie } = form;
    if (!nom || !prix || !categorie) return;
    await supabase.from("menu").insert([{ nom, prix: parseFloat(prix), description, categorie, image_url }]);
    setForm({ nom: "", prix: "", description: "", categorie: "plat", image_url: "" });
    setFile(null);
    setAdding(false);
    setSuccess("Plat ajouté au menu !");
    fetchMenu();
    setTimeout(() => setSuccess(""), 2000);
  }

  async function handleDelete(id: string) {
    await supabase.from("menu").delete().eq("id", id);
    fetchMenu();
  }

  async function handlePlatDuJourChange(id: string) {
    await supabase.from('menu').update({ is_plat_du_jour: false }).neq('id', id);
    await supabase.from('menu').update({ is_plat_du_jour: true }).eq('id', id);
    setPlatDuJourId(id);
    fetchMenu();
  }

  async function handleSpecialiteChange(id: string, value: boolean) {
    await supabase.from('menu').update({ is_specialite: value }).eq('id', id);
    setSpecialites(s => ({ ...s, [id]: value }));
    fetchMenu();
  }

  async function handleArchive(id: string, archived: boolean) {
    await supabase.from('menu').update({ archived }).eq('id', id);
    fetchMenu();
  }

  if (checkingAuth) {
    return <div className="text-center py-12 text-gray-500">Vérification de l'accès...</div>;
  }
  if (!isAuth) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex justify-end mb-4">
        <button onClick={handleLogout} className="bg-gray-200 px-4 py-2 rounded text-gray-700 hover:bg-gray-300">Déconnexion</button>
      </div>
      <h1 className="text-3xl font-bold mb-8 text-center">Administration du Menu</h1>
      <div className="flex gap-4 justify-center mb-8 bg-[#f6f8fa] rounded-xl p-2">
        <button
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${tab === "plat-jour" ? "bg-white shadow text-orange-600" : "text-gray-600 hover:bg-gray-100"}`}
          onClick={() => setTab("plat-jour")}
        >
          <FaStar className="w-5 h-5" /> Plat du Jour
        </button>
        <button
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${tab === "specialites" ? "bg-white shadow text-orange-600" : "text-gray-600 hover:bg-gray-100"}`}
          onClick={() => setTab("specialites")}
        >
          <FaUtensils className="w-5 h-5" /> Spécialités
        </button>
        <button
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${tab === "menu" ? "bg-white shadow text-orange-600" : "text-gray-600 hover:bg-gray-100"}`}
          onClick={() => setTab("menu")}
        >
          <FaList className="w-5 h-5" /> Menu Complet
        </button>
      </div>

      {/* Plat du Jour */}
      {tab === "plat-jour" && (
        <section>
          <h2 className="text-xl font-bold mb-4">Sélectionner le Plat du Jour</h2>
          {loading ? <div>Chargement...</div> : (
            <div className="space-y-2">
              {(() => {
                // On affiche tous les plats non archivés + le plat du jour sélectionné (même archivé)
                let plats = menu.filter(plat => !plat.archived);
                const platJour = menu.find(plat => plat.id === platDuJourId);
                if (platJour && platJour.archived && !plats.some(p => p.id === platJour.id)) {
                  plats = [platJour, ...plats];
                }
                return plats.map(plat => (
                  <label key={plat.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="platDuJour"
                      checked={platDuJourId === plat.id}
                      onChange={() => handlePlatDuJourChange(plat.id)}
                    />
                    <span>
                      {plat.nom} ({plat.categorie})
                      {plat.archived && <span className="ml-2 px-2 py-0.5 bg-gray-300 text-gray-700 text-xs rounded">Archivé</span>}
                    </span>
                  </label>
                ));
              })()}
            </div>
          )}
        </section>
      )}

      {/* Spécialités */}
      {tab === "specialites" && (
        <section>
          <h2 className="text-xl font-bold mb-4">Gérer les Spécialités</h2>
          {loading ? <div>Chargement...</div> : (
            <div className="space-y-2">
              {menu.map(plat => (
                <label key={plat.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!specialites[plat.id]}
                    onChange={e => handleSpecialiteChange(plat.id, e.target.checked)}
                  />
                  <span>{plat.nom} ({plat.categorie})</span>
                </label>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Menu Complet */}
      {tab === "menu" && (
        <section>
          <h2 className="text-xl font-bold mb-4">Ajouter un Plat ou une Boisson</h2>
          {success && <div className="success-message mb-4">{success}</div>}
          <form onSubmit={handleAdd} className="bg-white rounded-lg shadow p-6 mb-10 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Nom du plat/boisson"
                value={form.nom}
                onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                required
                className="border rounded px-3 py-2"
              />
              <input
                placeholder="Prix (FCFA)"
                type="number"
                min="0"
                step="0.01"
                value={form.prix}
                onChange={e => setForm(f => ({ ...f, prix: e.target.value }))}
                required
                className="border rounded px-3 py-2"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="block mb-2"
            />
            <textarea
              placeholder="Description"
              className="w-full border rounded p-2"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
            <select
              className="w-full border rounded p-2"
              value={form.categorie}
              onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}
            >
              {CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
            </select>
            <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded" disabled={adding}>{adding ? "Ajout..." : "Ajouter au menu"}</button>
          </form>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={e => setShowArchived(e.target.checked)}
              id="showArchived"
            />
            <label htmlFor="showArchived" className="text-sm">Afficher les plats archivés</label>
          </div>
          <h3 className="text-xl font-bold mb-4">Plats & Boissons existants</h3>
          {loading ? <div>Chargement...</div> : menu.length === 0 ? <div>Aucun plat/boisson pour l'instant.</div> : (
            <div className="space-y-4">
              {menu
                .filter(item => showArchived || !item.archived)
                .map(item => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 p-4 border rounded-lg bg-white transition-opacity ${item.archived ? 'opacity-50' : ''}`}
                >
                  {item.image_url && (
                    <Image src={item.image_url} alt={item.nom} width={80} height={80} className="rounded object-cover" />
                  )}
                  <div className="flex-1">
                    <div className="font-bold text-lg flex items-center gap-2">
                      {item.nom}
                      {item.archived && <span className="ml-2 px-2 py-0.5 bg-gray-300 text-gray-700 text-xs rounded">Archivé</span>}
                    </div>
                    <div className="text-gray-500 text-sm">{item.categorie}</div>
                    <div className="text-orange-600 font-bold">{item.prix} FCFA</div>
                    <div className="text-gray-700 text-sm mt-1">{item.description}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      className={`px-3 py-1 rounded ${item.archived ? 'bg-green-600' : 'bg-gray-400'} text-white`}
                      onClick={() => handleArchive(item.id, !item.archived)}
                    >
                      {item.archived ? 'Restaurer' : 'Archiver'}
                    </button>
                    <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleDelete(item.id)}>Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
} 