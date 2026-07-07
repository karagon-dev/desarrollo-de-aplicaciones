import Box from '@mui/material/Box';
import type { IReviewDto } from '../../types';
import { Card } from '../cards';
import { Text } from '../typography';
import { EmptyState } from '../feedback';
import { tokens } from '../../utils';

export interface ReviewListProps {
  reviews: IReviewDto[];
}

function renderStars(rating: number): string {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        title="Sin reseñas"
        description="Sé el primero en compartir tu experiencia con este producto."
      />
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
      {reviews.map((review) => (
        <Card key={review.id}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
            <Text
              variant="body"
              sx={{ color: tokens.color.warning, letterSpacing: '0.1em' }}
              aria-label={`Calificación: ${review.rating} de 5`}
            >
              {renderStars(review.rating)}
            </Text>
            {review.comment && <Text variant="body">{review.comment}</Text>}
            <Text variant="caption" muted>
              {new Date(review.createdAt).toLocaleDateString('es-CO')}
            </Text>
          </Box>
        </Card>
      ))}
    </Box>
  );
}
