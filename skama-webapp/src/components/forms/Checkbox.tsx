import FormControlLabel from '@mui/material/FormControlLabel';
import MuiCheckbox, { type CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox';

export type CheckboxProps = MuiCheckboxProps & {
  label?: string;
};

export function Checkbox({ label, ...props }: CheckboxProps) {
  if (label) {
    return (
      <FormControlLabel
        control={<MuiCheckbox color="primary" {...props} />}
        label={label}
      />
    );
  }

  return <MuiCheckbox color="primary" {...props} />;
}
