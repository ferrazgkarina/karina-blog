export interface TripCardItem {
  name: string;
  description: string;
  ctaLabel: string;
  // Sem link real ainda → o botão não aparece (só nome + descrição).
  ctaHref?: string;
  // Segundo botão (ex: hotéis com Booking.com + Trip.com) — mesma regra: sem
  // href, não aparece.
  secondaryCta?: { label: string; href?: string };
  // Selo curto no topo do card (ex: "Best Luxury Hotel") — livre, por item,
  // em vez de um "featured" genérico compartilhado por todos.
  badge?: string;
  // Caminho em /public (ex: '/images/hotel-naraca.jpg') ou URL completa.
  // Sem foto ainda → mantém o placeholder de gradiente.
  imageUrl?: string;
}

export interface TripPanel {
  id: string;
  tabLabelFull: string;
  tabLabelShort: string;
  heading: string;
  note: string;
  // Parágrafos de apoio no topo do painel, acima dos cards. Conteúdo fixo
  // escrito por nós (não vem do Sanity), então `<strong>` inline é seguro.
  intro?: string[];
  items: TripCardItem[];
  // Widget de busca embutido (ex: script de afiliado de aluguel de carro) —
  // renderizado no lugar dos cards/emptyState quando presente.
  widgetHtml?: string;
  emptyState?: { heading: string; description: string };
  // Aviso de afiliados no rodapé do painel — obrigatório em qualquer aba com
  // links de afiliado ativos (FTC/legislação de consumo).
  disclaimer?: string;
}

// Mock local — mesma forma que documentos "Establishment" viriam do Sanity
// (nome, descrição curta, foto, link de afiliado, categoria/painel, featured).
export const tripPanels: TripPanel[] = [
  {
    id: 'hotels',
    tabLabelFull: 'Book Your Hotel',
    tabLabelShort: 'Hotels',
    heading: 'Where to Stay',
    note: '4 hand-picked cave hotels',
    intro: [
      "These are my favorite hotels in Cappadocia, the ones I'd book myself. For more options, search below.",
      "<strong>Local tip:</strong> Booking.com works great if you're planning ahead from home, but once you're already here, it won't show hotels in Turkey. If you're booking on the go, try Trip.com instead.",
    ],
    disclaimer:
      "Some links on this page are affiliate links. If you book through them, I may earn a small commission at no extra cost to you — I only recommend hotels I'd stay in myself.",
    items: [
      {
        name: 'Naraca Cave House',
        imageUrl: '/images/naraca-cave-house.jpg',
        description:
          'With only five rooms, some of them carved into the rock, this boutique hotel has sweeping views over Göreme and the hot air balloons, and one of the highest guest ratings in Göreme on Booking.com.',
        ctaLabel: 'Check on Booking.com',
        ctaHref: 'https://booking.stay22.com/goingtorio/nFPp6SDhPB',
        secondaryCta: { label: 'Check on Trip.com', href: 'https://trip.stay22.com/goingtorio/-8NttgomyX' },
        badge: 'Best Cave Hotel',
      },
      {
        name: 'Argos in Cappadocia',
        imageUrl: '/images/argos-in-cappadocia.jpg',
        description:
          'Our luxury pick: an elegant, award-winning cave hotel set among restored historic houses in Üçhisar, with beautiful valley views and a spot in The Leading Hotels of the World.',
        ctaLabel: 'Check on Booking.com',
        ctaHref: 'https://booking.stay22.com/goingtorio/Iztf1tF7c0',
        secondaryCta: { label: 'Check on Trip.com', href: 'https://trip.stay22.com/goingtorio/I7gBBYDuQS' },
        badge: 'Best Luxury Hotel',
      },
      {
        name: 'Local Cave House Hotel',
        imageUrl: '/images/local-cave-house-hotel.jpg',
        description: "Its swimming pool is surrounded by Cappadocia's rock formations, which makes it a great pick for summer.",
        ctaLabel: 'Check on Booking.com',
        ctaHref: 'https://booking.stay22.com/goingtorio/H_heJxdnAt',
        secondaryCta: { label: 'Check on Trip.com', href: 'https://trip.stay22.com/goingtorio/hyWMkW5C0R' },
        badge: 'Best for Summer',
      },
      {
        name: 'Göreme Reva Hotel',
        imageUrl: '/images/goreme-reva-hotel.jpg',
        description: "A great budget option with a swimming pool and easy parking, just minutes from Göreme's center.",
        ctaLabel: 'Check on Booking.com',
        ctaHref: 'https://booking.stay22.com/goingtorio/OACFHC071H',
        secondaryCta: { label: 'Check on Trip.com', href: 'https://trip.stay22.com/goingtorio/s7cKodwQnO' },
        badge: 'Best Budget Pick',
      },
    ],
  },
  {
    id: 'houses',
    tabLabelFull: 'Airbnbs',
    tabLabelShort: 'Airbnbs',
    heading: 'Apartments and local stays',
    note: '2 hand-picked apartments',
    intro: [
      "If you'd prefer more space with a kitchen and laundry, or you're traveling as a group, Göreme has some great high-end apartments for rent. These are the ones I recommend.",
    ],
    disclaimer:
      'Some links on this page are affiliate links. If you book through them, I may earn a small commission at no extra cost to you.',
    items: [
      {
        name: 'Göreme Apartment',
        imageUrl: '/images/goreme-apartment.jpg',
        description:
          "Set on the second floor, this 3-bedroom apartment sleeps up to 6 guests, walking distance to Göreme's center, with easy parking nearby. It's a comfortable base for families and groups who want space to spread out, cook their own meals, and unwind on the balcony after a day in the valleys. Please note: there's no elevator, so access is by stairs only.",
        ctaLabel: 'Check on Booking.com',
        ctaHref: 'https://booking.stay22.com/goingtorio/q3Gk0Mfiy-',
      },
      {
        name: 'Cappadocia Apartment',
        imageUrl: '/images/cappadocia-apartment.jpg',
        description:
          "A spacious 3-bedroom apartment for up to 6 guests, just a 5-minute walk from Göreme's center, with easy parking. Great for families and groups who want room to spread out, cook their own meals, and relax on the balcony after a day exploring the valleys.",
        ctaLabel: 'Check on Booking.com',
        ctaHref: 'https://booking.stay22.com/goingtorio/q3Gk0Mfiy-',
      },
    ],
    emptyState: {
      heading: 'This section is still being put together',
      description: 'A small selection of private cave houses is coming soon — check back shortly.',
    },
  },
  {
    id: 'cars',
    tabLabelFull: 'Rent a Car',
    tabLabelShort: 'Cars',
    heading: 'Rent a Car',
    note: 'Search and compare',
    intro: [
      'Renting a car in Cappadocia helps you make the most of your time and build an itinerary around your own interests. The main international rental companies operate at both airports. Search for your car below:',
    ],
    disclaimer:
      'Some links on this page are affiliate links. If you book through them, I may earn a small commission at no extra cost to you.',
    items: [],
    widgetHtml:
      '<script async src="https://tpwdg.com/content?trs=580221&shmarker=727779&powered_by=true&country=109&city=141011&lang=en&width=100&background=light&logo=true&header=true&gearbox=true&cars=true&border=false&footer=true&campaign_id=87&promo_id=4322" charset="utf-8"></script>',
    emptyState: {
      heading: 'This section is still being put together',
      description: 'Trusted local car rental picks are coming soon — check back shortly.',
    },
  },
  {
    id: 'transfer',
    tabLabelFull: 'Airport Transfer',
    tabLabelShort: 'Transfer',
    heading: 'Airport Transfer',
    note: '1 hand-picked transfer',
    disclaimer:
      'Some links on this page are affiliate links. If you book through them, I may earn a small commission at no extra cost to you.',
    items: [
      {
        name: 'Airport Transfer from Nevşehir or Kayseri – GetYourGuide',
        imageUrl: '/images/airport-transfer.jpg',
        description:
          "This is the transfer I book every time I go to Cappadocia. Booking is simple, and you get a discount when you reserve both ways at once. It covers both airports that serve the region: Nevşehir (NAV), the closest to Göreme, and Kayseri (ASR), which usually has more flight options.\nDuration: about 40 min from Nevşehir / 1h15 from Kayseri",
        ctaLabel: 'Check prices on GetYourGuide',
        ctaHref: 'https://getyourguide.stay22.com/goingtorio/V9GK5l32gB',
      },
    ],
    emptyState: {
      heading: 'This section is still being put together',
      description: 'Trusted airport transfer picks are coming soon — check back shortly.',
    },
  },
  {
    id: 'balloons',
    tabLabelFull: 'Balloon Ride',
    tabLabelShort: 'Balloon Ride',
    heading: 'Hot Air Balloon Rides',
    note: '3 hand-picked balloon rides',
    intro: [
      "Balloon flights in Cappadocia don't have a fixed price. It depends mostly on the time of year, the basket size, and what the company adds on, like breakfast or a champagne toast after landing. Prices range from €100 to €300. Demand matters too. When bad weather cancels flights several days in a row, prices tend to go up. In high season flights often sell out, so book your spot as soon as your travel dates are set.",
      'Baskets usually hold between 12 and 28 people, and the smaller ones give you more room to move around and take photos. If budget is not a concern, aim for the smaller baskets.',
      "Booking hot air balloon flights usually means comparing dozens of local companies, checking reviews, and emailing back and forth about pickup times. To make it easier, I've picked the best options from reliable booking platforms. All of them fly over Göreme National Park, so whichever you choose, you'll get the classic views you've seen in photos.",
    ],
    disclaimer:
      'Some links on this page are affiliate links. If you book through them, I may earn a small commission at no extra cost to you.',
    items: [
      {
        name: 'Sunrise Flight with Hotel Transfer – Trip.com',
        imageUrl: '/images/sunrise-flight-tripcom.jpg',
        description:
          'Featured in Trip.Best Asia 100 – Best Things to Do 2026.\nYou can choose a basket for 16, 20 or 28 people.\nIncluded: round-trip hotel transfer, light breakfast, sunrise flight (45–60 min), champagne toast.',
        ctaLabel: 'Check prices on Trip.com',
        ctaHref: 'https://trip.stay22.com/goingtorio/8yaFAAm6sh',
        badge: 'Award-Winning',
      },
      {
        name: 'Hot Air Balloon Experience – Klook',
        // Foto provisória (era do card do Royal Balloon/Viator) — trocar por uma do produto Klook.
        imageUrl: '/images/royal-balloon-viator.jpg',
        description:
          "With Klook's hassle-free booking system, you will fly with top-rated hot air balloon and personalize your flight experience with few clicks. Make sure you select Göreme Valley as the flight location.\nIncluded: round-trip hotel transfer, breakfast, sunrise flight and flight certificate.",
        ctaLabel: 'Check prices on Klook',
        ctaHref: 'https://klook.tpo.lv/Ln3JIsxO',
      },
      {
        name: 'Discovery Balloons Flight – GetYourGuide Originals',
        imageUrl: '/images/discovery-balloons-getyourguide.jpg',
        description:
          "Rated 4.9/5 and part of GetYourGuide Originals, the platform's own selection of top-quality experiences.\nChoose the classic sunrise flight, or save a little with the second flight, which takes off right after.\nIncluded: round-trip hotel transfer, light snacks before the flight, champagne toast after landing.",
        ctaLabel: 'Check prices on GetYourGuide',
        ctaHref: 'https://getyourguide.stay22.com/goingtorio/R2gDO1f2VK',
        badge: 'Highest Rated',
      },
    ],
    emptyState: {
      heading: 'This section is still being put together',
      description: 'Trusted balloon ride picks are coming soon — check back shortly.',
    },
  },
  {
    id: 'activities',
    tabLabelFull: 'Book Activities',
    tabLabelShort: 'Activities',
    heading: 'Book Activities',
    note: '6 hand-picked experiences',
    intro: [
      "Cappadocia has far more to do than one trip allows, and booking sites list hundreds of options. To save you the scrolling, I've narrowed it down to experiences I've done myself and would happily book again, all easy to reserve online.",
    ],
    disclaimer:
      'Some links on this page are affiliate links. If you book through them, I may earn a small commission at no extra cost to you.',
    items: [
      {
        name: 'Half-Day Tour: Underground City & Secret Valley – GetYourGuide',
        imageUrl: '/images/half-day-underground-secret-valley.jpg',
        description:
          'This 5-hour tour can be booked in the morning or afternoon and visit an underground city, a live pottery demonstration and panoramic views over Pigeon Valley, sites hard to reach without a car.\nDuration: 5 hours',
        ctaLabel: 'Check prices on GetYourGuide',
        ctaHref: 'https://getyourguide.stay22.com/goingtorio/m2iuZtqS42',
      },
      {
        name: 'Göreme Open Air Museum Skip-the-Line Ticket – GetYourGuide',
        imageUrl: '/images/goreme-open-air-museum.jpg',
        description:
          'Just a short walk from Göreme, this UNESCO-listed complex of rock-cut churches and monasteries is easy to visit on your own, now also opens for night visits every day. Book your ticket in advance to skip the queue, which can get long in high season.\nDuration: 1–2 hours',
        ctaLabel: 'Check prices on GetYourGuide',
        ctaHref: 'https://getyourguide.stay22.com/goingtorio/OCe-Cqi2bu',
      },
      {
        name: 'Full-Day Red Tour with Guide, Lunch & Tickets – Trip.com',
        imageUrl: '/images/full-day-red-tour.jpg',
        description:
          "My choice to see the main sites like Uçhisar Castle, Paşabağ and Love Valley with quieter spots like Zelve Open Air Museum, a cave town far less crowded than Göreme's Museum. Lunch and entrance tickets are included, so it's a good pick if you'd rather not worry about extra costs during the day.\nDuration: 7 hours",
        ctaLabel: 'Check prices on Trip.com',
        ctaHref: 'https://trip.stay22.com/goingtorio/CqwRUH_8f0',
      },
      {
        name: 'Small-Group Green Tour (South) – GetYourGuide',
        imageUrl: '/images/small-group-green-tour.jpg',
        description:
          "It's a long day, but southern Cappadocia looks nothing like the postcards. The highlight is Ihlara Valley, a green canyon with a river running through it. I like that lunch and entrance fees are optional: you choose where and what to eat, and if you already have a Museum Pass, you don't pay twice.\nDuration: 7.5 hours",
        ctaLabel: 'Check prices on GetYourGuide',
        ctaHref: 'https://getyourguide.stay22.com/goingtorio/OsOUWu8KLC',
      },
      {
        name: 'Turkish Bath & Massage at a Hotel Spa – GetYourGuide',
        imageUrl: '/images/private-hammam-viator.jpg',
        description:
          "A hammam is one of my favorite Turkish experiences, and after a few days hiking the valleys, it's exactly what your body needs. I prefer private hammams like this one where couples can go together. It's set in a beautiful hotel space that blends tradition with modern touches.\nDuration: 1 hour",
        ctaLabel: 'Check prices on GetYourGuide',
        ctaHref: 'https://getyourguide.stay22.com/goingtorio/11eYMmkrfu',
      },
      {
        name: 'Rose and Red Valley Hiking Tour (2 Hours) – GetYourGuide',
        imageUrl: '/images/sunset-hiking-tour.jpg',
        description:
          "This hike covers what I think is the most beautiful stretch of Red Valley, passing rock-cut churches and caves along the way. Timed for sunset, it puts you right in the valley for golden hour, when the rocks glow in shades of pink and orange. You'll finish with a glass of wine to toast the view.\nDuration: 2 hours\nTip: wear proper hiking shoes, since some paths are steep and sandy.",
        ctaLabel: 'Check prices on GetYourGuide',
        ctaHref: 'https://getyourguide.stay22.com/goingtorio/T7Hkv3BuGZ',
      },
    ],
  },
];
