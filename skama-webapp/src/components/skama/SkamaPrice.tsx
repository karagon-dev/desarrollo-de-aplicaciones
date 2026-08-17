import type { ISkamaProduct } from '../../data/skamaCatalog';
import { formatPrice } from '../../utils';

type SkamaPriceProps = Pick<ISkamaProduct, 'price' | 'originalPrice' | 'discountPercentage'>;

export function SkamaPrice({ price, originalPrice, discountPercentage }: SkamaPriceProps) {
  const hasDiscount = originalPrice !== undefined && originalPrice > price && discountPercentage !== undefined;

  if (!hasDiscount) {
    return <strong className="sk-price">{formatPrice(price)}</strong>;
  }

  return (
    <span
      className="sk-price-block"
      aria-label={`Precio promocional ${formatPrice(price)}. Precio original ${formatPrice(
        originalPrice,
      )}. ${discountPercentage}% de descuento.`}
    >
      <span className="sk-price-block__meta" aria-hidden="true">
        <span className="sk-price__old">{formatPrice(originalPrice)}</span>
        <span className="sk-price__discount">-{discountPercentage}% de descuento</span>
      </span>
      <strong className="sk-price sk-price-block__current" aria-hidden="true">
        {formatPrice(price)}
      </strong>
    </span>
  );
}
