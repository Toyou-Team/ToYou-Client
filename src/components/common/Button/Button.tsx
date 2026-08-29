import { type ButtonHTMLAttributes, ReactNode, memo } from 'react';

import clsx from 'clsx';
import { buttonStyle } from './button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  outlined?: boolean;
  selected?: boolean;
}

function Button({ children, className, outlined, selected, ...buttonElementProps }: ButtonProps) {
  return (
    <button className={clsx(buttonStyle({ outlined, selected }), className)} {...buttonElementProps}>
      {children}
    </button>
  );
}

export default memo(Button);
