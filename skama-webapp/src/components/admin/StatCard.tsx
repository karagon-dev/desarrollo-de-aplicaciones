import type { KeyboardEvent, ReactNode } from 'react';
import NorthEastOutlinedIcon from '@mui/icons-material/NorthEastOutlined';
import { Card } from '../cards';
import { Text } from '../typography';
import { tokens } from '../../utils';

export type StatCardTone = 'primary' | 'accent' | 'warning' | 'danger';

export interface StatCardProps {
  label: string;
  value: string;
  helperText?: string;
  icon?: ReactNode;
  tone?: StatCardTone;
  sparkline?: number[];
  onClick?: () => void;
}

function Sparkline({ values, tone }: { values: number[]; tone: StatCardTone }) {
  if (values.length < 2) {
    return null;
  }

  const width = 88;
  const height = 28;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg className={`sk-stat-card__spark sk-stat-card__spark--${tone}`} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" points={points} />
    </svg>
  );
}

export function StatCard({
  label,
  value,
  helperText,
  icon,
  tone = 'primary',
  sparkline,
  onClick,
}: StatCardProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!onClick || (event.key !== 'Enter' && event.key !== ' ')) {
      return;
    }

    event.preventDefault();
    onClick();
  }

  return (
    <Card
      className={`sk-stat-card sk-stat-card--${tone}${onClick ? ' sk-stat-card--interactive' : ''}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        '&:focus-visible': onClick
          ? {
              outline: `2px solid ${tokens.color.primary}`,
              outlineOffset: 2,
            }
          : undefined,
      }}
    >
      <div className="sk-stat-card__top">
        {icon && <span className="sk-stat-card__icon">{icon}</span>}
        {sparkline && sparkline.length > 1 ? <Sparkline values={sparkline} tone={tone} /> : null}
      </div>
      <Text variant="small" muted className="sk-stat-card__label">
        {label}
      </Text>
      <Text variant="h2" className="sk-stat-card__value">
        {value}
      </Text>
      {helperText && (
        <Text variant="small" muted className="sk-stat-card__helper">
          {onClick ? <NorthEastOutlinedIcon fontSize="inherit" /> : null}
          {helperText}
        </Text>
      )}
    </Card>
  );
}
