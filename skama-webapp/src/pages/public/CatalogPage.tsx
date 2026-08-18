import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

import { SkamaProductCard } from '../../components/skama/SkamaProductCard';
import { SkamaPrice } from '../../components/skama/SkamaPrice';
import {
  SILVER_ANNIVERSARY_PROMO_TEXT,
  limitedProducts,
  mapApiProductToSkamaProduct,
  skamaProducts,
  skamaSegments,
  type ISkamaProduct,
} from '../../data/skamaCatalog';
import { useAuth, useCart, useProductMainImages, useProducts } from '../../hooks';
import { ROUTES } from '../../routes/routePaths';
import { addLocalCartItem, formatPrice, getApiErrorMessage, hasLocalLimitedEditionCartItem } from '../../utils';

const segmentMaterialNames: Record<string, string> = {
  'green-silver': 'plata verde',
  silver: 'plata',
  gold: 'oro',
};

function normalizeCollectionName(value: string): string {
  return value.trim().toLowerCase();
}

export function CatalogPage() {
  const navigate = useNavigate();
  const collection = '';
  const debouncedSearch = '';
  const [activeLimitedIndex, setActiveLimitedIndex] = useState(0);
  const [activeSilverPromoIndex, setActiveSilverPromoIndex] = useState(0);
  const [selectedLimitedProduct, setSelectedLimitedProduct] = useState<ISkamaProduct | null>(null);
  const [addingLimitedProductId, setAddingLimitedProductId] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const filters = useMemo(() => ({ includeInactive: false }), []);

  const { products, error: productsError } = useProducts(filters);
  const imageMap = useProductMainImages(products.map((product) => product.id));
  const shouldUseApiProducts = !productsError;

  const apiProducts = useMemo(
    () => products.map((product, index) => mapApiProductToSkamaProduct(product, imageMap[product.id], index)),
    [imageMap, products],
  );
  const apiLimitedProducts = useMemo(
    () => apiProducts.filter((product) => product.isLimitedEdition),
    [apiProducts],
  );
  const limitedDisplayProducts = shouldUseApiProducts ? apiLimitedProducts : limitedProducts;
  const activeLimitedProduct =
    limitedDisplayProducts.length > 0
      ? limitedDisplayProducts[activeLimitedIndex % limitedDisplayProducts.length]
      : undefined;

  const staticProducts = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase();
    return skamaProducts.filter((product) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        `${product.name} ${product.collection} ${product.categoryName} ${product.description}`
          .toLowerCase()
          .includes(normalizedSearch);
      const matchesCollection =
        collection.length === 0 ||
        product.collection.toLowerCase().replace(/\s+/g, '-') === collection ||
        product.material.toLowerCase().replace(/\s+/g, '-') === collection;

      return matchesSearch && matchesCollection;
    });
  }, [collection, debouncedSearch]);

  const visibleApiProducts = shouldUseApiProducts ? apiProducts : [];
  const apiCollectionSegments = useMemo(
    () =>
      skamaSegments
        .map((segment) => {
          const materialName = segmentMaterialNames[segment.id];

          return {
            ...segment,
            products: apiProducts.filter(
              (product) =>
                !product.isLimitedEdition &&
                normalizeCollectionName(product.material) === materialName,
            ),
          };
        })
        .filter((segment) => segment.products.length > 0),
    [apiProducts],
  );
  const collectionSegments = shouldUseApiProducts ? apiCollectionSegments : skamaSegments;
  const isStaticCollectionFilter =
    collection === '' || collectionSegments.some((segment) => segment.id === collection);
  const visibleStaticSegments = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase();

    return collectionSegments
      .filter((segment) => collection === '' || segment.id === collection)
      .map((segment) => ({
        ...segment,
        products: segment.products.filter((product) => {
          if (normalizedSearch.length === 0) {
            return true;
          }

          return `${product.name} ${product.collection} ${product.categoryName} ${product.description}`
            .toLowerCase()
            .includes(normalizedSearch);
        }),
      }))
      .filter((segment) => segment.products.length > 0);
  }, [collection, collectionSegments, debouncedSearch]);
  const silverPromoProducts = useMemo(
    () => visibleStaticSegments.find((segment) => segment.id === 'silver')?.products ?? [],
    [visibleStaticSegments],
  );
  const activeSilverPromoProduct =
    silverPromoProducts.length > 0
      ? silverPromoProducts[activeSilverPromoIndex % silverPromoProducts.length]
      : undefined;
  const flatProducts = isStaticCollectionFilter ? [] : shouldUseApiProducts ? visibleApiProducts : staticProducts;

  useEffect(() => {
    if (collection !== '' || selectedLimitedProduct) {
      return undefined;
    }

    if (limitedDisplayProducts.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveLimitedIndex((currentIndex) => (currentIndex + 1) % limitedDisplayProducts.length);
    }, 3600);

    return () => window.clearInterval(intervalId);
  }, [collection, limitedDisplayProducts.length, selectedLimitedProduct]);

  useEffect(() => {
    setActiveSilverPromoIndex(0);
  }, [collection, debouncedSearch]);

  useEffect(() => {
    if (silverPromoProducts.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveSilverPromoIndex((currentIndex) => (currentIndex + 1) % silverPromoProducts.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, [silverPromoProducts.length]);

  useEffect(() => {
    if (!selectedLimitedProduct) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSelectedLimitedProduct(null);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLimitedProduct]);

  async function handleLimitedPurchase(product: ISkamaProduct) {
    if (!isAuthenticated) {
      toast.info('Inicia sesión para comprar piezas de edición limitada.');
      navigate(ROUTES.login, { state: { from: ROUTES.catalog } });
      return;
    }

    if (hasLocalLimitedEditionCartItem()) {
      toast.info('Solo puedes comprar 1 joya de edición limitada por cuenta.');
      return;
    }

    setAddingLimitedProductId(product.id);
    try {
      if (product.backendProductId) {
        await addItem(product.backendProductId, 1);
      } else {
        addLocalCartItem(product, 1);
      }

      toast.success('Agregado a la orden.');
      setSelectedLimitedProduct(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No se pudo agregar a la orden.'));
    } finally {
      setAddingLimitedProductId(null);
    }
  }

  return (
    <div className="sk-page">
      <section className="sk-collections-hero" aria-labelledby="collections-title">
        <div className="sk-container sk-collections-hero__content">
          <p className="sk-kicker">Colecciones SKAMA</p>
          <h1 id="collections-title">Colecciones de joyería para momentos memorables.</h1>
          <p>
            Cada colección reúne piezas pensadas para una forma distinta de presencia: edición limitada,
            plata verde, plata y oro. La selección mantiene una lectura clara para que cada joya tenga su
            propio lugar.
          </p>
          <p>
            Explora líneas con acentos verdes, plata pulida y oro cálido, además de una edición limitada
            que requiere cuenta para gestionar compras exclusivas con mayor información del cliente.
          </p>
        </div>
      </section>

      {collection === '' && activeLimitedProduct && (
        <section className="sk-section sk-limited-section" aria-labelledby="limited-title">
          <div className="sk-container">
            <div className="sk-section-heading sk-limited-section__heading">
              <p className="sk-kicker">Edición limitada</p>
              <h2 id="limited-title">Edición limitada</h2>
              <p className="sk-lede">
                Piezas exclusivas con disponibilidad reducida. Para comprar una joya de esta línea
                se solicita iniciar sesión o crear una cuenta SKAMA.
              </p>
            </div>

            <article className="sk-limited-carousel">
              <div className="sk-limited-carousel__media">
                <button
                  className="sk-limited-carousel__image-button"
                  type="button"
                  onClick={() => setSelectedLimitedProduct(activeLimitedProduct)}
                  aria-label={`Ver detalle de ${activeLimitedProduct.name}`}
                >
                  <img
                    key={activeLimitedProduct.id}
                    src={activeLimitedProduct.imageUrl}
                    alt={activeLimitedProduct.imageAlt}
                  />
                </button>
                <div className="sk-limited-carousel__dots" aria-label="Seleccionar joya de edición limitada">
                  {limitedDisplayProducts.map((product, index) => (
                    <button
                      className="sk-limited-carousel__dot"
                      key={product.id}
                      type="button"
                      aria-label={`Mostrar ${product.name}`}
                      aria-current={index === activeLimitedIndex % limitedDisplayProducts.length}
                      onClick={() => setActiveLimitedIndex(index)}
                    />
                  ))}
                </div>
              </div>

              <div className="sk-limited-carousel__meta">
                <p className="sk-kicker">{activeLimitedProduct.categoryName}</p>
                <h3>
                  <button type="button" onClick={() => setSelectedLimitedProduct(activeLimitedProduct)}>
                    {activeLimitedProduct.name}
                  </button>
                </h3>
                <p>{activeLimitedProduct.description}</p>
                <span>
                  Disponible: {activeLimitedProduct.stockQuantity}{' '}
                  {activeLimitedProduct.stockQuantity === 1 ? 'unidad' : 'unidades'}
                </span>
                <strong className="sk-price">{formatPrice(activeLimitedProduct.price)}</strong>
              </div>
            </article>
          </div>
        </section>
      )}

      {isStaticCollectionFilter ? (
        visibleStaticSegments.length > 0 ? (
          <div className="sk-regular-collections" aria-label="Colecciones regulares">
            {visibleStaticSegments.map((segment) => (
              <section className="sk-section sk-regular-section" key={segment.id} aria-labelledby={`${segment.id}-title`}>
                <div className="sk-container">
                  <div className="sk-section-heading sk-regular-section__heading">
                    <p className="sk-kicker">{segment.kicker}</p>
                    <h2 id={`${segment.id}-title`}>{segment.title}</h2>
                    <p className="sk-lede">{segment.description}</p>
                  </div>

                  {segment.id === 'silver' && activeSilverPromoProduct && (
                    <article className="sk-anniversary-carousel" aria-label="Promoción de aniversario en joyas de plata">
                      <div className="sk-anniversary-carousel__media">
                        <button
                          className="sk-anniversary-carousel__image-button"
                          type="button"
                          aria-label={`Ver detalle de ${activeSilverPromoProduct.name}`}
                          onClick={() => navigate(ROUTES.productDetail(activeSilverPromoProduct.id))}
                        >
                          <img
                            key={activeSilverPromoProduct.id}
                            src={activeSilverPromoProduct.imageUrl}
                            alt={activeSilverPromoProduct.imageAlt}
                          />
                          <span className="sk-anniversary-carousel__overlay">
                            <span>Promoción de aniversario</span>
                            <strong>{SILVER_ANNIVERSARY_PROMO_TEXT}</strong>
                          </span>
                        </button>
                        <div className="sk-anniversary-carousel__dots" aria-label="Seleccionar joya de plata en promoción">
                          {silverPromoProducts.map((product, index) => (
                            <button
                              className="sk-anniversary-carousel__dot"
                              key={product.id}
                              type="button"
                              aria-label={`Mostrar ${product.name}`}
                              aria-current={index === activeSilverPromoIndex % silverPromoProducts.length}
                              onClick={() => setActiveSilverPromoIndex(index)}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="sk-anniversary-carousel__meta">
                        <p className="sk-kicker">Aniversario SKAMA</p>
                        <h3>{activeSilverPromoProduct.name}</h3>
                        <p>{activeSilverPromoProduct.description}</p>
                        <SkamaPrice
                          price={activeSilverPromoProduct.price}
                          originalPrice={activeSilverPromoProduct.originalPrice}
                          discountPercentage={activeSilverPromoProduct.discountPercentage}
                        />
                      </div>
                    </article>
                  )}
                </div>

                <div className="sk-product-grid">
                  {segment.products.map((product) => (
                    <SkamaProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <section className="sk-section" aria-labelledby="catalog-results-title">
            <div className="sk-container">
              <div className="sk-empty-state">
                <p className="sk-kicker">Colección visual</p>
                <h2 id="catalog-results-title">Sin resultados</h2>
                <p>Ajusta la búsqueda o cambia la colección seleccionada.</p>
              </div>
            </div>
          </section>
        )
      ) : (
        <section className="sk-section" aria-labelledby="catalog-results-title">
          <div className="sk-container">
            <div className="sk-section-heading">
              <p className="sk-kicker">{shouldUseApiProducts ? 'Productos de la API' : 'Colección visual'}</p>
              <h2 id="catalog-results-title">
                {flatProducts.length > 0 ? 'Piezas disponibles' : 'No hay piezas para esta selección.'}
              </h2>
            </div>
          </div>

          {flatProducts.length > 0 ? (
            <div className="sk-product-grid">
              {flatProducts.map((product) => (
                <SkamaProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="sk-container">
              <div className="sk-empty-state">
                <h2>Sin resultados</h2>
                <p>Ajusta la búsqueda o cambia la colección seleccionada.</p>
              </div>
            </div>
          )}
        </section>
      )}

      {selectedLimitedProduct && (
        <div
          className="sk-limited-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="limited-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedLimitedProduct(null);
            }
          }}
        >
          <article className="sk-limited-modal__panel">
            <button
              className="sk-icon-button sk-icon-button--sm sk-limited-modal__close"
              type="button"
              aria-label="Cerrar detalle"
              onClick={() => setSelectedLimitedProduct(null)}
            >
              <CloseIcon fontSize="small" />
            </button>

            <figure className="sk-limited-modal__media">
              <img src={selectedLimitedProduct.imageUrl} alt={selectedLimitedProduct.imageAlt} />
            </figure>

            <div className="sk-limited-modal__copy">
              <div>
                <p className="sk-kicker">{selectedLimitedProduct.categoryName}</p>
                <h2 id="limited-modal-title">{selectedLimitedProduct.name}</h2>
              </div>
              <strong className="sk-price">{formatPrice(selectedLimitedProduct.price)}</strong>
              <div className="sk-limited-modal__meta">
                <span>
                  Disponible: {selectedLimitedProduct.stockQuantity}{' '}
                  {selectedLimitedProduct.stockQuantity === 1 ? 'unidad' : 'unidades'}.
                </span>
                <span>Límite de compra: 1 joya limitada por persona.</span>
              </div>
              <p>{selectedLimitedProduct.description}</p>
              <button
                className="sk-button sk-button--primary sk-button--lg"
                type="button"
                disabled={addingLimitedProductId === selectedLimitedProduct.id}
                onClick={() => void handleLimitedPurchase(selectedLimitedProduct)}
              >
                <ShoppingBagOutlinedIcon fontSize="small" />
                {addingLimitedProductId === selectedLimitedProduct.id
                  ? 'Agregando...'
                  : isAuthenticated
                    ? 'Agregar a la orden'
                    : 'Iniciar sesión para comprar'}
              </button>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
