"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function ConnexionPage() {
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [erreur, setErreur] = useState('');
  const [ok, setOk] = useState(false);
  const router = useRouter();

  const handleConnexion = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur('');
    const { error } = await supabase.auth.signInWithPassword({ email, password: mdp });
    if (error) setErreur(error.message);
    else {
      router.push('/admin-menu');
      setOk(true);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6">Connexion</h1>
      <form className="flex flex-col gap-4" onSubmit={handleConnexion}>
        <input
          type="email"
          placeholder="Email"
          className="border rounded px-2 py-1"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="border rounded px-2 py-1"
          value={mdp}
          onChange={e => setMdp(e.target.value)}
          required
        />
        <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded">
          Se connecter
        </button>
        {erreur && <div className="text-red-600">{erreur}</div>}
        {ok && <div className="text-green-600">Connecté !</div>}
      </form>
    </div>
  );
}
