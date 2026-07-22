import type { IProductDto } from '../types';

export interface ISkamaProduct {
  id: string;
  backendProductId?: string;
  name: string;
  collection: string;
  categoryName: string;
  material: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  imageAlt: string;
  ratingLabel: string;
  badge?: string;
  badgeTone?: 'accent' | 'exclusive' | 'featured' | 'limited';
  isLimitedEdition?: boolean;
}

export interface ISkamaSegment {
  id: string;
  kicker: string;
  title: string;
  description: string;
  products: ISkamaProduct[];
}

function assetUrl(folder: string, fileName: string): string {
  return `/assets/${folder}/${encodeURIComponent(fileName)}`;
}

export const limitedProducts: ISkamaProduct[] = [
  {
    id: 'golden-roots-bracelet',
    name: 'Golden Roots Bracelet',
    collection: 'Limited edition',
    categoryName: 'Bracelet',
    material: 'Gold',
    description: 'A tribute to Costa Rican tradition and nature.',
    price: 560000,
    stockQuantity: 2,
    imageUrl: assetUrl('limited', 'limited-cultural-bracelet.jpeg'),
    imageAlt: 'Golden Roots Bracelet limited edition',
    ratingLabel: '4.9 out of 5',
    badge: 'Limited',
    badgeTone: 'limited',
    isLimitedEdition: true,
  },
  {
    id: 'heart-of-my-land-necklace',
    name: 'Heart of My Land Necklace',
    collection: 'Limited edition',
    categoryName: 'Necklace',
    material: 'Gold',
    description: 'The beauty and tradition of our land in a unique jewel.',
    price: 510000,
    stockQuantity: 2,
    imageUrl: assetUrl('limited', 'limited-costa-rican-necklace.jpeg'),
    imageAlt: 'Heart of My Land Necklace limited edition',
    ratingLabel: '4.9 out of 5',
    badge: 'Limited',
    badgeTone: 'limited',
    isLimitedEdition: true,
  },
  {
    id: 'purple-dawn-hairpin',
    name: 'Purple Dawn Hairpin',
    collection: 'Limited edition',
    categoryName: 'Hairpin',
    material: 'Green silver',
    description: 'Inspired by the purple guaria, a symbol of national beauty.',
    price: 390000,
    stockQuantity: 2,
    imageUrl: assetUrl('limited', 'limited-flower-hairpin.jpeg'),
    imageAlt: 'Purple Dawn Hairpin limited edition',
    ratingLabel: '4.8 out of 5',
    badge: 'Limited',
    badgeTone: 'limited',
    isLimitedEdition: true,
  },
  {
    id: 'legacy-of-the-sea-watch',
    name: 'Legacy of the Sea Watch',
    collection: 'Limited edition',
    categoryName: 'Watch',
    material: 'Silver',
    description: 'The beauty of the national ocean transformed into art.',
    price: 425000,
    stockQuantity: 2,
    imageUrl: assetUrl('limited', 'limited-fauna-watch.jpeg'),
    imageAlt: 'Legacy of the Sea Watch limited edition',
    ratingLabel: '4.8 out of 5',
    badge: 'Limited',
    badgeTone: 'limited',
    isLimitedEdition: true,
  },
];

const silverGreenProducts: ISkamaProduct[] = [
  {
    id: 'coffee-ring-green-silver',
    name: 'Coffee of My Land Ring',
    collection: 'Green silver',
    categoryName: 'Ring',
    material: 'Green silver',
    description: 'The coffee tradition of our beloved lands.',
    price: 98000,
    stockQuantity: 6,
    imageUrl: assetUrl('regular', 'coffee-ring-green-silver.jpeg'),
    imageAlt: 'Coffee of My Land Ring in green silver',
    ratingLabel: '4.9 out of 5',
    badge: 'Featured',
    badgeTone: 'featured',
  },
  {
    id: 'land-fruit-hairpin-green-silver',
    name: 'Fruit of the Land Hairpin',
    collection: 'Green silver',
    categoryName: 'Hairpin',
    material: 'Green silver',
    description: 'Where nature and tradition flourish.',
    price: 87000,
    stockQuantity: 4,
    imageUrl: assetUrl('regular', 'land-fruit-hairpin-green-silver.jpeg'),
    imageAlt: 'Fruit of the Land Hairpin in green silver',
    ratingLabel: '4.8 out of 5',
    badge: 'Featured',
    badgeTone: 'featured',
  },
  {
    id: 'eternal-bond-bracelet-green-silver',
    name: 'Eternal Bond Bracelet',
    collection: 'Green silver',
    categoryName: 'Bracelet',
    material: 'Green silver',
    description: 'A design that symbolizes unity, strength, and elegance.',
    price: 104000,
    stockQuantity: 7,
    imageUrl: assetUrl('regular', 'eternal-bond-bracelet-green-silver.jpeg'),
    imageAlt: 'Eternal Bond Bracelet in green silver',
    ratingLabel: '4.8 out of 5',
    badge: 'Featured',
    badgeTone: 'featured',
  },
  {
    id: 'forest-spirit-watch-green-silver',
    name: 'Forest Spirit Watch',
    collection: 'Green silver',
    categoryName: 'Watch',
    material: 'Green silver',
    description: 'The elegance of natural richness and the biodiversity of our land.',
    price: 118000,
    stockQuantity: 3,
    imageUrl: assetUrl('regular', 'forest-spirit-watch-green-silver.jpeg'),
    imageAlt: 'Forest Spirit Watch in green silver',
    ratingLabel: '4.9 out of 5',
    badge: 'Featured',
    badgeTone: 'featured',
  },
];

const silverProducts: ISkamaProduct[] = [
  {
    id: 'coffee-ring-silver',
    name: 'Coffee of My Land Ring',
    collection: 'Silver',
    categoryName: 'Ring',
    material: 'Silver',
    description: 'The coffee tradition of our beloved lands.',
    price: 92000,
    stockQuantity: 8,
    imageUrl: assetUrl('regular', 'coffee-ring-silver.jpeg'),
    imageAlt: 'Coffee of My Land Ring in silver',
    ratingLabel: '4.8 out of 5',
    badge: 'Exclusive',
    badgeTone: 'exclusive',
  },
  {
    id: 'land-fruit-hairpin-silver',
    name: 'Fruit of the Land Hairpin',
    collection: 'Silver',
    categoryName: 'Hairpin',
    material: 'Silver',
    description: 'Where nature and tradition flourish.',
    price: 76000,
    stockQuantity: 5,
    imageUrl: assetUrl('regular', 'land-fruit-hairpin-silver.jpeg'),
    imageAlt: 'Fruit of the Land Hairpin in silver',
    ratingLabel: '4.8 out of 5',
    badge: 'Exclusive',
    badgeTone: 'exclusive',
  },
  {
    id: 'eternal-bond-bracelet-silver',
    name: 'Eternal Bond Bracelet',
    collection: 'Silver',
    categoryName: 'Bracelet',
    material: 'Silver',
    description: 'A design that symbolizes unity, strength, and elegance.',
    price: 124000,
    stockQuantity: 6,
    imageUrl: assetUrl('regular', 'eternal-bond-bracelet-silver.jpeg'),
    imageAlt: 'Eternal Bond Bracelet in silver',
    ratingLabel: '4.9 out of 5',
    badge: 'Exclusive',
    badgeTone: 'exclusive',
  },
  {
    id: 'forest-spirit-watch-silver',
    name: 'Forest Spirit Watch',
    collection: 'Silver',
    categoryName: 'Watch',
    material: 'Silver',
    description: 'The elegance of natural richness and the biodiversity of our land.',
    price: 109000,
    stockQuantity: 4,
    imageUrl: assetUrl('regular', 'forest-spirit-watch-silver.jpeg'),
    imageAlt: 'Forest Spirit Watch in silver',
    ratingLabel: '4.7 out of 5',
    badge: 'Exclusive',
    badgeTone: 'exclusive',
  },
];

const goldProducts: ISkamaProduct[] = [
  {
    id: 'coffee-ring-gold',
    name: 'Coffee of My Land Ring',
    collection: 'Gold',
    categoryName: 'Ring',
    material: 'Gold',
    description: 'The coffee tradition of our beloved lands.',
    price: 156000,
    stockQuantity: 5,
    imageUrl: assetUrl('regular', 'coffee-ring-gold.jpeg'),
    imageAlt: 'Coffee of My Land Ring in gold',
    ratingLabel: '4.9 out of 5',
    badge: 'New',
    badgeTone: 'accent',
  },
  {
    id: 'land-fruit-hairpin-gold',
    name: 'Fruit of the Land Hairpin',
    collection: 'Gold',
    categoryName: 'Hairpin',
    material: 'Gold',
    description: 'Where nature and tradition flourish.',
    price: 142000,
    stockQuantity: 3,
    imageUrl: assetUrl('regular', 'land-fruit-hairpin-gold.jpeg'),
    imageAlt: 'Fruit of the Land Hairpin in gold',
    ratingLabel: '4.9 out of 5',
    badge: 'New',
    badgeTone: 'accent',
  },
  {
    id: 'eternal-bond-bracelet-gold',
    name: 'Eternal Bond Bracelet',
    collection: 'Gold',
    categoryName: 'Bracelet',
    material: 'Gold',
    description: 'A design that symbolizes unity, strength, and elegance.',
    price: 174000,
    stockQuantity: 8,
    imageUrl: assetUrl('regular', 'eternal-bond-bracelet-gold.jpeg'),
    imageAlt: 'Eternal Bond Bracelet in gold',
    ratingLabel: '4.8 out of 5',
    badge: 'New',
    badgeTone: 'accent',
  },
  {
    id: 'forest-spirit-watch-gold',
    name: 'Forest Spirit Watch',
    collection: 'Gold',
    categoryName: 'Watch',
    material: 'Gold',
    description: 'The elegance of natural richness and the biodiversity of our land.',
    price: 188000,
    stockQuantity: 4,
    imageUrl: assetUrl('regular', 'forest-spirit-watch-gold.jpeg'),
    imageAlt: 'Forest Spirit Watch in gold',
    ratingLabel: '4.8 out of 5',
    badge: 'New',
    badgeTone: 'accent',
  },
];

export const skamaSegments: ISkamaSegment[] = [
  {
    id: 'green-silver',
    kicker: 'Green silver',
    title: 'Green silver jewelry',
    description: 'Silver pieces with green accents for a fresh, natural, and polished expression.',
    products: silverGreenProducts,
  },
  {
    id: 'silver',
    kicker: 'Silver',
    title: 'Silver jewelry',
    description: 'Subtle, clean silver designs that are easy to pair within the SKAMA experience.',
    products: silverProducts,
  },
  {
    id: 'gold',
    kicker: 'Gold',
    title: 'Gold jewelry',
    description: 'Warm gold pieces designed to elevate classic and modern combinations.',
    products: goldProducts,
  },
];

export const skamaProducts = [
  ...limitedProducts,
  ...silverGreenProducts,
  ...silverProducts,
  ...goldProducts,
];

const fallbackImages = [
  silverGreenProducts[0].imageUrl,
  silverProducts[2].imageUrl,
  goldProducts[3].imageUrl,
  limitedProducts[1].imageUrl,
];

export function mapApiProductToSkamaProduct(
  product: IProductDto,
  imageUrl?: string,
  index = 0,
): ISkamaProduct {
  return {
    id: product.id,
    backendProductId: product.id,
    name: product.name,
    collection: product.categoryName || 'SKAMA collection',
    categoryName: product.categoryName || 'Jewelry',
    material: product.categoryName || 'Emerald',
    description: product.description || 'Selected piece from the SKAMA catalog.',
    price: product.price,
    stockQuantity: product.stockQuantity,
    imageUrl: imageUrl || fallbackImages[index % fallbackImages.length],
    imageAlt: product.name,
    ratingLabel: '4.8 out of 5',
    badge: product.stockQuantity <= product.minimumStock ? 'Low stock' : undefined,
    badgeTone: product.stockQuantity <= product.minimumStock ? 'limited' : undefined,
  };
}

export function findSkamaProduct(productId?: string): ISkamaProduct | undefined {
  if (!productId) {
    return undefined;
  }

  return skamaProducts.find((product) => product.id === productId);
}
