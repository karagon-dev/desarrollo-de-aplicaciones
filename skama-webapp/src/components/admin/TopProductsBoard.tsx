import type { ITopProductSummary } from '../../types';
import { formatPrice } from '../../utils';

interface TopProductsBoardProps {
  products: ITopProductSummary[];
}

export function TopProductsBoard({ products }: TopProductsBoardProps) {
  const ranked = products.slice(0, 5);
  const maxSales = Math.max(...ranked.map((product) => product.totalSales), 1);

  if (ranked.length === 0) {
    return (
      <p className="sk-admin-empty">
        Las joyas más pedidas aparecerán aquí en cuanto haya órdenes pagadas.
      </p>
    );
  }

  return (
    <ol className="sk-admin-rank">
      {ranked.map((product, index) => (
        <li key={product.productId} className="sk-admin-rank__item">
          <span className="sk-admin-rank__index">{String(index + 1).padStart(2, '0')}</span>
          <div className="sk-admin-rank__copy">
            <strong>{product.productName}</strong>
            <span>
              {product.totalQuantitySold} {product.totalQuantitySold === 1 ? 'pieza' : 'piezas'} ·{' '}
              {formatPrice(product.totalSales)}
            </span>
            <span
              className="sk-admin-rank__bar"
              style={{ width: `${Math.max((product.totalSales / maxSales) * 100, 8)}%` }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}
