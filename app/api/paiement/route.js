import { NextResponse } from 'next/server';

export async function POST(req) {
  const { nom, tel, total, operateur } = await req.json();

  const apiKey = process.env.CINETPAY_API_KEY;
  const siteId = process.env.CINETPAY_SITE_ID;
  const notifyUrl = process.env.CINETPAY_NOTIFY_URL;
  const returnUrl = process.env.CINETPAY_RETURN_URL;

  const transaction_id = Date.now().toString();

  const response = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apikey: apiKey,
      site_id: siteId,
      transaction_id,
      amount: total,
      currency: 'XAF',
      description: 'Commande The Dream Restaurant',
      customer_name: nom,
      customer_surname: '',
      customer_email: '',
      customer_phone_number: tel,
      notify_url: notifyUrl,
      return_url: returnUrl,
      channels: operateur, // 'AIRTEL' ou 'MTN'
      lang: 'fr'
    })
  });

  const data = await response.json();
  return NextResponse.json({ ...data, transaction_id });
} 