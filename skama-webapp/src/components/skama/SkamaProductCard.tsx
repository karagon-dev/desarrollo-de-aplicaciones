import { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import type { ISkamaProduct } from '../../data/skamaCatalog';
import { ROUTES } from '../../routes/routePaths';
import { useAuth, useCart, useWishlist } from '../../hooks';
import { addLocalCartItem, formatPrice, getApiErrorMessage } from '../../utils';

interface ISkamaProductCardProps {
  product: ISkamaProduct;
  compact?: boolean;
}

const LOCAL_FAVORITES_KEY = 'skama-local-favorites';

function readLocalFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(LOCAL_FAVORITES_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function writeLocalFavorites(favorites: Set<string>): void {
  localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify([...favorites]));
}

export function SkamaProductCard({ product, compact = false }: ISkamaProductCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useWishlist();
  const [localFavorites, setLocalFavorites] = useState(() => readLocalFavorites());
  const [isAdding, setIsAdding] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const canUseBackendProduct = Boolean(product.backendProductId);
  const isFavorited = useMemo(() => {
    if (canUseBackendProduct && isAuthenticated) {
      return isFavorite(product.backendProductId!);
    }

    return localFavorites.has(product.id);
  }, [canUseBackendProduct, isAuthenticated, isFavorite, localFavorites, product.backendProductId, product.id]);

  async function handleAddToCart() {
    if (product.isLimitedEdition && !isAuthenticated) {
      toast.info('Inicia sesion para comprar piezas de edicion limitada.');
      navigate(ROUTES.login, { state: { from: ROUTES.catalog } });
      return;
    }

    setIsAdding(true);
    try {
      if (canUseBackendProduct && isAuthenticated) {
        await addItem(product.backendProductId!, 1);
      } else {
        addLocalCartItem(product, 1);
      }

      toast.success('Agregado al pedido.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No se pudo agregar al pedido.'));
    } finally {
      setIsAdding(false);
    }
  }

  async function handleToggleFavorite() {
    setIsToggling(true);
    try {
      if (canUseBackendProduct && isAuthenticated) {
        await toggleFavorite(product.backendProductId!);
      } else {
        const nextFavorites = new Set(localFavorites);
        if (nextFavorites.has(product.id)) {
          nextFavorites.delete(product.id);
        } else {
          nextFavorites.add(product.id);
        }

        writeLocalFavorites(nextFavorites);
        setLocalFavorites(nextFavorites);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No se pudo actualizar favoritos.'));
    } finally {
      setIsToggling(false);
    }
  }

  return (
    <article className={`sk-product-card${compact ? ' sk-product-card--compact' : ''}`}>
      <RouterLink
        className="sk-product-card__media"
        to={ROUTES.productDetail(product.id)}
        aria-label={`Ver detalle de ${product.name}`}
      >
        <img src={product.imageUrl} alt={product.imageAlt} loading="lazy" />
        {product.badge && (
          <span className={`sk-badge sk-badge--${product.badgeTone ?? 'accent'}`}>
            {product.badge}
          </span>
        )}
      </RouterLink>

      <button
        className="sk-icon-button sk-icon-button--sm sk-product-card__favorite"
        type="button"
        aria-label={isFavorited ? `Quitar ${product.name} de favoritos` : `Agregar ${product.name} a favoritos`}
        aria-pressed={isFavorited}
        disabled={isToggling}
        onClick={() => void handleToggleFavorite()}
      >
        {isFavorited ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
      </button>

      <div className="sk-product-card__body">
        <span className="sk-product-card__category">{product.collection}</span>
        <h3>
          <RouterLink to={ROUTES.productDetail(product.id)}>{product.name}</RouterLink>
        </h3>
        <span className="sk-product-card__description">{product.description}</span>
        <span className="sk-product-card__rating" aria-label={product.ratingLabel}>
          <span aria-hidden="true">*****</span>
          <span>{product.ratingLabel}</span>
        </span>
        <span className="sk-product-card__stock">
          Disponible: {product.stockQuantity} {product.stockQuantity === 1 ? 'unidad' : 'unidades'}
        </span>
        <strong className="sk-price">{formatPrice(product.price)}</strong>
        <button
          className={`sk-button ${product.isLimitedEdition && !isAuthenticated ? 'sk-button--secondary' : 'sk-button--primary'} sk-button--sm`}
          type="button"
          disabled={isAdding}
          onClick={() => void handleAddToCart()}
        >
          {isAdding ? 'Agregando...' : product.isLimitedEdition && !isAuthenticated ? 'Iniciar sesion para comprar' : 'Agregar'}
        </button>
      </div>
    </article>
  );
}
