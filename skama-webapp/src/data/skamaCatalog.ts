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
    id: 'brazalete-raices-doradas',
    name: 'Brazalete Raices Doradas',
    collection: 'Edicion limitada',
    categoryName: 'Brazalete',
    material: 'Oro',
    description: 'Un homenaje a la tradicion y la naturaleza costarricense.',
    price: 560000,
    stockQuantity: 2,
    imageUrl: assetUrl('Limitadas', 'Brazalete_CulturalLim.jpeg'),
    imageAlt: 'Brazalete Raices Doradas de edicion limitada',
    ratingLabel: '4.9 de 5',
    badge: 'Limitada',
    badgeTone: 'limited',
    isLimitedEdition: true,
  },
  {
    id: 'collar-corazon-de-mi-tierra',
    name: 'Collar Corazon de mi Tierra',
    collection: 'Edicion limitada',
    categoryName: 'Collar',
    material: 'Oro',
    description: 'La belleza y tradicion de nuestra tierra en una joya unica.',
    price: 510000,
    stockQuantity: 2,
    imageUrl: assetUrl('Limitadas', 'Collar_CostarricenseLim.jpeg'),
    imageAlt: 'Collar Corazon de mi Tierra de edicion limitada',
    ratingLabel: '4.9 de 5',
    badge: 'Limitada',
    badgeTone: 'limited',
    isLimitedEdition: true,
  },
  {
    id: 'horquilla-aurora-morada',
    name: 'Horquilla Aurora Morada',
    collection: 'Edicion limitada',
    categoryName: 'Horquilla',
    material: 'Plata verde',
    description: 'Inspirada en la guaria morada, simbolo de la belleza nacional.',
    price: 390000,
    stockQuantity: 2,
    imageUrl: assetUrl('Limitadas', 'HORQUILLA_FlorLim.jpeg'),
    imageAlt: 'Horquilla Aurora Morada de edicion limitada',
    ratingLabel: '4.8 de 5',
    badge: 'Limitada',
    badgeTone: 'limited',
    isLimitedEdition: true,
  },
  {
    id: 'reloj-legado-del-mar',
    name: 'Reloj Legado del Mar',
    collection: 'Edicion limitada',
    categoryName: 'Reloj',
    material: 'Plata',
    description: 'La belleza del oceano nacional convertida en arte.',
    price: 425000,
    stockQuantity: 2,
    imageUrl: assetUrl('Limitadas', 'RELOJ_FaunaLim.jpeg'),
    imageAlt: 'Reloj Legado del Mar de edicion limitada',
    ratingLabel: '4.8 de 5',
    badge: 'Limitada',
    badgeTone: 'limited',
    isLimitedEdition: true,
  },
];

const silverGreenProducts: ISkamaProduct[] = [
  {
    id: 'anillo-cafe-plata-verde',
    name: 'Anillo Cafe de mi Tierra',
    collection: 'Plata verde',
    categoryName: 'Anillo',
    material: 'Plata verde',
    description: 'La tradicion cafetalera de nuestras amadas tierras.',
    price: 98000,
    stockQuantity: 6,
    imageUrl: assetUrl('Regulares', 'ANILLOCafé_PLATAV.jpeg'),
    imageAlt: 'Anillo Cafe de mi Tierra en plata verde',
    ratingLabel: '4.9 de 5',
    badge: 'Destacada',
    badgeTone: 'featured',
  },
  {
    id: 'horquilla-fruto-plata-verde',
    name: 'Horquilla Fruto de la Tierra',
    collection: 'Plata verde',
    categoryName: 'Horquilla',
    material: 'Plata verde',
    description: 'Donde la naturaleza y la tradicion florecen.',
    price: 87000,
    stockQuantity: 4,
    imageUrl: assetUrl('Regulares', 'HORQUILLACafé_PLATAV.jpeg'),
    imageAlt: 'Horquilla Fruto de la Tierra en plata verde',
    ratingLabel: '4.8 de 5',
    badge: 'Destacada',
    badgeTone: 'featured',
  },
  {
    id: 'pulsera-vinculo-plata-verde',
    name: 'Pulsera Vinculo Eterno',
    collection: 'Plata verde',
    categoryName: 'Pulsera',
    material: 'Plata verde',
    description: 'Un diseno que simboliza la union, la fortaleza y la elegancia.',
    price: 104000,
    stockQuantity: 7,
    imageUrl: assetUrl('Regulares', 'PULSERA_PLATAV.jpeg'),
    imageAlt: 'Pulsera Vinculo Eterno en plata verde',
    ratingLabel: '4.8 de 5',
    badge: 'Destacada',
    badgeTone: 'featured',
  },
  {
    id: 'reloj-bosque-plata-verde',
    name: 'Reloj Espiritu del Bosque',
    collection: 'Plata verde',
    categoryName: 'Reloj',
    material: 'Plata verde',
    description: 'La elegancia de la riqueza natural y la biodiversidad de nuestra tierra.',
    price: 118000,
    stockQuantity: 3,
    imageUrl: assetUrl('Regulares', 'RELOJFauna_PLATAV.jpeg'),
    imageAlt: 'Reloj Espiritu del Bosque en plata verde',
    ratingLabel: '4.9 de 5',
    badge: 'Destacada',
    badgeTone: 'featured',
  },
];

const silverProducts: ISkamaProduct[] = [
  {
    id: 'anillo-cafe-plata',
    name: 'Anillo Cafe de mi Tierra',
    collection: 'Plata',
    categoryName: 'Anillo',
    material: 'Plata',
    description: 'La tradicion cafetalera de nuestras amadas tierras.',
    price: 92000,
    stockQuantity: 8,
    imageUrl: assetUrl('Regulares', 'ANILLOCafé_PLATA.jpeg'),
    imageAlt: 'Anillo Cafe de mi Tierra en plata',
    ratingLabel: '4.8 de 5',
    badge: 'Exclusiva',
    badgeTone: 'exclusive',
  },
  {
    id: 'horquilla-fruto-plata',
    name: 'Horquilla Fruto de la Tierra',
    collection: 'Plata',
    categoryName: 'Horquilla',
    material: 'Plata',
    description: 'Donde la naturaleza y la tradicion florecen.',
    price: 76000,
    stockQuantity: 5,
    imageUrl: assetUrl('Regulares', 'HORQUILLACafé_PLATA.jpeg'),
    imageAlt: 'Horquilla Fruto de la Tierra en plata',
    ratingLabel: '4.8 de 5',
    badge: 'Exclusiva',
    badgeTone: 'exclusive',
  },
  {
    id: 'pulsera-vinculo-plata',
    name: 'Pulsera Vinculo Eterno',
    collection: 'Plata',
    categoryName: 'Pulsera',
    material: 'Plata',
    description: 'Un diseno que simboliza la union, la fortaleza y la elegancia.',
    price: 124000,
    stockQuantity: 6,
    imageUrl: assetUrl('Regulares', 'PULSERA_PLATA.jpeg'),
    imageAlt: 'Pulsera Vinculo Eterno en plata',
    ratingLabel: '4.9 de 5',
    badge: 'Exclusiva',
    badgeTone: 'exclusive',
  },
  {
    id: 'reloj-bosque-plata',
    name: 'Reloj Espiritu del Bosque',
    collection: 'Plata',
    categoryName: 'Reloj',
    material: 'Plata',
    description: 'La elegancia de la riqueza natural y la biodiversidad de nuestra tierra.',
    price: 109000,
    stockQuantity: 4,
    imageUrl: assetUrl('Regulares', 'RELOJFauna_PLATA.jpeg'),
    imageAlt: 'Reloj Espiritu del Bosque en plata',
    ratingLabel: '4.7 de 5',
    badge: 'Exclusiva',
    badgeTone: 'exclusive',
  },
];

const goldProducts: ISkamaProduct[] = [
  {
    id: 'anillo-cafe-oro',
    name: 'Anillo Cafe de mi Tierra',
    collection: 'Oro',
    categoryName: 'Anillo',
    material: 'Oro',
    description: 'La tradicion cafetalera de nuestras amadas tierras.',
    price: 156000,
    stockQuantity: 5,
    imageUrl: assetUrl('Regulares', 'ANILLOCafé_ORO.jpeg'),
    imageAlt: 'Anillo Cafe de mi Tierra en oro',
    ratingLabel: '4.9 de 5',
    badge: 'Nueva',
    badgeTone: 'accent',
  },
  {
    id: 'horquilla-fruto-oro',
    name: 'Horquilla Fruto de la Tierra',
    collection: 'Oro',
    categoryName: 'Horquilla',
    material: 'Oro',
    description: 'Donde la naturaleza y la tradicion florecen.',
    price: 142000,
    stockQuantity: 3,
    imageUrl: assetUrl('Regulares', 'HORQUILLACafé_ORO.jpeg'),
    imageAlt: 'Horquilla Fruto de la Tierra en oro',
    ratingLabel: '4.9 de 5',
    badge: 'Nueva',
    badgeTone: 'accent',
  },
  {
    id: 'pulsera-vinculo-oro',
    name: 'Pulsera Vinculo Eterno',
    collection: 'Oro',
    categoryName: 'Pulsera',
    material: 'Oro',
    description: 'Un diseno que simboliza la union, la fortaleza y la elegancia.',
    price: 174000,
    stockQuantity: 8,
    imageUrl: assetUrl('Regulares', 'PULSERA_ORO.jpeg'),
    imageAlt: 'Pulsera Vinculo Eterno en oro',
    ratingLabel: '4.8 de 5',
    badge: 'Nueva',
    badgeTone: 'accent',
  },
  {
    id: 'reloj-bosque-oro',
    name: 'Reloj Espiritu del Bosque',
    collection: 'Oro',
    categoryName: 'Reloj',
    material: 'Oro',
    description: 'La elegancia de la riqueza natural y la biodiversidad de nuestra tierra.',
    price: 188000,
    stockQuantity: 4,
    imageUrl: assetUrl('Regulares', 'RELOJFauna_ORO.jpeg'),
    imageAlt: 'Reloj Espiritu del Bosque en oro',
    ratingLabel: '4.8 de 5',
    badge: 'Nueva',
    badgeTone: 'accent',
  },
];

export const skamaSegments: ISkamaSegment[] = [
  {
    id: 'plata-verde',
    kicker: 'Plata verde',
    title: 'Joyas plata verde',
    description: 'Piezas de plata con acentos verdes para una expresion fresca, natural y pulida.',
    products: silverGreenProducts,
  },
  {
    id: 'plata',
    kicker: 'Plata',
    title: 'Joyas de plata',
    description: 'Disenos plateados sobrios, limpios y faciles de combinar dentro de la experiencia SKAMA.',
    products: silverProducts,
  },
  {
    id: 'oro',
    kicker: 'Oro',
    title: 'Joyas de oro',
    description: 'Piezas doradas de presencia calida, preparadas para elevar combinaciones clasicas y modernas.',
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
    collection: product.categoryName || 'Coleccion SKAMA',
    categoryName: product.categoryName || 'Joya',
    material: product.categoryName || 'Esmeralda',
    description: product.description || 'Pieza seleccionada del catalogo SKAMA.',
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
