import TextField, { type TextFieldProps } from '@mui/material/TextField';

export type InputProps = TextFieldProps;

export function Input(props: InputProps) {
  return <TextField fullWidth variant="outlined" size="medium" {...props} />;
}
