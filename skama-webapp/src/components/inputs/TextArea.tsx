import TextField, { type TextFieldProps } from '@mui/material/TextField';

export type TextAreaProps = TextFieldProps;

export function TextArea({ rows = 4, ...props }: TextAreaProps) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      multiline
      rows={rows}
      size="medium"
      {...props}
    />
  );
}
