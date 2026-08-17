import { useMemo, useState } from 'react';
import type { ISalesByPeriodDto } from '../../types';
import { formatPrice } from '../../utils';

interface IChartPoint {
  date: string;
  total: number;
  orderCount: number;
}

interface SalesTrendChartProps {
  startDate: string;
  endDate: string;
  rows: ISalesByPeriodDto[];
  loading?: boolean;
}

function toDateKey(value: string): string {
  return value.slice(0, 10);
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildDailySeries(startDate: string, endDate: string, rows: ISalesByPeriodDto[]): IChartPoint[] {
  const byDate = new Map(rows.map((row) => [toDateKey(row.saleDate), row]));
  const points: IChartPoint[] = [];
  const cursor = new Date(`${startDate}T00:00:00`);
  const last = new Date(`${endDate}T00:00:00`);

  while (cursor <= last) {
    const key = formatLocalDate(cursor);
    const row = byDate.get(key);
    points.push({
      date: key,
      total: row?.total ?? 0,
      orderCount: row?.orderCount ?? 0,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return points;
}

function formatAxisDate(value: string): string {
  return new Intl.DateTimeFormat('es-CR', { day: '2-digit', month: 'short' }).format(
    new Date(`${value}T00:00:00`),
  );
}

export function SalesTrendChart({ startDate, endDate, rows, loading = false }: SalesTrendChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const points = useMemo(() => buildDailySeries(startDate, endDate, rows), [endDate, rows, startDate]);
  const hasSales = points.some((point) => point.total > 0);

  const chart = useMemo(() => {
    const width = 760;
    const height = 240;
    const padding = { top: 18, right: 16, bottom: 28, left: 16 };
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    const max = Math.max(...points.map((point) => point.total), 1);

    const coords = points.map((point, index) => {
      const x =
        points.length === 1
          ? padding.left + innerWidth / 2
          : padding.left + (index / (points.length - 1)) * innerWidth;
      const y = padding.top + innerHeight - (point.total / max) * innerHeight;
      return { ...point, x, y };
    });

    const line = coords.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const area = `${line} L ${coords[coords.length - 1]?.x ?? padding.left} ${padding.top + innerHeight} L ${coords[0]?.x ?? padding.left} ${padding.top + innerHeight} Z`;

    return { width, height, coords, line, area };
  }, [points]);

  if (loading) {
    return <p className="sk-admin-empty">Trazando la curva de ventas...</p>;
  }

  if (!hasSales) {
    return (
      <p className="sk-admin-empty">
        Cuando se registren ventas en este periodo, aquí verás la curva diaria del atelier.
      </p>
    );
  }

  const activePoint = activeIndex !== null ? chart.coords[activeIndex] : chart.coords[chart.coords.length - 1];

  return (
    <div className="sk-admin-chart">
      <div className="sk-admin-chart__meta">
        <p className="sk-kicker">Tendencia diaria</p>
        <strong>{formatPrice(activePoint.total)}</strong>
        <span>
          {formatAxisDate(activePoint.date)} · {activePoint.orderCount}{' '}
          {activePoint.orderCount === 1 ? 'orden' : 'órdenes'}
        </span>
      </div>
      <svg
        className="sk-admin-chart__svg"
        viewBox={`0 0 ${chart.width} ${chart.height}`}
        role="img"
        aria-label="Ventas diarias del periodo seleccionado"
        onMouseLeave={() => setActiveIndex(null)}
      >
        <defs>
          <linearGradient id="skAdminSalesFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.38" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={chart.area} fill="url(#skAdminSalesFill)" />
        <path d={chart.line} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinejoin="round" />
        {chart.coords.map((point, index) => (
          <g key={point.date}>
            <rect
              x={Math.max(point.x - 12, 0)}
              y={0}
              width="24"
              height={chart.height}
              fill="transparent"
              onMouseEnter={() => setActiveIndex(index)}
            />
            {activeIndex === index && (
              <>
                <line
                  x1={point.x}
                  x2={point.x}
                  y1={18}
                  y2={chart.height - 28}
                  stroke="currentColor"
                  strokeOpacity="0.18"
                />
                <circle cx={point.x} cy={point.y} r="5" fill="var(--color-accent)" />
              </>
            )}
          </g>
        ))}
      </svg>
      <div className="sk-admin-chart__axis">
        <span>{formatAxisDate(points[0].date)}</span>
        <span>{formatAxisDate(points[points.length - 1].date)}</span>
      </div>
    </div>
  );
}
