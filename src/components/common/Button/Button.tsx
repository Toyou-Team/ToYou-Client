import { type ButtonHTMLAttributes, ReactNode, memo } from 'react';

import clsx from 'clsx';
import { buttonStyle, type ButtonVariants } from './button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  children: ReactNode;
}

function Button({ children, className, variant, size, ...buttonElementProps }: ButtonProps) {
  return (
    <button className={clsx(buttonStyle({ variant, size }), className)} {...buttonElementProps}>
      {children}
    </button>
  );
}

export default memo(Button);
