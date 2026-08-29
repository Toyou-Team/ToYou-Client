'use client';

import * as styles from './textField.css';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean;
  helperText: string;
  helperTextType?: 'default' | 'error' | 'success';
}

function TextField({ isError = false, helperText, helperTextType = 'default', ...inputProps }: TextFieldProps) {
  return (
    <>
      <div className={styles.textFieldWrapper({ isError })}>
        <input className={styles.textFieldInput} {...inputProps} />
      </div>
      {helperText && <p className={styles.helperText({ type: helperTextType })}>{helperText}</p>}
    </>
  );
}

export default TextField;
