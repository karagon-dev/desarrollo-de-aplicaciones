import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

import { findSkamaProduct, mapApiProductToSkamaProduct } from '../../data/skamaCatalog';
import { SkamaPrice } from '../../components/skama/SkamaPrice';
import { useAuth, useCart, useProduct, useWishlist } from '../../hooks';
import { ROUTES } from '../../routes/routePaths';
import {
  LOCAL_FAVORITES_UPDATED_EVENT,
  addLocalCartItem,
  addLocalFavorite,
  getApiErrorMessage,
  hasLocalLimitedEditionCartItem,
  readLocalFavorites,
  resolveAssetUrl,
} from '../../utils';

export function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const localProduct = findSkamaProduct(productId);
  const { product, images, loading } = useProduct(localProduct ? undefined : productId);
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { addFavorite, isFavorite } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [localFavorites, setLocalFavorites] = useState(() => readLocalFavorites());

  const apiImage = useMemo(() => {
    const mainImage = images.find((image) => image.isMain) ?? images[0];
    return resolveAssetUrl(mainImage?.imageUrl);
  }, [images]);

  const displayProduct = useMemo(() => {
    if (localProduct) {
      return localProduct;
    }

    if (!product || !product.isActive || product.stockQuantity <= 0) {
      return undefined;
    }

    return mapApiProductToSkamaProduct(product, apiImage);
  }, [apiImage, localProduct, product]);

  const isDetailFavorite = useMemo(() => {
    if (!displayProduct) {
      return false;
    }

    if (displayProduct.backendProductId && isAuthenticated) {
      return isFavorite(displayProduct.backendProductId);
    }

    return localFavorites.has(displayProduct.id);
  }, [displayProduct, isAuthenticated, isFavorite, localFavorites]);

  useEffect(() => {
    function syncLocalFavorites() {
      setLocalFavorites(readLocalFavorites());
    }

    window.addEventListener(LOCAL_FAVORITES_UPDATED_EVENT, syncLocalFavorites);
    window.addEventListener('storage', syncLocalFavorites);
    return () => {
      window.removeEventListener(LOCAL_FAVORITES_UPDATED_EVENT, syncLocalFavorites);
      window.removeEventListener('storage', syncLocalFavorites);
    };
  }, []);

  async function handleAddToCart() {
    if (!displayProduct) {
      return;
    }

    if (displayProduct.isLimitedEdition && !isAuthenticated) {
      toast.info('Inicia sesión para comprar piezas de edición limitada.');
      navigate(ROUTES.login, { state: { from: ROUTES.productDetail(displayProduct.id) } });
      return;
    }

    if (displayProduct.isLimitedEdition && hasLocalLimitedEditionCartItem()) {
      toast.info('Solo puedes comprar 1 joya de edición limitada por cuenta.');
      return;
    }

    setIsAdding(true);
    try {
      if (displayProduct.backendProductId && isAuthenticated) {
        await addItem(displayProduct.backendProductId, 1);
      } else {
        addLocalCartItem(displayProduct, 1);
      }

      toast.success('Agregado a la orden.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No se pudo agregar a la orden.'));
    } finally {
      setIsAdding(false);
    }
  }

  async function handleAddFavorite() {
    if (!displayProduct) {
      return;
    }

    setIsTogglingFavorite(true);
    try {
      if (displayProduct.backendProductId && isAuthenticated) {
        const wasAdded = await addFavorite(displayProduct.backendProductId);
        toast[wasAdded ? 'success' : 'info'](
          wasAdded ? 'Joya almacenada en favoritos.' : 'Esta joya ya está en favoritos.',
        );
        return;
      }

      const wasAdded = addLocalFavorite(displayProduct.id);
      setLocalFavorites(readLocalFavorites());
      toast[wasAdded ? 'success' : 'info'](
        wasAdded ? 'Joya almacenada en favoritos.' : 'Esta joya ya está en favoritos.',
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No se pudieron actualizar los favoritos.'));
    } finally {
      setIsTogglingFavorite(false);
    }
  }

  if (loading && !displayProduct) {
    return (
      <div className="sk-container sk-section">
        <div className="sk-empty-state">
          <h1>Cargando producto...</h1>
        </div>
      </div>
    );
  }

  if (!displayProduct) {
    return (
      <div className="sk-container sk-section">
        <div className="sk-empty-state">
          <p className="sk-kicker">Producto no disponible</p>
          <h1>No pudimos encontrar esta pieza.</h1>
          <RouterLink className="sk-button sk-button--primary" to={ROUTES.catalog}>
            Volver a colecciones
          </RouterLink>
        </div>
      </div>
    );
  }

  return (
    <div className="sk-page">
      <section className="sk-detail-shell" aria-labelledby="product-detail-title">
        <div className="sk-detail-gallery">
          <div className="sk-detail-gallery__main">
            <img src={displayProduct.imageUrl} alt={displayProduct.imageAlt} />
          </div>
        </div>

        <article className="sk-detail-copy">
          <div>
            <p className="sk-kicker">{displayProduct.collection}</p>
            <h1 id="product-detail-title">{displayProduct.name}</h1>
          </div>
          <SkamaPrice
            price={displayProduct.price}
            originalPrice={displayProduct.originalPrice}
            discountPercentage={displayProduct.discountPercentage}
          />
          <p className="sk-lede">{displayProduct.description}</p>
          <div className="sk-stat-grid">
            <div className="sk-stat">
              <strong>{displayProduct.stockQuantity}</strong>
              <span>Disponible</span>
            </div>
            <div className="sk-stat">
              <strong>{displayProduct.ratingLabel}</strong>
              <span>Calificación</span>
            </div>
            <div className="sk-stat">
              <strong>{displayProduct.material}</strong>
              <span>Material</span>
            </div>
            <div className="sk-stat">
              <strong>{displayProduct.categoryName}</strong>
              <span>Tipo</span>
            </div>
          </div>
          <ul className="sk-detail-list">
            <li>Diseño inspirado en la naturaleza costarricense.</li>
            <li>Acabados pulidos para una presencia elegante y atemporal.</li>
            <li>Compra coordinada por WhatsApp con datos de entrega validados.</li>
          </ul>
          <div className="sk-actions">
            <button
              className="sk-button sk-button--primary sk-button--lg"
              type="button"
              disabled={isAdding}
              onClick={() => void handleAddToCart()}
            >
              <ShoppingBagOutlinedIcon fontSize="small" />
              {isAdding
                ? 'Agregando...'
                : displayProduct.isLimitedEdition && !isAuthenticated
                  ? 'Iniciar sesión para comprar'
                  : 'Agregar a la orden'}
            </button>
            <button
              className="sk-button sk-button--secondary sk-button--lg"
              type="button"
              disabled={isTogglingFavorite}
              onClick={() => void handleAddFavorite()}
            >
              {isDetailFavorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
              {isTogglingFavorite
                ? 'Guardando...'
                : isDetailFavorite
                  ? 'Ya está en favoritos'
                  : 'Agregar a favoritos'}
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}
