import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const data = await req.json();

  // Crée le transporteur SMTP avec les variables d'environnement
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true", // true pour 465, false pour autres
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  let subject = data.subject || "Nouveau message du site web";
  let text = '';
  let html = '';

  if (data.type === 'commande') {
    subject = `Nouvelle commande de ${data.nom}`;
    text = `Nom: ${data.nom}\nTéléphone: ${data.tel}\nMode: ${data.mode}\nAdresse: ${data.adresse || '-'}\nTotal: ${data.total} FCFA\nPaiement: ${data.paiement}\n\nPlats:\n${data.plats.map((p: any) => `- ${p.nom} x${p.quantite} (${p.prix} FCFA)`).join('\n')}`;
    html = `<p><b>Nom:</b> ${data.nom}</p><p><b>Téléphone:</b> ${data.tel}</p><p><b>Mode:</b> ${data.mode}</p><p><b>Adresse:</b> ${data.adresse || '-'}</p><p><b>Total:</b> ${data.total} FCFA</p><p><b>Paiement:</b> ${data.paiement}</p><h3>Plats commandés :</h3><ul>${data.plats.map((p: any) => `<li>${p.nom} x${p.quantite} (${p.prix} FCFA)</li>`).join('')}</ul>`;
  } else {
    text = `Nom: ${data.name}\nEmail: ${data.email}\nTéléphone: ${data.phone || "-"}\n\nMessage:\n${data.message || data.notes || "-"}`;
    html = `<p><b>Nom:</b> ${data.name}</p><p><b>Email:</b> ${data.email}</p><p><b>Téléphone:</b> ${data.phone || "-"}</p><p><b>Message:</b><br/>${data.message || data.notes || "-"}</p>`;
  }

  try {
    await transporter.sendMail({
      from: `"${data.name || data.nom || "Site Web"}" <${process.env.SMTP_USER}>`,
      to: "thedreamrestau@gmail.com",
      subject,
      text,
      html
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
} 