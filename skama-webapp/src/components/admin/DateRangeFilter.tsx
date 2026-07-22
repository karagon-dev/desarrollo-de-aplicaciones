import Box from '@mui/material/Box';
import { Input } from '../inputs';
import { Button } from '../buttons';
import { tokens } from '../../utils';

export interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onApply?: () => void;
  loading?: boolean;
  applyLabel?: string;
}

export function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
  loading = false,
  applyLabel = 'Apply',
}: DateRangeFilterProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: tokens.spacing.md,
        flexWrap: 'wrap',
        alignItems: 'flex-end',
      }}
    >
      <Input
        label="From"
        type="date"
        value={startDate}
        onChange={(event) => onStartDateChange(event.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ maxWidth: 200 }}
      />
      <Input
        label="To"
        type="date"
        value={endDate}
        onChange={(event) => onEndDateChange(event.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ maxWidth: 200 }}
      />
      {onApply && (
        <Button onClick={onApply} disabled={loading}>
          {loading ? 'Loading...' : applyLabel}
        </Button>
      )}
    </Box>
  );
}
