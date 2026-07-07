import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MuiRadioGroup, {
  type RadioGroupProps as MuiRadioGroupProps,
} from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormHelperText from '@mui/material/FormHelperText';

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps extends MuiRadioGroupProps {
  label?: string;
  options: RadioOption[];
  helperText?: string;
  error?: boolean;
}

export function RadioGroup({
  label,
  options,
  helperText,
  error,
  ...props
}: RadioGroupProps) {
  return (
    <FormControl error={error}>
      {label && <FormLabel>{label}</FormLabel>}
      <MuiRadioGroup {...props}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio color="primary" />}
            label={option.label}
          />
        ))}
      </MuiRadioGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
