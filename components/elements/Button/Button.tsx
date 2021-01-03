import React from 'react';
import styles from './Button.module.css';

export interface OuterProps {
  kind: any,
  children: React.ReactNode,
  component?: 'a' | 'button',
}

const kindMap = {
  primary: styles['button--primary'],
  secondary: styles['button--secondary'],
};

const Button = ({
  component,
  children,
  kind,
  ...rest
}) => {
  const Component = component || 'button';

  return (
    <Component
      className={`${styles.button} ${kindMap[kind]}`}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Button;
