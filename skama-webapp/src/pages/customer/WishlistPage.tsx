import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { SkamaProductCard } from '../../components/skama/SkamaProductCard';
import type { ISkamaProduct } from '../../data/skamaCatalog';
import { skamaProducts } from '../../data/skamaCatalog';
import { useWishlist } from '../../hooks';
import { ROUTES } from '../../routes/routePaths';

const LOCAL_FAVORITES_KEY = 'skama-local-favorites';

function readLocalFavoriteIds(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_FAVORITES_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function WishlistPage() {
  const { items } = useWishlist();
  const [localFavoriteIds, setLocalFavoriteIds] = useState(() => readLocalFavoriteIds());

  useEffect(() => {
    function syncFavorites() {
      setLocalFavoriteIds(readLocalFavoriteIds());
    }

    window.addEventListener('storage', syncFavorites);
    window.addEventListener('focus', syncFavorites);
    return () => {
      window.removeEventListener('storage', syncFavorites);
      window.removeEventListener('focus', syncFavorites);
    };
  }, []);

  const backendProducts = useMemo<ISkamaProduct[]>(
    () =>
      items.map((item, index) => ({
        id: item.productId,
        backendProductId: item.productId,
        name: item.productName,
        collection: 'Favoritos',
        categoryName: 'Joya',
        material: 'Esmeralda',
        description: 'Producto guardado en favoritos.',
        price: item.price,
        stockQuantity: item.stockQuantity,
        imageUrl: skamaProducts[index % skamaProducts.length].imageUrl,
        imageAlt: item.productName,
        ratingLabel: '4.8 de 5',
        badge: 'Favorito',
        badgeTone: 'accent',
      })),
    [items],
  );

  const localProducts = skamaProducts.filter((product) => localFavoriteIds.includes(product.id));
  const visibleProducts = backendProducts.length > 0 ? backendProducts : localProducts;

  return (
    <div className="sk-page">
      <header className="sk-page-header sk-container">
        <p className="sk-kicker">Destacados</p>
        <h1>Joyas guardadas para revisar despues.</h1>
        <p className="sk-lede">
          Conserva tus piezas favoritas y vuelve al catalogo cuando quieras finalizar el pedido.
        </p>
      </header>

      {visibleProducts.length > 0 ? (
        <section className="sk-section" aria-label="Productos favoritos">
          <div className="sk-product-grid">
            {visibleProducts.map((product) => (
              <SkamaProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : (
        <section className="sk-container sk-section">
          <div className="sk-empty-state">
            <h2>Sin favoritos por ahora.</h2>
            <p>Marca piezas desde colecciones para guardarlas en este espacio.</p>
            <RouterLink className="sk-button sk-button--primary" to={ROUTES.catalog}>
              Explorar colecciones
            </RouterLink>
          </div>
        </section>
      )}
    </div>
  );
}
