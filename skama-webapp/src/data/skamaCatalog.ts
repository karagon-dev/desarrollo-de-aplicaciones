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
    name: 'Brazalete Raíces Doradas',
    collection: 'Edición limitada',
    categoryName: 'Brazalete',
    material: 'Oro',
    description: 'Un homenaje a la tradición y la naturaleza costarricense.',
    price: 560000,
    stockQuantity: 2,
    imageUrl: assetUrl('limited', 'limited-cultural-bracelet.jpeg'),
    imageAlt: 'Brazalete Raíces Doradas de edición limitada',
    ratingLabel: '4.9 de 5',
    badge: 'Limitada',
    badgeTone: 'limited',
    isLimitedEdition: true,
  },
  {
    id: 'heart-of-my-land-necklace',
    name: 'Collar Corazón de mi Tierra',
    collection: 'Edición limitada',
    categoryName: 'Collar',
    material: 'Oro',
    description: 'La belleza y tradición de nuestra tierra en una joya única.',
    price: 510000,
    stockQuantity: 2,
    imageUrl: assetUrl('limited', 'limited-costa-rican-necklace.jpeg'),
    imageAlt: 'Collar Corazón de mi Tierra de edición limitada',
    ratingLabel: '4.9 de 5',
    badge: 'Limitada',
    badgeTone: 'limited',
    isLimitedEdition: true,
  },
  {
    id: 'purple-dawn-hairpin',
    name: 'Horquilla Aurora Morada',
    collection: 'Edición limitada',
    categoryName: 'Horquilla',
    material: 'Plata verde',
    description: 'Inspirada en la majestuosidad de la guaria morada, símbolo de la belleza nacional.',
    price: 390000,
    stockQuantity: 2,
    imageUrl: assetUrl('limited', 'limited-flower-hairpin.jpeg'),
    imageAlt: 'Horquilla Aurora Morada de edición limitada',
    ratingLabel: '4.8 de 5',
    badge: 'Limitada',
    badgeTone: 'limited',
    isLimitedEdition: true,
  },
  {
    id: 'legacy-of-the-sea-watch',
    name: 'Reloj Legado del Mar',
    collection: 'Edición limitada',
    categoryName: 'Reloj',
    material: 'Plata',
    description: 'La belleza del océano nacional convertida en arte.',
    price: 425000,
    stockQuantity: 2,
    imageUrl: assetUrl('limited', 'limited-fauna-watch.jpeg'),
    imageAlt: 'Reloj Legado del Mar de edición limitada',
    ratingLabel: '4.8 de 5',
    badge: 'Limitada',
    badgeTone: 'limited',
    isLimitedEdition: true,
  },
];

const silverGreenProducts: ISkamaProduct[] = [
  {
    id: 'coffee-ring-green-silver',
    name: 'Anillo Café de mi Tierra',
    collection: 'Plata verde',
    categoryName: 'Anillo',
    material: 'Plata verde',
    description: 'La tradición cafetalera de nuestras amadas tierras.',
    price: 98000,
    stockQuantity: 6,
    imageUrl: assetUrl('regular', 'coffee-ring-green-silver.jpeg'),
    imageAlt: 'Anillo Café de mi Tierra en plata verde',
    ratingLabel: '4.9 de 5',
    badge: 'Destacado',
    badgeTone: 'featured',
  },
  {
    id: 'land-fruit-hairpin-green-silver',
    name: 'Horquilla Fruto de la Tierra',
    collection: 'Plata verde',
    categoryName: 'Horquilla',
    material: 'Plata verde',
    description: 'Donde la naturaleza y la tradición florecen.',
    price: 87000,
    stockQuantity: 4,
    imageUrl: assetUrl('regular', 'land-fruit-hairpin-green-silver.jpeg'),
    imageAlt: 'Horquilla Fruto de la Tierra en plata verde',
    ratingLabel: '4.8 de 5',
    badge: 'Destacado',
    badgeTone: 'featured',
  },
  {
    id: 'eternal-bond-bracelet-green-silver',
    name: 'Pulsera Vínculo Eterno',
    collection: 'Plata verde',
    categoryName: 'Pulsera',
    material: 'Plata verde',
    description: 'Un diseño que simboliza la unión, la fortaleza y la elegancia.',
    price: 104000,
    stockQuantity: 7,
    imageUrl: assetUrl('regular', 'eternal-bond-bracelet-green-silver.jpeg'),
    imageAlt: 'Pulsera Vínculo Eterno en plata verde',
    ratingLabel: '4.8 de 5',
    badge: 'Destacado',
    badgeTone: 'featured',
  },
  {
    id: 'forest-spirit-watch-green-silver',
    name: 'Reloj Espíritu del Bosque',
    collection: 'Plata verde',
    categoryName: 'Reloj',
    material: 'Plata verde',
    description: 'La elegancia de la riqueza natural y la biodiversidad de nuestra tierra.',
    price: 118000,
    stockQuantity: 3,
    imageUrl: assetUrl('regular', 'forest-spirit-watch-green-silver.jpeg'),
    imageAlt: 'Reloj Espíritu del Bosque en plata verde',
    ratingLabel: '4.9 de 5',
    badge: 'Destacado',
    badgeTone: 'featured',
  },
];

const silverProducts: ISkamaProduct[] = [
  {
    id: 'coffee-ring-silver',
    name: 'Anillo Café de mi Tierra',
    collection: 'Plata',
    categoryName: 'Anillo',
    material: 'Plata',
    description: 'La tradición cafetalera de nuestras amadas tierras.',
    price: 92000,
    stockQuantity: 8,
    imageUrl: assetUrl('regular', 'coffee-ring-silver.jpeg'),
    imageAlt: 'Anillo Café de mi Tierra en plata',
    ratingLabel: '4.8 de 5',
    badge: 'Exclusivo',
    badgeTone: 'exclusive',
  },
  {
    id: 'land-fruit-hairpin-silver',
    name: 'Horquilla Fruto de la Tierra',
    collection: 'Plata',
    categoryName: 'Horquilla',
    material: 'Plata',
    description: 'Donde la naturaleza y la tradición florecen.',
    price: 76000,
    stockQuantity: 5,
    imageUrl: assetUrl('regular', 'land-fruit-hairpin-silver.jpeg'),
    imageAlt: 'Horquilla Fruto de la Tierra en plata',
    ratingLabel: '4.8 de 5',
    badge: 'Exclusivo',
    badgeTone: 'exclusive',
  },
  {
    id: 'eternal-bond-bracelet-silver',
    name: 'Pulsera Vínculo Eterno',
    collection: 'Plata',
    categoryName: 'Pulsera',
    material: 'Plata',
    description: 'Un diseño que simboliza la unión, la fortaleza y la elegancia.',
    price: 124000,
    stockQuantity: 6,
    imageUrl: assetUrl('regular', 'eternal-bond-bracelet-silver.jpeg'),
    imageAlt: 'Pulsera Vínculo Eterno en plata',
    ratingLabel: '4.9 de 5',
    badge: 'Exclusivo',
    badgeTone: 'exclusive',
  },
  {
    id: 'forest-spirit-watch-silver',
    name: 'Reloj Espíritu del Bosque',
    collection: 'Plata',
    categoryName: 'Reloj',
    material: 'Plata',
    description: 'La elegancia de la riqueza natural y la biodiversidad de nuestra tierra.',
    price: 109000,
    stockQuantity: 4,
    imageUrl: assetUrl('regular', 'forest-spirit-watch-silver.jpeg'),
    imageAlt: 'Reloj Espíritu del Bosque en plata',
    ratingLabel: '4.7 de 5',
    badge: 'Exclusivo',
    badgeTone: 'exclusive',
  },
];

const goldProducts: ISkamaProduct[] = [
  {
    id: 'coffee-ring-gold',
    name: 'Anillo Café de mi Tierra',
    collection: 'Oro',
    categoryName: 'Anillo',
    material: 'Oro',
    description: 'La tradición cafetalera de nuestras amadas tierras.',
    price: 156000,
    stockQuantity: 5,
    imageUrl: assetUrl('regular', 'coffee-ring-gold.jpeg'),
    imageAlt: 'Anillo Café de mi Tierra en oro',
    ratingLabel: '4.9 de 5',
    badge: 'Nuevo',
    badgeTone: 'accent',
  },
  {
    id: 'land-fruit-hairpin-gold',
    name: 'Horquilla Fruto de la Tierra',
    collection: 'Oro',
    categoryName: 'Horquilla',
    material: 'Oro',
    description: 'Donde la naturaleza y la tradición florecen.',
    price: 142000,
    stockQuantity: 3,
    imageUrl: assetUrl('regular', 'land-fruit-hairpin-gold.jpeg'),
    imageAlt: 'Horquilla Fruto de la Tierra en oro',
    ratingLabel: '4.9 de 5',
    badge: 'Nuevo',
    badgeTone: 'accent',
  },
  {
    id: 'eternal-bond-bracelet-gold',
    name: 'Pulsera Vínculo Eterno',
    collection: 'Oro',
    categoryName: 'Pulsera',
    material: 'Oro',
    description: 'Un diseño que simboliza la unión, la fortaleza y la elegancia.',
    price: 174000,
    stockQuantity: 8,
    imageUrl: assetUrl('regular', 'eternal-bond-bracelet-gold.jpeg'),
    imageAlt: 'Pulsera Vínculo Eterno en oro',
    ratingLabel: '4.8 de 5',
    badge: 'Nuevo',
    badgeTone: 'accent',
  },
  {
    id: 'forest-spirit-watch-gold',
    name: 'Reloj Espíritu del Bosque',
    collection: 'Oro',
    categoryName: 'Reloj',
    material: 'Oro',
    description: 'La elegancia de la riqueza natural y la biodiversidad de nuestra tierra.',
    price: 188000,
    stockQuantity: 4,
    imageUrl: assetUrl('regular', 'forest-spirit-watch-gold.jpeg'),
    imageAlt: 'Reloj Espíritu del Bosque en oro',
    ratingLabel: '4.8 de 5',
    badge: 'Nuevo',
    badgeTone: 'accent',
  },
];

export const skamaSegments: ISkamaSegment[] = [
  {
    id: 'green-silver',
    kicker: 'Plata verde',
    title: 'Joyas plata verde',
    description: 'Piezas de plata con acentos verdes para una expresión fresca, natural y pulida.',
    products: silverGreenProducts,
  },
  {
    id: 'silver',
    kicker: 'Plata',
    title: 'Joyas de plata',
    description: 'Diseños plateados sobrios, limpios y fáciles de combinar dentro de la experiencia SKAMA.',
    products: silverProducts,
  },
  {
    id: 'gold',
    kicker: 'Oro',
    title: 'Joyas de oro',
    description: 'Piezas doradas de presencia cálida, preparadas para elevar combinaciones clásicas y modernas.',
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
    collection: product.categoryName || 'Colección SKAMA',
    categoryName: product.categoryName || 'Joyería',
    material: product.categoryName || 'Esmeralda',
    description: product.description || 'Pieza seleccionada del catálogo SKAMA.',
    price: product.price,
    stockQuantity: product.stockQuantity,
    imageUrl: imageUrl || fallbackImages[index % fallbackImages.length],
    imageAlt: product.name,
    ratingLabel: '4.8 de 5',
    badge: product.stockQuantity <= product.minimumStock ? 'Stock bajo' : undefined,
    badgeTone: product.stockQuantity <= product.minimumStock ? 'limited' : undefined,
  };
}

export function findSkamaProduct(productId?: string): ISkamaProduct | undefined {
  if (!productId) {
    return undefined;
  }

  return skamaProducts.find((product) => product.id === productId);
}
