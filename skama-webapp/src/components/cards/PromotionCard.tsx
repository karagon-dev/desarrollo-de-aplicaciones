import { Card } from './Card';
import { Chip } from '../feedback';
import { Text } from '../typography';
import { tokens, formatDisplayDate } from '../../utils';
import type { IPromotionDto } from '../../types';

export interface PromotionCardProps {
  promotion: IPromotionDto;
}

export function PromotionCard({ promotion }: PromotionCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${tokens.color.primarySoft} 0%, ${tokens.color.surface} 100%)`,
      }}
    >
      <Chip
        label={`-${promotion.discountPercentage}%`}
        chipVariant="primary"
        sx={{ mb: tokens.spacing.sm, alignSelf: 'flex-start' }}
      />
      <Text variant="h3" sx={{ mb: tokens.spacing.xs }}>
        {promotion.name}
      </Text>
      <Text variant="body" muted sx={{ mb: tokens.spacing.md }}>
        {promotion.description}
      </Text>
      <Text variant="caption" muted>
        Valid until {formatDisplayDate(promotion.endDate)}
      </Text>
    </Card>
  );
}
