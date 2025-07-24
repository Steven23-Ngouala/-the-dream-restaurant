import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function Head() {
  // Récupération dynamique du menu
  const { data: menu } = await supabase
    .from('menu')
    .select('*')
    .eq('archived', false);

  // Regroupement par catégorie pour Schema.org
  const menuSections: Record<string, any[]> = {};
  if (menu) {
    for (const item of menu) {
      if (!menuSections[item.categorie]) menuSections[item.categorie] = [];
      menuSections[item.categorie].push({
        "@type": "MenuItem",
        name: item.nom,
        description: item.description,
        offers: {
          "@type": "Offer",
          price: String(item.prix),
          priceCurrency: "FCFA"
        }
      });
    }
  }

  // Placeholder pour événements (à remplacer par une vraie requête Supabase si table events créée)
  const events = [
    {
      "@type": "Event",
      name: "Soirée Africaine",
      startDate: "2024-07-15T20:00",
      endDate: "2024-07-15T23:00",
      location: {
        "@type": "Place",
        name: "The Dream Restaurant",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Mpita Oci vers la brasserie en face PSP tempi",
          addressLocality: "Pointe-Noire",
          addressCountry: "Congo-Brazzaville"
        }
      },
      description: "Ambiance live, menu spécial, DJ et danse toute la nuit !"
    }
  ];

  // Placeholder pour offres spéciales (à remplacer par une vraie requête Supabase si table offers créée)
  const offers = [
    {
      "@type": "Offer",
      name: "Happy Hour",
      description: "-20% sur toutes les boissons de 18h à 20h du lundi au jeudi.",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        priceCurrency: "FCFA",
        price: "Variable"
      },
      validFrom: "2024-07-01",
      validThrough: "2024-07-31"
    }
  ];

  // Construction du JSON-LD Schema.org Restaurant enrichi
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "The Dream Restaurant",
    image: [
      "https://the-dream-restaurant.vercel.app/hero1.jpeg"
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mpita Oci vers la brasserie en face PSP tempi",
      addressLocality: "Pointe-Noire",
      addressCountry: "Congo-Brazzaville"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -4.8057,
      longitude: 11.8570
    },
    email: "thedreamrestau@gmail.com",
    telephone: ["068005454", "069019696", "053340606"],
    servesCuisine: ["Africain", "International"],
    url: "https://the-dream-restaurant.vercel.app/",
    priceRange: "FCFA",
    acceptsReservations: true,
    sameAs: [
      "https://www.facebook.com/thedreamrestau",
      "https://www.instagram.com/thedreamrestau"
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday"
        ],
        opens: "11:30",
        closes: "22:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Friday",
          "Saturday"
        ],
        opens: "11:30",
        closes: "23:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "12:00",
        closes: "21:00"
      }
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "124"
    },
    review: [
      {
        "@type": "Review",
        author: "Jean Dupont",
        datePublished: "2024-04-10",
        reviewBody: "Cuisine excellente, accueil chaleureux et cadre magnifique !",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5"
        }
      },
      {
        "@type": "Review",
        author: "Amina B.",
        datePublished: "2024-03-22",
        reviewBody: "Un vrai voyage culinaire, je recommande vivement.",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5"
        }
      }
    ],
    hasMenu: {
      "@type": "Menu",
      name: "Menu Principal",
      hasMenuSection: Object.entries(menuSections).map(([cat, items]) => ({
        "@type": "MenuSection",
        name: cat,
        hasMenuItem: items
      }))
    },
    event: events,
    makesOffer: offers
  };

  return (
    <>
      <title>The Dream Restaurant - Pointe-Noire</title>
      <meta
        name="description"
        content="The Dream Restaurant à Mpita Oci vers la brasserie en face PSP tempi, Pointe-Noire, Congo-Brazzaville. Découvrez notre menu varié et notre ambiance conviviale."
      />
      <meta property="og:title" content="The Dream Restaurant - Pointe-Noire" />
      <meta property="og:description" content="Découvrez notre menu varié et notre ambiance conviviale à Pointe-Noire, Congo-Brazzaville." />
      <meta property="og:type" content="restaurant" />
      <meta property="og:site_name" content="The Dream Restaurant" />
      <meta property="og:locale" content="fr_FR" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="The Dream Restaurant - Pointe-Noire" />
      <meta name="twitter:description" content="Découvrez notre menu varié et notre ambiance conviviale à Pointe-Noire, Congo-Brazzaville." />
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaOrg)
        }}
      />
    </>
  );
} 