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
    { value: '', label: 'All collections' },
    ...skamaSegments.map((segment) => ({ value: segment.id, label: segment.title })),
    ...categories.map((category) => ({ value: category.id, label: category.name })),
  ];

  return (
    <div className="sk-page">
      <section className="sk-collections-hero" aria-labelledby="collections-title">
        <div className="sk-container sk-collections-hero__content">
          <p className="sk-kicker">SKAMA collections</p>
          <h1 id="collections-title">Jewelry collections for memorable moments.</h1>
          <p>
            Each collection brings together pieces designed for a distinct presence:
            limited edition, green silver, silver, and gold.
          </p>
        </div>
      </section>

      <section className="sk-section" aria-labelledby="collections-heading">
        <div className="sk-container">
          <div className="sk-section-heading">
            <p className="sk-kicker">Catalog</p>
            <h2 id="collections-heading">Explore lines with their own identity.</h2>
            <p className="sk-lede">
              Searches and categories query the API when data is available; the catalog
              keeps the full local prototype for visual review and purchase flow.
            </p>
          </div>

          <div className="sk-filter-bar" aria-label="Catalog filters">
            <label className="sk-field" htmlFor="catalog-search">
              <span className="sk-field__label">Search products</span>
              <input
                className="sk-input"
                id="catalog-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Ring, bracelet, gold..."
              />
            </label>
            <label className="sk-field" htmlFor="catalog-collection">
              <span className="sk-field__label">Collection</span>
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
              <p className="sk-kicker">Limited edition</p>
              <h2 id="limited-title">Limited availability for exclusive pieces.</h2>
            </div>
            <div className="sk-limited-carousel">
              <img src={activeLimitedProduct.imageUrl} alt={activeLimitedProduct.imageAlt} />
              <div className="sk-limited-carousel__meta">
                <p className="sk-kicker">{activeLimitedProduct.categoryName}</p>
                <h3>{activeLimitedProduct.name}</h3>
                <p>{activeLimitedProduct.description}</p>
                <span>
                  Available: {activeLimitedProduct.stockQuantity}{' '}
                  {activeLimitedProduct.stockQuantity === 1 ? 'unit' : 'units'}
                </span>
                <SkamaProductCard product={activeLimitedProduct} compact />
                <div className="sk-actions" aria-label="Select limited edition piece">
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
            <p className="sk-kicker">{shouldUseApiProducts ? 'API products' : 'Visual collection'}</p>
            <h2 id="catalog-results-title">
              {flatProducts.length > 0 ? 'Available pieces' : 'No pieces for this selection.'}
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
              <h2>No results</h2>
              <p>Adjust the search or change the selected collection.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
