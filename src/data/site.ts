/* ------------------------------------------------------------------ */
/*  O'Atlas Marrakech — all site content lives here                    */
/* ------------------------------------------------------------------ */

export interface Photo {
  src: string;
  alt: string;
}

const img = (file: string, alt: string): Photo => ({ src: `/images/${file}`, alt });

/**
 * Venue photography, keyed by the client's photo numbers.
 * Files live in /public/images and are referenced by their public paths.
 */
export const photos = {
  photo2: img("wedding-hero-evening.jpg", "Evening celebration beneath white canopies reflected in the estate's pool"),
  photo3: img("wedding-pergola-ceremony.jpg", "Wedding ceremony beneath a white pergola decorated with white flowers"),
  photo4: img("wedding-moroccan-welcome.jpg", "Musicians in blue robes welcoming guests with a red carpet at the estate entrance"),
  photo5: img("wedding-poolside-vows.jpg", "Newlyweds kissing beneath a floral arch overlooking the pool"),
  photo6: img("wedding-gnawa-tradition.jpg", "Gnawa musician in traditional dress beside the groom during the reception"),
  photo7: img("wedding-moroccan-lounge.jpg", "Moroccan lounge with colorful poufs, rugs and lanterns under the trees"),
  photo9: img("wedding-estate-ceremony.jpg", "Wedding ceremony in front of the O'Atlas estate, reflected in the pool"),
  photo10: img("wedding-evening-party.jpg", "Evening reception with illuminated palms, tables and a lit arch beside the pool"),
} satisfies Record<string, Photo>;

/** All photographs from the client's "Wedding in Marrakech" set. */
const weddingPhotos: Photo[] = [
  photos.photo3,
  photos.photo5,
  photos.photo9,
  img("wedding-garden-ceremony.jpg", "Wedding officiant addressing guests beside the estate's reflecting pool"),
  photos.photo2,
  img("wedding-night-reception.jpg", "Wedding reception tables and gold chairs beside the reflecting pool at night"),
  photos.photo10,
  photos.photo6,
  img("wedding-celebration-dance.jpg", "Guests and musicians dancing in red kaftans at a wedding celebration"),
  photos.photo4,
  photos.photo7,
  img("wedding-henna-ceremony.jpg", "Henna being applied to a bride's hand during the ceremony"),
  img("wedding-henna-hands.jpg", "Bride and groom with henna in their palms during the henna ceremony"),
  img("wedding-bouquet-detail.jpg", "White rose bouquet and a glass of champagne on a terrace"),
];

/** Photographs from the client's "reception venues" set. */
const receptionVenuePhotos = {
  domeDinner: img("reception-dome-dinner.jpg", "Candlelit wedding dinner with a white gazebo and pink lighting beside the pool"),
  loveDinner: img("reception-love-dinner.jpg", "Outdoor reception tables under palm trees with purple lighting and a LOVE sign"),
  indoorCeremony: img("reception-indoor-ceremony.jpg", "Indoor ceremony hall with a petal-strewn aisle and gold chairs"),
  gardenAisle: img("reception-garden-aisle.jpg", "Garden ceremony aisle with gold chairs leading to a floral arch"),
};

/* ------------------------------ Brand ------------------------------- */

export const brand = {
  name: "O'Atlas",
  fullName: "O'Atlas Marrakech",
  tagline: "Weddings & Events",
};

// Business phone number in international format, digits only.
export const whatsappBusinessNumber = "212728585823";

export const whatsappIcon = "/images/whatsapp-white-icon.webp";

/** PHP endpoint that sends the client + admin emails. */
export const inquiryEndpoint = "/api/send-inquiry.php";

export const whatsappLink = (message: string) =>
  `https://wa.me/${whatsappBusinessNumber}?text=${encodeURIComponent(message)}`;

export const defaultWhatsappMessage =
  "Hello, I would like information about a wedding or event at O'Atlas Marrakech.";

export const navLinks = [
  { label: "Celebrations", href: "#celebrations" },
  { label: "Our promise", href: "#promise" },
  { label: "Signature experiences", href: "#experiences" },
  { label: "Reservation", href: "#contact" },
];

/* --------------------------- Section 2 ------------------------------ */

export interface Celebration {
  title: string;
  description: string;
  photo: Photo;
  gallery: Photo[];
}

export const celebrations: Celebration[] = [
  {
    title: "Weddings & Receptions",
    description:
      "Celebrate your love with romantic poolside ceremonies, beautiful floral settings and elegant wedding receptions.",
    photo: photos.photo3,
    gallery: weddingPhotos,
  },
  {
    title: "Private Dinners & Celebrations",
    description:
      "Gather your loved ones for sophisticated outdoor dining, surrounded by palm trees, atmospheric lighting and shimmering reflections.",
    photo: receptionVenuePhotos.domeDinner,
    gallery: [
      receptionVenuePhotos.domeDinner,
      receptionVenuePhotos.loveDinner,
      receptionVenuePhotos.indoorCeremony,
      receptionVenuePhotos.gardenAisle,
    ],
  },
  {
    title: "Private Parties & Special Events",
    description:
      "Celebrate birthdays, anniversaries and special occasions with stylish Moroccan lounges, curated entertainment and unforgettable evenings.",
    photo: receptionVenuePhotos.loveDinner,
    gallery: [
      receptionVenuePhotos.loveDinner,
      receptionVenuePhotos.domeDinner,
      receptionVenuePhotos.indoorCeremony,
      receptionVenuePhotos.gardenAisle,
    ],
  },
];

/* --------------------------- Section 3 ------------------------------ */

export const promises = [
  {
    title: "Bespoke Celebrations",
    description: "Every event is thoughtfully designed around your personal style, traditions and vision.",
    icon: "sparkles",
  },
  {
    title: "Exceptional Event Spaces",
    description:
      "Palm-lined pools, elegant terraces and landscaped gardens provide spectacular backdrops for every celebration.",
    icon: "palm",
  },
  {
    title: "Memorable Guest Experiences",
    description:
      "From warm Moroccan welcomes to elegant dining and evening entertainment, every moment is designed to delight.",
    icon: "heart",
  },
] as const;

/* --------------------------- Section 4 ------------------------------ */

export interface SignatureExperience {
  title: string;
  description: string;
  photo: Photo;
}

export const signatureExperiences: SignatureExperience[] = [
  {
    title: "Romantic Poolside Ceremonies",
    description: "Exchange vows beneath a beautiful floral arch overlooking the water.",
    photo: photos.photo5,
  },
  {
    title: "Elegant Wedding Receptions",
    description: "Celebrate with atmospheric outdoor dining beneath the stars.",
    photo: photos.photo6,
  },
  {
    title: "Traditional Moroccan Welcomes",
    description: "Create an unforgettable arrival with traditional music and local charm.",
    photo: photos.photo4,
  },
  {
    title: "Moroccan-Themed Evenings",
    description: "Enjoy vibrant lounge settings, rich colors and intimate gatherings.",
    photo: photos.photo7,
  },
  {
    title: "Exclusive Evening Parties",
    description: "Celebrate beneath illuminated palm trees in a magical nighttime setting.",
    photo: photos.photo10,
  },
];

/* ----------------------------- Inquiry ------------------------------ */

export interface EventInquiry {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  guestCount: string;
  message: string;
  /** Honeypot — must stay empty. */
  website: string;
}

export const eventTypeOptions = [
  "Wedding",
  "Wedding reception",
  "Engagement party",
  "Private dinner",
  "Birthday celebration",
  "Anniversary",
  "Private party",
  "Moroccan-themed evening",
  "Corporate event",
  "Other",
];

export const defaultEventInquiry = (): EventInquiry => ({
  name: "",
  email: "",
  phone: "",
  eventType: "Wedding",
  eventDate: "",
  guestCount: "",
  message: "",
  website: "",
});

export const formatEventDate = (iso: string) => {
  if (!iso) return "Date to be confirmed";
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
