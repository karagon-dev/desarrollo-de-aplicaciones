import { Card } from '../cards';
import { Text } from '../typography';
import { tokens } from '../../utils';

export interface StatCardProps {
  label: string;
  value: string;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <Card>
      <Text variant="small" muted>
        {label}
      </Text>
      <Text variant="h2" sx={{ color: tokens.color.primary, mt: tokens.spacing.sm }}>
        {value}
      </Text>
    </Card>
  );
}
