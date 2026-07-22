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

      toast.success('Added to order.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not add to order.'));
    } finally {
      setIsAdding(false);
    }
  }

  async function handleToggleFavorite() {
    if (!displayProduct?.backendProductId || !isAuthenticated) {
      toast.info('Sign in to sync your favorites.');
      navigate(ROUTES.login, { state: { from: productId ? ROUTES.productDetail(productId) : ROUTES.catalog } });
      return;
    }

    setIsTogglingFavorite(true);
    try {
      await toggleFavorite(displayProduct.backendProductId);
      toast.success('Favorites updated.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not update favorites.'));
    } finally {
      setIsTogglingFavorite(false);
    }
  }

  if (loading && !displayProduct) {
    return (
      <div className="sk-container sk-section">
        <div className="sk-empty-state">
          <h1>Loading product...</h1>
        </div>
      </div>
    );
  }

  if (!displayProduct) {
    return (
      <div className="sk-container sk-section">
        <div className="sk-empty-state">
          <p className="sk-kicker">Product unavailable</p>
          <h1>We could not find this piece.</h1>
          <RouterLink className="sk-button sk-button--primary" to={ROUTES.catalog}>
            Back to collections
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
              <span>Available</span>
            </div>
            <div className="sk-stat">
              <strong>{displayProduct.ratingLabel}</strong>
              <span>Rating</span>
            </div>
            <div className="sk-stat">
              <strong>{displayProduct.material}</strong>
              <span>Material</span>
            </div>
            <div className="sk-stat">
              <strong>{displayProduct.categoryName}</strong>
              <span>Type</span>
            </div>
          </div>
          <ul className="sk-detail-list">
            <li>Design inspired by Costa Rican nature.</li>
            <li>Polished finishes for an elegant and timeless presence.</li>
            <li>Purchase coordinated by WhatsApp with validated delivery details.</li>
          </ul>
          <div className="sk-actions">
            <button
              className="sk-button sk-button--primary sk-button--lg"
              type="button"
              disabled={isAdding}
              onClick={() => void handleAddToCart()}
            >
              <ShoppingBagOutlinedIcon fontSize="small" />
              {isAdding ? 'Adding...' : 'Add to order'}
            </button>
            <button
              className="sk-button sk-button--secondary sk-button--lg"
              type="button"
              disabled={isTogglingFavorite}
              onClick={() => void handleToggleFavorite()}
            >
              <FavoriteBorderIcon fontSize="small" />
              Favorites
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}
