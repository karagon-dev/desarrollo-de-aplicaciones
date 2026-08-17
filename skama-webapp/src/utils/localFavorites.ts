const LOCAL_FAVORITES_KEY = 'skama-local-favorites';

export const LOCAL_FAVORITES_UPDATED_EVENT = 'skama-local-favorites-updated';

function emitFavoritesUpdate(): void {
  window.dispatchEvent(new Event(LOCAL_FAVORITES_UPDATED_EVENT));
}

export function readLocalFavoriteIds(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_FAVORITES_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function readLocalFavorites(): Set<string> {
  return new Set(readLocalFavoriteIds());
}

export function writeLocalFavorites(favorites: Set<string>): void {
  localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify([...favorites]));
  emitFavoritesUpdate();
}

export function addLocalFavorite(productId: string): boolean {
  const favorites = readLocalFavorites();

  if (favorites.has(productId)) {
    return false;
  }

  favorites.add(productId);
  writeLocalFavorites(favorites);
  return true;
}

export function toggleLocalFavorite(productId: string): boolean {
  const favorites = readLocalFavorites();

  if (favorites.has(productId)) {
    favorites.delete(productId);
    writeLocalFavorites(favorites);
    return false;
  }

  favorites.add(productId);
  writeLocalFavorites(favorites);
  return true;
}
