import { useMemo, useState } from 'react';

import { SkamaProductCard } from '../../components/skama/SkamaProductCard';
import {
  limitedProducts,
  mapApiProductToSkamaProduct,
  skamaProducts,
  skamaSegments,
} from '../../data/skamaCatalog';
import { useCategories, useDebouncedValue, useProductMainImages, useProducts } from '../../hooks';

export function CatalogPage() {
  const [search, setSearch] = useState('');
  const [collection, setCollection] = useState('');
  const [activeLimitedIndex, setActiveLimitedIndex] = useState(0);
  const debouncedSearch = useDebouncedValue(search);
  const { categories } = useCategories();
  const categoryFromApi = categories.find((category) => category.id === collection);

  const filters = useMemo(
    () => ({
      search: debouncedSearch.trim() || undefined,
      categoryId: categoryFromApi?.id,
      includeInactive: false,
    }),
    [categoryFromApi?.id, debouncedSearch],
  );

  const { products } = useProducts(filters);
  const imageMap = useProductMainImages(products.map((product) => product.id));
  const activeLimitedProduct = limitedProducts[activeLimitedIndex];

  const apiProducts = useMemo(
    () => products.map((product, index) => mapApiProductToSkamaProduct(product, imageMap[product.id], index)),
    [imageMap, products],
  );

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

  const visibleApiProducts = categoryFromApi || products.length > 0 ? apiProducts : [];
  const shouldUseApiProducts = visibleApiProducts.length > 0;
  const flatProducts = shouldUseApiProducts ? visibleApiProducts : staticProducts;

  const collectionOptions = [
    { value: '', label: 'Todas las colecciones' },
    ...skamaSegments.map((segment) => ({ value: segment.id, label: segment.title })),
    ...categories.map((category) => ({ value: category.id, label: category.name })),
  ];

  return (
    <div className="sk-page">
      <section className="sk-collections-hero" aria-labelledby="collections-title">
        <div className="sk-container sk-collections-hero__content">
          <p className="sk-kicker">Colecciones SKAMA</p>
          <h1 id="collections-title">Colecciones de joyeria para momentos memorables.</h1>
          <p>
            Cada coleccion reune piezas pensadas para una forma distinta de presencia: edicion
            limitada, plata verde, plata y oro.
          </p>
        </div>
      </section>

      <section className="sk-section" aria-labelledby="collections-heading">
        <div className="sk-container">
          <div className="sk-section-heading">
            <p className="sk-kicker">Catalogo</p>
            <h2 id="collections-heading">Explora lineas con identidad propia.</h2>
            <p className="sk-lede">
              Las busquedas y categorias consultan el API cuando hay datos disponibles; el catalogo
              local mantiene el prototipo completo para revision visual y flujo de compra.
            </p>
          </div>

          <div className="sk-filter-bar" aria-label="Filtros de catalogo">
            <label className="sk-field" htmlFor="catalog-search">
              <span className="sk-field__label">Buscar productos</span>
              <input
                className="sk-input"
                id="catalog-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Anillo, pulsera, oro..."
              />
            </label>
            <label className="sk-field" htmlFor="catalog-collection">
              <span className="sk-field__label">Coleccion</span>
              <select
                className="sk-input sk-select"
                id="catalog-collection"
                value={collection}
                onChange={(event) => setCollection(event.target.value)}
              >
                {collectionOptions.map((option) => (
                  <option key={option.value || 'all'} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      {!shouldUseApiProducts && collection === '' && (
        <section className="sk-section sk-section--muted" aria-labelledby="limited-title">
          <div className="sk-container">
            <div className="sk-section-heading">
              <p className="sk-kicker">Edicion limitada</p>
              <h2 id="limited-title">Disponibilidad reducida para piezas exclusivas.</h2>
            </div>
            <div className="sk-limited-carousel">
              <img src={activeLimitedProduct.imageUrl} alt={activeLimitedProduct.imageAlt} />
              <div className="sk-limited-carousel__meta">
                <p className="sk-kicker">{activeLimitedProduct.categoryName}</p>
                <h3>{activeLimitedProduct.name}</h3>
                <p>{activeLimitedProduct.description}</p>
                <span>
                  Disponible: {activeLimitedProduct.stockQuantity}{' '}
                  {activeLimitedProduct.stockQuantity === 1 ? 'unidad' : 'unidades'}
                </span>
                <SkamaProductCard product={activeLimitedProduct} compact />
                <div className="sk-actions" aria-label="Seleccionar pieza de edicion limitada">
                  {limitedProducts.map((product, index) => (
                    <button
                      className="sk-chip"
                      key={product.id}
                      type="button"
                      aria-current={index === activeLimitedIndex}
                      onClick={() => setActiveLimitedIndex(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="sk-section" aria-labelledby="catalog-results-title">
        <div className="sk-container">
          <div className="sk-section-heading">
            <p className="sk-kicker">{shouldUseApiProducts ? 'Productos del API' : 'Coleccion visual'}</p>
            <h2 id="catalog-results-title">
              {flatProducts.length > 0 ? 'Piezas disponibles' : 'No hay piezas para esta seleccion.'}
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
              <h2>No hay resultados</h2>
              <p>Ajusta la busqueda o cambia la coleccion seleccionada.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
