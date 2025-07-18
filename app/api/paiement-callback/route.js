import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  // Ici tu peux mettre à jour la commande dans Supabase selon le statut reçu
  // Exemple :
  // if (body.transaction_id && body.status === 'ACCEPTED') {
  //   await supabase.from('commandes').update({ statut: 'payée' }).eq('transaction_id', body.transaction_id);
  // }
  return NextResponse.json({ ok: true });
} 