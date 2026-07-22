import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Card } from './Card';
import { Button } from '../buttons';
import { useAuth, useCart, useWishlist } from '../../hooks';
import { getApiErrorMessage, formatPrice, tokens } from '../../utils';
import { ROUTES } from '../../routes/routePaths';

export interface ProductCardProps {
  id: string;
  name: string;
  categoryName?: string;
  price: number;
  imageUrl?: string;
  isFavorite?: boolean;
}

export function ProductCard({
  id,
  name,
  categoryName,
  price,
  imageUrl,
  isFavorite: isFavoriteProp,
}: ProductCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const favorited = isFavoriteProp ?? isFavorite(id);

  async function handleAddToCart() {
    if (!isAuthenticated) {
      navigate(ROUTES.login, { state: { from: ROUTES.catalog } });
      return;
    }

    setIsAdding(true);
    try {
      await addItem(id, 1);
      toast.success('Added to cart.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not add to cart.'));
    } finally {
      setIsAdding(false);
    }
  }

  async function handleToggleFavorite() {
    if (!isAuthenticated) {
      navigate(ROUTES.login, { state: { from: ROUTES.catalog } });
      return;
    }

    setIsToggling(true);
    try {
      await toggleFavorite(id);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not update favorites.'));
    } finally {
      setIsToggling(false);
    }
  }

  return (
    <Card
      padding={false}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        '&:hover': {
          boxShadow: tokens.shadow.md,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box
        component={RouterLink}
        to={ROUTES.productDetail(id)}
        sx={{
          display: 'block',
          aspectRatio: '4/3',
          backgroundColor: tokens.color.surfaceSecondary,
          textDecoration: 'none',
        }}
      >
        {imageUrl ? (
          <Box
            component="img"
            src={imageUrl}
            alt={name}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: tokens.color.muted,
              fontSize: '0.875rem',
            }}
          >
            No image
          </Box>
        )}
      </Box>

      <Box sx={{ p: tokens.spacing.md, flex: 1, display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
        {categoryName && (
          <Typography variant="caption" sx={{ color: tokens.color.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {categoryName}
          </Typography>
        )}
        <Typography
          component={RouterLink}
          to={ROUTES.productDetail(id)}
          variant="h6"
          sx={{
            color: tokens.color.textPrimary,
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            '&:hover': { color: tokens.color.primary },
          }}
        >
          {name}
        </Typography>
        <Typography variant="body1" sx={{ color: tokens.color.primary, fontWeight: 700, mt: 'auto' }}>
          {formatPrice(price)}
        </Typography>
        <Box sx={{ display: 'flex', gap: tokens.spacing.sm, mt: tokens.spacing.sm }}>
          <Button size="sm" onClick={() => void handleAddToCart()} disabled={isAdding} sx={{ flex: 1 }}>
            {isAdding ? '...' : 'Add'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            disabled={isToggling}
            onClick={() => void handleToggleFavorite()}
          >
            {favorited ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
