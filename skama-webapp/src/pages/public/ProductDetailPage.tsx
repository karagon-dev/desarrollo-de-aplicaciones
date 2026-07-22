import { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

import { findSkamaProduct, mapApiProductToSkamaProduct } from '../../data/skamaCatalog';
import { useAuth, useCart, useProduct, useWishlist } from '../../hooks';
import { ROUTES } from '../../routes/routePaths';
import { addLocalCartItem, formatPrice, getApiErrorMessage, resolveAssetUrl } from '../../utils';

export function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const localProduct = findSkamaProduct(productId);
  const { product, images, loading } = useProduct(localProduct ? undefined : productId);
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { toggleFavorite } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const apiImage = useMemo(() => {
    const mainImage = images.find((image) => image.isMain) ?? images[0];
    return resolveAssetUrl(mainImage?.imageUrl);
  }, [images]);

  const displayProduct = useMemo(() => {
    if (localProduct) {
      return localProduct;
    }

    return product ? mapApiProductToSkamaProduct(product, apiImage) : undefined;
  }, [apiImage, localProduct, product]);

  async function handleAddToCart() {
    if (!displayProduct) {
      return;
    }

    if (displayProduct.isLimitedEdition && !isAuthenticated) {
      navigate(ROUTES.login, { state: { from: ROUTES.productDetail(displayProduct.id) } });
      return;
    }

    setIsAdding(true);
    try {
      if (displayProduct.backendProductId && isAuthenticated) {
        await addItem(displayProduct.backendProductId, 1);
      } else {
        addLocalCartItem(displayProduct, 1);
      }

      toast.success('Agregado al pedido.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No se pudo agregar al pedido.'));
    } finally {
      setIsAdding(false);
    }
  }

  async function handleToggleFavorite() {
    if (!displayProduct?.backendProductId || !isAuthenticated) {
      toast.info('Inicia sesion para sincronizar tus favoritos.');
      navigate(ROUTES.login, { state: { from: productId ? ROUTES.productDetail(productId) : ROUTES.catalog } });
      return;
    }

    setIsTogglingFavorite(true);
    try {
      await toggleFavorite(displayProduct.backendProductId);
      toast.success('Favoritos actualizados.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No se pudo actualizar favoritos.'));
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
          <h1>No encontramos esta pieza.</h1>
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
          <strong className="sk-price">{formatPrice(displayProduct.price)}</strong>
          <p className="sk-lede">{displayProduct.description}</p>
          <div className="sk-stat-grid">
            <div className="sk-stat">
              <strong>{displayProduct.stockQuantity}</strong>
              <span>Disponibles</span>
            </div>
            <div className="sk-stat">
              <strong>{displayProduct.ratingLabel}</strong>
              <span>Valoracion</span>
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
            <li>Diseno inspirado en la naturaleza costarricense.</li>
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
              {isAdding ? 'Agregando...' : 'Agregar al pedido'}
            </button>
            <button
              className="sk-button sk-button--secondary sk-button--lg"
              type="button"
              disabled={isTogglingFavorite}
              onClick={() => void handleToggleFavorite()}
            >
              <FavoriteBorderIcon fontSize="small" />
              Favoritos
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}
